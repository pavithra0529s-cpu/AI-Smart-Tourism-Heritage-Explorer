import React, { useState } from 'react';

function PasswordReset() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:5001/api/user/reset-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Request failed.');
        return;
      }

      if (data.otp) {
        setGeneratedOtp(String(data.otp));
        setStep(2);
        setMessage(
          'Testing mode: OTP backend response-la generate aagiyirukku.'
        );
      } else {
        setMessage(data.message || 'OTP generated.');
      }
    } catch (error) {
      setMessage(
        'Backend connect aagala. Backend running-la irukka nu check pannunga.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();

    if (otp.trim() === generatedOtp) {
      setMessage(
        'OTP correct! Next step-la new password feature connect pannalam.'
      );
    } else {
      setMessage('OTP incorrect. Thirumba check pannunga.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Forgot Password</h2>

      {step === 1 && (
        <form onSubmit={handlePasswordReset}>
          <label htmlFor="reset-email">Registered email</label>
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            required
            style={styles.input}
          />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Please wait...' : 'Generate OTP'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp}>
          <p>OTP generated in testing mode.</p>
          <p>
            Backend response OTP: <strong>{generatedOtp}</strong>
          </p>

          <label htmlFor="reset-otp">Enter OTP</label>
          <input
            id="reset-otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Verify OTP
          </button>
        </form>
      )}

      {message && <p role="status">{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '60px auto',
    padding: '24px',
    fontFamily: 'Arial, sans-serif',
  },
  input: {
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px',
    margin: '12px 0',
    border: '1px solid #ccc',
    borderRadius: '6px',
  },
  button: {
    padding: '12px 18px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%',
  },
};

export default PasswordReset;
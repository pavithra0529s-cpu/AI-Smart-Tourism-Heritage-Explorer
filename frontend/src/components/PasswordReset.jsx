
import React, { useState } from 'react';

function PasswordReset() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const sendRequest = async (url, body) => {
    const response = await fetch(`http://localhost:5001${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed.');
    }

    return data;
  };

  const handleGenerateOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const data = await sendRequest('/api/user/reset-password', {
        email: email.trim(),
      });

      setStep(2);
      setMessage(data.message || 'OTP sent. Check your email.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const data = await sendRequest('/api/user/verify-otp', {
        email: email.trim(),
        otp: otp.trim(),
      });

      setStep(3);
      setMessage(data.message || 'OTP verified.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const data = await sendRequest('/api/user/complete-reset', {
        email: email.trim(),
        password,
        confirm_password: confirmPassword,
      });

      setMessage(data.message || 'Password updated successfully.');
      setStep(4);
      setOtp('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px',
    margin: '12px 0',
    border: '1px solid #ccc',
    borderRadius: '6px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: loading ? 'wait' : 'pointer',
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '60px auto',
      padding: '24px',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h2>Forgot Password</h2>

      {step === 1 && (
        <form onSubmit={handleGenerateOtp}>
          <label htmlFor="reset-email">Registered email</label>
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            required
            style={inputStyle}
          />
          <button disabled={loading} style={buttonStyle}>
            {loading ? 'Sending...' : 'Generate OTP'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp}>
          <p>Enter the OTP sent to your email.</p>
          <label htmlFor="reset-otp">OTP</label>
          <input
            id="reset-otp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            style={inputStyle}
          />
          <button disabled={loading} style={buttonStyle}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleUpdatePassword}>
          <label htmlFor="new-password">New password</label>
          <input
            id="new-password"
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
            placeholder="At least 8 characters"
          />

          <label htmlFor="confirm-password">Confirm new password</label>
          <input
            id="confirm-password"
            type="password"
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <button disabled={loading} style={buttonStyle}>
            {loading ? 'Updating...' : 'Reset Password'}
          </button>
        </form>
      )}

      {step === 4 && (
        <button
          type="button"
          style={buttonStyle}
          onClick={() => {
            setStep(1);
            setEmail('');
            setMessage('');
          }}
        >
          Done
        </button>
      )}

      {message && <p role="status">{message}</p>}
    </div>
  );
}

export default PasswordReset;

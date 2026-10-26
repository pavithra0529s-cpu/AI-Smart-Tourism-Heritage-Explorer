import os
import requests
import json
import smtplib
import random
import time

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI

from services.translate_service import translate_text
from services.tts_service import text_to_speech
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

TOURISM_DATA_FILE = os.path.join(
    BASE_DIR, "data", "tourism_data.json"
)

def load_tourism_data():
    try:
        with open(TOURISM_DATA_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)

        if not isinstance(data, list):
            raise ValueError("Tourism data must be a JSON list.")

        return data

    except (OSError, json.JSONDecodeError, ValueError) as error:
        print(f"Tourism dataset loading error: {error}")
        return []

TOURISM_DATA = load_tourism_data()
print(f"Tourism places loaded: {len(TOURISM_DATA)}", flush=True)
def search_tourism_data(query):
    query_words = set(query.lower().split())
    results = []

    for place in TOURISM_DATA:
        searchable_text = (
            place.get("name", "") + " "
            + place.get("location", "") + " "
            + place.get("type", "") + " "
            + place.get("description", "")
        ).lower()

        score = sum(
            1 for word in query_words
            if len(word) > 2 and word in searchable_text
        )

        if score > 0:
            results.append((score, place))

    results.sort(key=lambda item: item[0], reverse=True)

    return [place for score, place in results[:3]]

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
def send_otp_email(receiver_email, otp):
    sender_email = os.getenv("SMTP_EMAIL")
    app_password = os.getenv("SMTP_APP_PASSWORD")

    if not sender_email or not app_password:
        raise RuntimeError(
            "SMTP_EMAIL or SMTP_APP_PASSWORD missing in .env"
        )

    message = (
        "Subject: AI Tourist Guide - Password Reset OTP\n"
        "From: AI Tourist Guide\n"
        f"To: {receiver_email}\n"
        "Content-Type: text/plain; charset=utf-8\n\n"
        f"Your password reset OTP is: {otp}\n\n"
        "This OTP expires in 5 minutes. "
        "If you did not request this, ignore this email."
    )

    with smtplib.SMTP_SSL(
      "smtp.gmail.com",
        465,
        timeout=30
    ) as server:
       server.login(sender_email, app_password)
       server.sendmail(
         sender_email,
         [receiver_email],
         message.encode("utf-8")
      )

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()
migrate = Migrate()


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "SQLALCHEMY_DATABASE_URI"
    )

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # Temporary storage for password-reset OTPs.
    # OTPs expire after 5 minutes.
    password_reset_otps = {}

    class User(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        username = db.Column(
            db.String(100), nullable=False, unique=True
        )
        password = db.Column(
            db.String(255), nullable=False
        )
        email = db.Column(
            db.String(120), nullable=True, unique=True
        )

        def __init__(self, username, password, email):
            self.username = username
            self.password = password
            self.email = email

        def __repr__(self):
            return f"<User {self.username}>"

    # REGISTER
    @app.route("/api/register", methods=["POST"])
    def register():
        try:
            data = request.get_json() or {}
            username = (data.get("username") or "").strip()
            email = (data.get("email") or "").strip().lower()
            password = data.get("password") or ""

            if not username or not password or not email:
                return jsonify({
                    "message": "Username, email and password are required!"
                }), 400

            if User.query.filter_by(username=username).first():
                return jsonify({
                    "message": "User already exists!"
                }), 409

            if User.query.filter_by(email=email).first():
                return jsonify({
                    "message": "Email already exists!"
                }), 409

            hashed_password = bcrypt.generate_password_hash(
                password
            ).decode("utf-8")

            new_user = User(
                username=username,
                password=hashed_password,
                email=email,
            )

            db.session.add(new_user)
            db.session.commit()
            return jsonify({
                "message": "Registration successful!"
            }), 201

        except Exception as e:
            db.session.rollback()
            print(f"Registration error: {e}")
            return jsonify({
                "message": "An error occurred during registration."
            }), 500

    # LOGIN
    @app.route("/api/login", methods=["POST"])
    def login():
        try:
            data = request.get_json() or {}
            username = data.get("username")
            password = data.get("password")

            if not username or not password:
                return jsonify({
                    "message": "Username and password required!"
                }), 400

            user = User.query.filter_by(username=username).first()

            if (
                not user
                or not bcrypt.check_password_hash(
                    user.password, password
                )
            ):
                return jsonify({
                    "message": "Invalid credentials!"
                }), 401

            access_token = create_access_token(
                identity=username
            )

            return jsonify({
                "access_token": access_token
            }), 200

        except Exception as e:
            print(f"Login error: {e}")
            return jsonify({
                "message": "An error occurred during login."
            }), 500

    # REQUEST PASSWORD-RESET OTP
    @app.route("/api/user/reset-password", methods=["POST"])
    def reset_password():
        try:
            data = request.get_json() or {}
            email = (
                data.get("email") or ""
            ).strip().lower()

            if not email:
                return jsonify({
                    "message": "Email is required!"
                }), 400

            user = User.query.filter_by(email=email).first()

            if not user:
                return jsonify({
                    "message": "Email not found!"
                }), 404

            otp = str(random.randint(100000, 999999))
            send_otp_email(email, otp)

            password_reset_otps[email] = {
                "otp": otp,
                "expires_at": time.time() + 300,
                "verified": False,
            }

            # Development/testing only. Do not expose OTPs
            # in the response in a production application.
            print(f"Password reset OTP generated for {email}")

            return jsonify({
              "message": "OTP sent to your email. Check your inbox."
            }), 200 

        except Exception as e:
            print(f"Password-reset error: {e}")
            return jsonify({
                "message": "An error occurred during password reset."
            }), 500

    # VERIFY OTP ON THE BACKEND
    @app.route("/api/user/verify-otp", methods=["POST"])
    def verify_reset_otp():
        data = request.get_json() or {}
        email = (
            data.get("email") or ""
        ).strip().lower()
        otp = str(data.get("otp") or "").strip()

        record = password_reset_otps.get(email)

        if not email or not otp or not record:
            return jsonify({
                "message": "Request a new OTP first."
            }), 400

        if time.time() > record["expires_at"]:
            password_reset_otps.pop(email, None)
            return jsonify({
                "message": "OTP expired. Request a new OTP."
            }), 400

        if record["otp"] != otp:
            return jsonify({
                "message": "Incorrect OTP."
            }), 400

        record["verified"] = True

        return jsonify({
            "message": "OTP verified successfully!"
        }), 200

    # SAVE NEW PASSWORD AFTER OTP VERIFICATION
    @app.route("/api/user/complete-reset", methods=["POST"])
    def complete_password_reset():
        data = request.get_json() or {}
        email = (
            data.get("email") or ""
        ).strip().lower()
        password = data.get("password") or ""
        confirm_password = data.get("confirm_password") or ""

        record = password_reset_otps.get(email)

        if not record or not record.get("verified"):
            return jsonify({
                "message": "Verify your OTP before resetting your password."
            }), 400

        if time.time() > record["expires_at"]:
            password_reset_otps.pop(email, None)
            return jsonify({
                "message": "OTP expired. Request a new OTP."
            }), 400

        if len(password) < 8:
            return jsonify({
                "message": "Password must be at least 8 characters."
            }), 400

        if password != confirm_password:
            return jsonify({
                "message": "Passwords do not match!"
            }), 400

        try:
            user = User.query.filter_by(email=email).first()

            if not user:
                return jsonify({
                    "message": "User not found."
                }), 404

            user.password = bcrypt.generate_password_hash(
                password
            ).decode("utf-8")

            db.session.commit()
            password_reset_otps.pop(email, None)

            return jsonify({
                "message": "Password updated successfully!"
            }), 200

        except Exception as e:
            db.session.rollback()
            print(f"Password update error: {e}")
            return jsonify({
                "message": "Could not update password."
            }), 500

    # UPDATE PROFILE
    @app.route("/api/update_profile", methods=["POST"])
    @jwt_required()
    def update_profile():
        try:
            username_now = get_jwt_identity()
            data = request.get_json() or {}

            new_username = data.get("username")
            new_password = data.get("password")

            user = User.query.filter_by(
                username=username_now
            ).first()

            if not user:
                return jsonify({
                    "message": "User not found!"
                }), 404

            if new_username:
                other_user = User.query.filter_by(
                    username=new_username
                ).first()

                if other_user and other_user.id != user.id:
                    return jsonify({
                        "message": "Username already exists!"
                    }), 409

                user.username = new_username

            if new_password:
                user.password = bcrypt.generate_password_hash(
                    new_password
                ).decode("utf-8")

            db.session.commit()

            return jsonify({
                "message": "Profile updated successfully!"
            }), 200

        except Exception as e:
           import traceback
           traceback.print_exc()
           return jsonify({
               "message": str(e)
           }), 500

        # CHATBOT
    @app.route("/api/chatbot", methods=["POST"])
    def chatbot():
        try:
            data = request.get_json(silent=True) or {}

            user_message = (
                data.get("user_message")
                or data.get("message")
                or ""
            ).strip()

            if not user_message:
                return jsonify({
                    "error": "Please enter a message."
                }), 400
            relevant_places = search_tourism_data(user_message)

            tourism_context = json.dumps(
                relevant_places,
                ensure_ascii=False,
                indent=2
            )
            # Send the question to the local Ollama AI
            response = requests.post(
                "http://127.0.0.1:11434/api/chat",
                json={
                    "model": "llama3.2:3b",
                    "messages": [
                                                {
                            "role": "system",
                            "content": (
                                "You are an AI tourist guide for Tamil Nadu "
                                "and India. Answer in simple English. "
                                "Answer factual questions using only the TOURISM DATA provided below. "
                                "Do not use outside knowledge to add facts. "
                                "If the answer is not present in the dataset, say: "
                                "'Information not available in the dataset.' "
                                "The dataset is sample reference information, "
                                "not officially verified information. "
                                "Do not invent prices, opening hours, dates, "
                                "or historical facts. If the dataset does "
                                "not contain the answer, clearly say so.\n\n"
                                "TOURISM DATA:\n"
                                + tourism_context
                            )
                        },
                        {
                            "role": "user",
                            "content": user_message
                        }
                    ],
                    "stream": False
                },
                timeout=120
            )

            response.raise_for_status()
            result = response.json()

            reply = (
                result.get("message", {}).get("content", "")
            ).strip()

            if not reply:
                return jsonify({
                    "error": "The AI returned an empty response."
                }), 502

            source_urls = [
                place["source_url"]
                for place in relevant_places
                if place.get("source_url")
            ]

            return jsonify({
                "reply": reply,
                "sources": source_urls
            }), 200

        except requests.exceptions.ConnectionError:
            print("Ollama connection error: Is Ollama running?")

            return jsonify({
                "error": (
                    "Ollama is not running. Please start Ollama "
                    "and try again."
                )
            }), 503

        except requests.exceptions.Timeout:
            return jsonify({
                "error": (
                    "The AI response took too long. Please try again."
                )
            }), 504

        except requests.exceptions.HTTPError as e:
            print(f"Ollama HTTP error: {e}")

            return jsonify({
                "error": (
                    "The AI service returned an error. "
                    "Please check Ollama and the model."
                )
            }), 502

        except Exception as e:
            print(f"Chatbot error: {e}")

            return jsonify({
                "error": "The chatbot could not respond right now."
            }), 500
                # PERSONALIZED AI ITINERARY
    @app.route("/api/itinerary", methods=["POST"])
    def generate_itinerary():
        try:
            data = request.get_json(silent=True) or {}

            destination = str(data.get("destination", "")).strip()
            days = data.get("days", 1)
            budget = data.get("budget", 0)
            interests = data.get("interests", [])

            if not destination:
                return jsonify({
                    "error": "Please enter a destination."
                }), 400

            try:
                days = int(days)
                budget = float(budget)
            except (ValueError, TypeError):
                return jsonify({
                    "error": "Days and budget must be valid numbers."
                }), 400

            if days < 1 or days > 14 or budget < 0:
                return jsonify({
                    "error": "Days must be 1-14 and budget cannot be negative."
                }), 400

            if isinstance(interests, list):
                interests_text = ", ".join(
                    str(item) for item in interests
                )
            else:
                interests_text = str(interests)

            relevant_places = search_tourism_data(destination)

            tourism_context = json.dumps(
                relevant_places,
                ensure_ascii=False,
                indent=2
            )

            prompt = (
                f"Create a {days}-day tourism itinerary for {destination}. "
                f"Total budget: {budget} INR. "
                f"Interests: {interests_text}. "
                "Use only the tourism data below for factual destination details. "
                "Do not invent entry fees, travel costs, opening hours, or distances. "
                "If there is not enough data, clearly mention that. "
                "Create the itinerary using the relevant places listed below. "
                "Include every relevant place at least once when enough days are available. "
                "Do not repeat a place when another relevant place is available. "
                "Do not claim that entry is free unless the dataset explicitly says so. "
                "Do not invent prices, fees, opening hours, or activities. "
                "Clearly state when budget details are unavailable.\n\n"
                f"TOURISM DATA:\n{tourism_context}"
            )

            response = requests.post(
                "http://127.0.0.1:11434/api/chat",
                json={
                    "model": "llama3.2:3b",
                    "messages": [
                        {
                            "role": "system",
                            "content": (
                            "You are a careful AI travel planner. "
                            "Recommend ONLY places whose exact names appear in the TOURISM DATA. "
                            "Never recommend other places, attractions, rivers, markets, or buildings. "
                            "Do not invent locations, distances, opening hours, entry fees, or costs. "
                            "If the dataset does not contain enough places for the requested number of days, "
                            "clearly say that verified information is limited. "
                            "You may repeat a known place across days, but do not invent new places. "
                            "Use simple English and follow the user's budget without inventing prices."
                            "If entry fees, travel costs, and other expenses are not in the dataset, "
                            "clearly state that the budget cannot be verified. Never say the budget is sufficient."
                            )
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "stream": False
                },
                timeout=120
            )

            response.raise_for_status()
            result = response.json()

            itinerary = (
                result.get("message", {}).get("content", "")
            ).strip()

            if not itinerary:
                return jsonify({
                    "error": "The AI returned an empty itinerary."
                }), 502

            if (
                "budget" in itinerary.lower()
                and (
                    "sufficient" in itinerary.lower()
                    or "stays within" in itinerary.lower()
                    or "within the budget" in itinerary.lower()
                )
            ):
                itinerary += (
                    "\n\nBudget note: The dataset does not contain verified "
                    "entry fees, travel costs, or other expenses. "
                    "Therefore, the total budget cannot be verified."
                )
            source_urls = [
                place["source_url"]
                for place in relevant_places
                if place.get("source_url")
            ]
            itinerary += (
                "\n\nBudget note: Verified entry fees, travel costs, "
                "and other expenses are not available in the dataset. "
                "The total trip budget therefore cannot be verified."
            )

            return jsonify({
                "destination": destination,
                "days": days,
                "budget": budget,
                "interests": interests_text,
                "itinerary": itinerary,
                "sources": source_urls
            }), 200

        except requests.exceptions.ConnectionError:
            return jsonify({
                "error": "Ollama is not running. Please start Ollama."
            }), 503

        except requests.exceptions.Timeout:
            return jsonify({
                "error": "The itinerary request timed out. Please try again."
            }), 504

        except Exception as e:
            print(f"Itinerary error: {e}")
            return jsonify({
                "error": "Could not generate the itinerary."
            }), 500
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(
        host="0.0.0.0",
        port=5001,
        debug=True
    )
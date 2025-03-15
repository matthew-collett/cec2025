# app/__init__.py
from flask import Flask
from flask_cors import CORS
import tensorflow as tf
from dotenv import load_dotenv, find_dotenv

# Global variable to store the model
model = None

load_dotenv(find_dotenv())


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Load model at startup
    global model
    from app.logic.config import MODEL_PATH
    print(f"Loading model from {MODEL_PATH}")
    model = tf.keras.models.load_model(MODEL_PATH)
    print(f"Model loaded from {MODEL_PATH}")

    # Register blueprints
    from app.blueprints.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    # Initialize Firebase
    from app import firebase

    return app

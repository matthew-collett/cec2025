import os
import firebase_admin  # Add this import
from firebase_admin import credentials, auth

current_dir = os.path.dirname(os.path.abspath(__file__))
service_account_path = os.path.join(
    current_dir, '..', 'firebase-service-account.json')
cred = credentials.Certificate(service_account_path)
firebase_app = firebase_admin.initialize_app(cred)

# api/app/auth.py
from functools import wraps
from flask import request, jsonify
from firebase_admin import auth
from firebase_admin.exceptions import FirebaseError


def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')

        if not auth_header.startswith('Bearer '):
            return jsonify({'message': 'Missing or invalid authentication token'}), 401

        token = auth_header.split('Bearer ')[1]

        try:
            decoded_token = auth.verify_id_token(token)

            request.user = decoded_token

            return f(*args, **kwargs)
        except FirebaseError as e:
            return jsonify({'message': f'Invalid authentication token: {str(e)}'}), 401
        except Exception as e:
            return jsonify({'message': f'Authentication error: {str(e)}'}), 500

    return decorated_function

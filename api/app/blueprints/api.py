from flask import Blueprint, jsonify, request
from datetime import datetime
from app.middlewares.auth import token_required
import os
from app import model
from app.logic.config import IMG_SIZE
import cv2
import numpy as np
import uuid
from app.services.DatabaseService import DatabaseService
from app.services.QueryBuilder import QueryBuilder
from app.services.ObjectFormatter import format_object, format_objects

bp = Blueprint('api', __name__)

DATEBASE_SERVICE = DatabaseService()
MODEL_CONTAINER = 'Models'
PREDICTION_CONTAINER = 'Predictions'
UPLOAD_FOLDER = './temp_uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ------------- Models -------------
@bp.route('/model-info/<uid>', methods=['GET'])
@token_required
def model_info(uid):
    if uid is None:
        return jsonify({'message': 'Unauthorized'}), 401
    try:
        query_builder = QueryBuilder()
        query_builder.where('userId', '1')
        query = query_builder.build()
        model = DATEBASE_SERVICE.get_item(query, MODEL_CONTAINER)
        if model:
            cleaned_model = format_object(model)
            return jsonify(cleaned_model), 200
        return jsonify({'message': 'Model not found'}), 404
    except Exception as e:
        return jsonify({'message': f'An error occurred {e}'}), 500


# ------------- Predictions -------------
def preprocess_image(image_path):
    """Load and preprocess image for prediction"""
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    image = cv2.resize(image, (28, 28))
    image = image / 255.0
    image = np.expand_dims(image, axis=(0, -1))
    return image


@bp.route('/predict/<uid>', methods=['POST'])
@token_required
def predict(uid):
    if not uid:
        return jsonify({'error': 'uid required'}), 400
    MAX_FILES = 100  # Set a reasonable limit

    if 'images' not in request.files:
        return jsonify({'error': 'No image files provided'}), 400

    files = request.files.getlist('images')
    if not files or files[0].filename == '':
        return jsonify({'error': 'No images selected'}), 400

    batch_id = request.form.get('batchId')

    # Limit the number of files
    if len(files) > MAX_FILES:
        return jsonify({'error': f'Too many files. Maximum allowed is {MAX_FILES}'}), 400

    predictions = []
    temp_paths = []

    try:
        for file in files:
            temp_path = f"temp_{file.filename}"
            temp_paths.append(temp_path)
            file.save(temp_path)

            image = preprocess_image(temp_path)
            prediction = model.predict(image)

            predictions.append({
                'filename': file.filename,
                'hasTumor': bool(prediction[0][0] > 0.5)
            })

        response = {
            'id': str(uuid.uuid4()),
            'batchId': batch_id,
            'timestamp': datetime.now().isoformat(),
            'userId': uid,
            'predictions': predictions
        }

        DATEBASE_SERVICE.upsert_item(response, PREDICTION_CONTAINER)

        return jsonify(response), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        for path in temp_paths:
            if os.path.exists(path):
                os.remove(path)


@bp.route('/get-predictions/<uid>', methods=['GET'])
@token_required
def get_predictions(uid):
    if uid is None:
        return jsonify({'message': 'Unauthorized'}), 401

    try:
        query_builder = QueryBuilder()
        query_builder.where('userId', uid)
        query = query_builder.build()
        uploads = DATEBASE_SERVICE.query_items(query, PREDICTION_CONTAINER)

        if uploads:
            # Create a dictionary to group predictions by batchId
            batched_uploads = {}

            for upload in uploads:
                batch_id = upload.get('batchId')

                # If no batchId exists or it's None, treat as a standalone upload
                if not batch_id:
                    # Use timestamp as a unique key for non-batched uploads
                    key = upload.get('timestamp', str(uuid.uuid4()))
                    batched_uploads[key] = upload
                    continue

                # For uploads with batchId
                if batch_id in batched_uploads:
                    # Merge predictions from the same batch
                    existing_predictions = batched_uploads[batch_id]['predictions']
                    new_predictions = upload.get('predictions', [])

                    # Combine prediction lists
                    batched_uploads[batch_id]['predictions'] = existing_predictions + \
                        new_predictions
                else:
                    # First entry with this batchId
                    batched_uploads[batch_id] = upload

            # Convert back to list
            merged_uploads = list(batched_uploads.values())

            # Sort by timestamp (newest first)
            merged_uploads.sort(key=lambda x: x.get(
                'timestamp', ''), reverse=True)

            return jsonify(format_objects(merged_uploads)), 200

        return jsonify({'message': 'No predictions found'}), 404

    except Exception as e:
        print(f"Error fetching predictions: {str(e)}")
        return jsonify({'message': 'An error occurred'}), 500

import numpy as np
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix
from preprocess import load_data
from config import MODEL_PATH, STATS_PATH


def evaluate_model():
    """ Load trained model, test on dataset, compute & save metrics. """
    model = tf.keras.models.load_model(MODEL_PATH)
    _, validation_generator = load_data()  # Use validation data for evaluation

    y_true = validation_generator.classes
    y_pred_prob = model.predict(validation_generator)
    # Convert probabilities to binary labels
    y_pred = (y_pred_prob > 0.5).astype(int).flatten()

    # Compute confusion matrix
    tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()

    # Compute precision, recall, and accuracy
    precision = tp / (tp + fp) if (tp + fp) != 0 else 0
    recall = tp / (tp + fn) if (tp + fn) != 0 else 0
    accuracy = (tp + tn) / (tp + tn + fp + fn)

    # Save results to a file
    with open(STATS_PATH, "w") as f:
        f.write("===== Model Evaluation on Validation Data =====\n")
        f.write(f"Accuracy: {accuracy:.4f}\n")
        f.write(f"Precision: {precision:.4f}\n")
        f.write(f"Recall: {recall:.4f}\n")
        f.write(f"True Positives: {tp}\n")
        f.write(f"True Negatives: {tn}\n")
        f.write(f"False Positives: {fp}\n")
        f.write(f"False Negatives: {fn}\n")

    print(f"\nModel statistics saved at {STATS_PATH}")

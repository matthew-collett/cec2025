import sys
import os

# Ensure Python can find app.logic modules
sys.path.append(os.path.abspath("api/app"))

from app.logic.train_model import train_model
from app.logic.evaluate_model import evaluate_model

if __name__ == "__main__":
    print("Starting model training...")
    history = train_model()

    print("\nEvaluating model on test dataset...")
    evaluate_model()

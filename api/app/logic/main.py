from train_model import train_model
from evaluate_model import evaluate_model

if __name__ == "__main__":
    print("Starting model training...")
    history = train_model()

    print("\nEvaluating model on test dataset...")
    evaluate_model()

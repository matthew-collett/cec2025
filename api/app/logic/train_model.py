from preprocess import load_data
from config import MODEL_PATH, EPOCHS

import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization


def build_model():
    """ Define the optimized CNN architecture for brain tumor detection. """
    model = Sequential([
        Conv2D(64, (3, 3), activation='relu', input_shape=(128, 128, 1)),
        BatchNormalization(),
        Conv2D(64, (3, 3), activation='relu'),
        MaxPooling2D(2, 2),

        Conv2D(128, (3, 3), activation='relu'),
        BatchNormalization(),
        Conv2D(128, (3, 3), activation='relu'),
        MaxPooling2D(2, 2),

        Conv2D(256, (3, 3), activation='relu'),  # Added extra conv layer
        BatchNormalization(),
        Conv2D(256, (3, 3), activation='relu'),
        MaxPooling2D(2, 2),

        Flatten(),
        Dense(512, activation='relu'),  # Increased from 256 to 512
        Dropout(0.5),
        Dense(1, activation='sigmoid')  # Binary classification
    ])

    model.compile(optimizer="adam",
                  loss="binary_crossentropy",
                  metrics=["accuracy"])
    return model


def train_model():
    """ Train and save the CNN model. """
    train_generator, validation_generator = load_data(
    )  # Ensure images are loaded as 128x128
    model = build_model()

    print("\n===== Model Summary =====")
    model.summary()

    history = model.fit(
        train_generator,
        validation_data=validation_generator,
        epochs=EPOCHS
    )

    model.save(MODEL_PATH)
    print(f"\nModel saved at {MODEL_PATH}")

    return history

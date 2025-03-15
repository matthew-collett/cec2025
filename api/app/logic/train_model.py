from preprocess import load_data
from logic.config import MODEL_PATH, EPOCHS
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout


def build_model():
    """ Define the CNN architecture. """
    model = Sequential([
        Conv2D(64, (3, 3), activation='relu', input_shape=(128, 128, 1)),
        Conv2D(64, (3, 3), activation='relu'),
        MaxPooling2D(2, 2),
        Conv2D(128, (3, 3), activation='relu'),
        Conv2D(128, (3, 3), activation='relu'),
        MaxPooling2D(2, 2),
        Flatten(),
        Dense(256, activation='relu'),
        Dropout(0.5),
        Dense(1, activation='sigmoid')
    ])

    model.compile(optimizer="adam",
                  loss="binary_crossentropy",
                  metrics=["accuracy"])
    return model


def train_model():
    """ Train and save the CNN model. """
    train_generator, validation_generator = load_data()
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

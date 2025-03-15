import os
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from config import DATASET_PATH, IMG_SIZE, BATCH_SIZE


def load_data(validation_split=0.2):
    """ Load and preprocess training and validation datasets. """
    datagen = ImageDataGenerator(
        rescale=1.0 / 255.0, validation_split=validation_split)

    train_generator = datagen.flow_from_directory(
        DATASET_PATH,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        color_mode="grayscale",
        class_mode="binary",
        subset="training",
        classes=["yes", "no"]  # Only use these classes
    )

    validation_generator = datagen.flow_from_directory(
        DATASET_PATH,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        color_mode="grayscale",
        class_mode="binary",
        subset="validation",
        classes=["yes", "no"]  # Only use these classes
    )

    return train_generator, validation_generator

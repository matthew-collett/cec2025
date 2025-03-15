import os

# Dataset Paths
# DATASET_PATH = os.getenv("CEC_2025_dataset")
# if not DATASET_PATH:
#     raise ValueError("Environment variable 'CEC_2025_dataset' is not set!")

# TRAIN_YES_PATH = os.path.join(DATASET_PATH, "yes")
# TRAIN_NO_PATH = os.path.join(DATASET_PATH, "no")
# TEST_PATH = os.path.join(DATASET_PATH, "CEC_test")

# Model Path
MODEL_PATH = "app/logic/model/brain_tumor_classifier.h5"
STATS_PATH = "app/logic/model_statistics.txt"

# Image Processing
IMG_SIZE = (128, 128)
# BATCH_SIZE = 32
# EPOCHS = 10

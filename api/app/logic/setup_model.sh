#!/bin/bash

# Set the dataset path environment variable
export CEC_2025_dataset="/Users/aidan/Downloads/BScSWE/cec-2025/CEC_2025"
echo "Environment variable CEC_2025_dataset set to: $CEC_2025_dataset"

# Set PYTHONPATH so Python can find `app.logic` modules
export PYTHONPATH=$(pwd)
echo "PYTHONPATH set to: $PYTHONPATH"

# Run the training and evaluation script
echo "Running model training and evaluation..."
python main.py

echo "Setup and execution complete."
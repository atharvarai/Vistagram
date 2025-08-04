#!/usr/bin/env bash
# Build script for Render deployment

# Install dependencies
pip install -r requirements.txt

# Create uploads directory
mkdir -p uploads

# Initialize database
python seed_data.py 
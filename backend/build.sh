#!/usr/bin/env bash
# Build script for Render deployment

echo "Starting build process..."

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create uploads directory
echo "Creating uploads directory..."
mkdir -p uploads

# Initialize database
echo "Initializing database..."
python seed_data.py

echo "Build completed successfully!" 
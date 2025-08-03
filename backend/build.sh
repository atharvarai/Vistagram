#!/usr/bin/env bash
# Build script for Render deployment

# Create uploads directory
mkdir -p uploads

# Initialize database
python seed_data.py 
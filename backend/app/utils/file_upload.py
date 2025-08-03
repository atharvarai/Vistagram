import os
import uuid
from pathlib import Path
from fastapi import UploadFile, HTTPException
from PIL import Image
from app.core.config import settings


def validate_image_file(file: UploadFile) -> bool:
    """Validate if the uploaded file is a valid image."""
    if not file.content_type.startswith("image/"):
        return False
    
    file_extension = Path(file.filename).suffix.lower()
    return file_extension in settings.ALLOWED_EXTENSIONS


def save_image_file(file: UploadFile) -> str:
    """Save uploaded image file and return the file path."""
    if not validate_image_file(file):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only image files are allowed."
        )
    
    file_extension = Path(file.filename).suffix.lower()
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)
    
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    content = file.file.read()
    if len(content) > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File size too large. Maximum size is 10MB."
        )
    
    with open(file_path, "wb") as buffer:
        buffer.write(content)
    
    return unique_filename


def optimize_image(file_path: str) -> None:
    """Optimize image file for web display."""
    try:
        with Image.open(file_path) as img:
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')
            
            max_size = (1920, 1080)
            if img.size[0] > max_size[0] or img.size[1] > max_size[1]:
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            img.save(file_path, 'JPEG', quality=85, optimize=True)
    except Exception as e:
        print(f"Image optimization failed: {e}")


def delete_image_file(filename: str) -> bool:
    """Delete an image file from storage."""
    try:
        file_path = os.path.join(settings.UPLOAD_DIR, filename)
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        return False
    except Exception:
        return False


def get_image_url(filename: str) -> str:
    """Get the URL for an image file."""
    return f"/uploads/{filename}" 
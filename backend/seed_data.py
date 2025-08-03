import os
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.post import Post, Like, Share
from app.core.security import get_password_hash
from app.utils.file_upload import settings

# Sample data
SAMPLE_USERS = [
    {"username": "traveler_jane", "email": "jane@example.com", "password": "password123"},
    {"username": "adventure_mike", "email": "mike@example.com", "password": "password123"},
    {"username": "wanderlust_sarah", "email": "sarah@example.com", "password": "password123"},
    {"username": "explorer_tom", "email": "tom@example.com", "password": "password123"},
    {"username": "globetrotter_lisa", "email": "lisa@example.com", "password": "password123"},
]

SAMPLE_CAPTIONS = [
    "Amazing sunset at the beach! 🌅",
    "Exploring the hidden gems of the city 🏙️",
    "Coffee and architecture - perfect combination ☕",
    "Nature's beauty never fails to amaze me 🌿",
    "Street art that tells a story 🎨",
    "Local cuisine that blew my mind! 🍜",
    "Historic landmarks with modern vibes 🏛️",
    "Mountain views that take your breath away ⛰️",
    "Cultural experiences that enrich the soul 🎭",
    "Urban exploration at its finest 🚶‍♀️",
    "Sunrise hikes are always worth it 🌄",
    "Street photography moments 📸",
    "Architectural wonders around every corner 🏗️",
    "Local markets full of life and color 🛍️",
    "Peaceful moments in busy cities 🧘‍♀️",
]

SAMPLE_IMAGES = [
    "sample1.jpg",
    "sample2.jpg", 
    "sample3.jpg",
    "sample4.jpg",
    "sample5.jpg",
    "sample6.jpg",
    "sample7.jpg",
    "sample8.jpg",
    "sample9.jpg",
    "sample10.jpg",
]


def create_sample_users(db: Session):
    """Create sample users."""
    users = []
    for user_data in SAMPLE_USERS:
        # Check if user already exists
        existing_user = db.query(User).filter(User.username == user_data["username"]).first()
        if existing_user:
            users.append(existing_user)
            continue
        
        user = User(
            username=user_data["username"],
            email=user_data["email"],
            hashed_password=get_password_hash(user_data["password"])
        )
        db.add(user)
        users.append(user)
    
    db.commit()
    return users


def create_sample_posts(db: Session, users: list):
    """Create sample posts."""
    posts = []
    
    # Create posts over the last 30 days
    for i in range(50):  # Create 50 sample posts
        user = random.choice(users)
        caption = random.choice(SAMPLE_CAPTIONS)
        image_filename = random.choice(SAMPLE_IMAGES)
        
        # Random date within last 30 days
        days_ago = random.randint(0, 30)
        hours_ago = random.randint(0, 23)
        minutes_ago = random.randint(0, 59)
        created_at = datetime.now() - timedelta(
            days=days_ago, 
            hours=hours_ago, 
            minutes=minutes_ago
        )
        
        post = Post(
            user_id=user.id,
            image_path=image_filename,
            caption=caption,
            likes_count=random.randint(0, 50),
            shares_count=random.randint(0, 10),
            created_at=created_at
        )
        db.add(post)
        posts.append(post)
    
    db.commit()
    return posts


def create_sample_likes_and_shares(db: Session, users: list, posts: list):
    """Create sample likes and shares."""
    for post in posts:
        # Random likes
        num_likes = random.randint(0, min(20, len(users)))
        like_users = random.sample(users, num_likes)
        
        for user in like_users:
            like = Like(user_id=user.id, post_id=post.id)
            db.add(like)
        
        # Random shares
        num_shares = random.randint(0, min(5, len(users)))
        share_users = random.sample(users, num_shares)
        
        for user in share_users:
            share = Share(user_id=user.id, post_id=post.id)
            db.add(share)
    
    db.commit()


def create_sample_images():
    """Create sample image files."""
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    # Create placeholder images (simple colored rectangles)
    from PIL import Image, ImageDraw
    
    colors = [
        (255, 99, 71),   # Tomato
        (50, 205, 50),   # Lime Green
        (30, 144, 255),  # Dodger Blue
        (255, 215, 0),   # Gold
        (138, 43, 226),  # Blue Violet
        (255, 20, 147),  # Deep Pink
        (0, 255, 127),   # Spring Green
        (255, 69, 0),    # Orange Red
        (147, 112, 219), # Medium Purple
        (255, 140, 0),   # Dark Orange
    ]
    
    for i, filename in enumerate(SAMPLE_IMAGES):
        # Create a 400x300 image with random color
        img = Image.new('RGB', (400, 300), colors[i % len(colors)])
        draw = ImageDraw.Draw(img)
        
        # Add some text
        draw.text((50, 50), f"Sample Image {i+1}", fill=(255, 255, 255))
        draw.text((50, 80), "Vistagram", fill=(255, 255, 255))
        
        # Save the image
        file_path = os.path.join(settings.UPLOAD_DIR, filename)
        img.save(file_path, 'JPEG', quality=85)


def main():
    """Main function to seed the database."""
    print("🌱 Starting database seeding...")
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    
    # Create sample images
    print("📸 Creating sample images...")
    create_sample_images()
    
    # Get database session
    db = SessionLocal()
    
    try:
        # Create sample users
        print("👥 Creating sample users...")
        users = create_sample_users(db)
        print(f"✅ Created {len(users)} users")
        
        # Create sample posts
        print("📝 Creating sample posts...")
        posts = create_sample_posts(db, users)
        print(f"✅ Created {len(posts)} posts")
        
        # Create sample likes and shares
        print("❤️ Creating sample likes and shares...")
        create_sample_likes_and_shares(db, users, posts)
        print("✅ Created sample interactions")
        
        print("🎉 Database seeding completed successfully!")
        print(f"📊 Summary:")
        print(f"   - Users: {len(users)}")
        print(f"   - Posts: {len(posts)}")
        print(f"   - Sample images: {len(SAMPLE_IMAGES)}")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main() 
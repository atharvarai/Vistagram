#!/usr/bin/env python3
"""
Redis Manager for Vistagram
Development utility to manage Redis data
"""

import sys
import os

# Add the app directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from app.core.redis import redis_service
from app.utils.redis_sync import sync_all_data_to_redis


def check_redis_connection():
    """Check Redis connection status."""
    print("🔍 Checking Redis connection...")
    if redis_service.ping():
        print("✅ Redis is connected and healthy")
        return True
    else:
        print("❌ Redis connection failed")
        print("💡 Make sure Redis server is running: redis-server")
        return False


def flush_redis_data():
    """Flush all Redis data."""
    print("⚠️  This will delete ALL Redis data!")
    confirm = input("Are you sure? (y/N): ").lower()
    
    if confirm == 'y':
        try:
            redis_service.client.flushdb()
            print("✅ Redis data flushed successfully")
        except Exception as e:
            print(f"❌ Failed to flush Redis: {e}")
    else:
        print("🚫 Operation cancelled")


def show_redis_stats():
    """Show Redis statistics."""
    if not check_redis_connection():
        return
    
    try:
        info = redis_service.client.info()
        
        print("\n📊 Redis Statistics:")
        print(f"  Memory used: {info.get('used_memory_human', 'N/A')}")
        print(f"  Connected clients: {info.get('connected_clients', 'N/A')}")
        print(f"  Total commands processed: {info.get('total_commands_processed', 'N/A')}")
        print(f"  Uptime: {info.get('uptime_in_seconds', 'N/A')} seconds")
        
        # Get key counts
        total_keys = redis_service.client.dbsize()
        print(f"  Total keys: {total_keys}")
        
        # Get specific pattern counts
        patterns = [
            "session:*",
            "timeline:*", 
            "post:*",
            "user_likes:*",
            "blacklist:*",
            "user_online:*"
        ]
        
        print("\n🔑 Key Patterns:")
        for pattern in patterns:
            count = len(redis_service.client.keys(pattern))
            print(f"  {pattern}: {count} keys")
            
    except Exception as e:
        print(f"❌ Failed to get Redis stats: {e}")


def sync_data():
    """Sync database data to Redis."""
    print("🔄 Syncing database data to Redis...")
    if sync_all_data_to_redis():
        print("✅ Data sync completed successfully")
    else:
        print("❌ Data sync failed")


def show_menu():
    """Show the main menu."""
    print("\n" + "="*50)
    print("🚀 Vistagram Redis Manager")
    print("="*50)
    print("1. Check Redis connection")
    print("2. Show Redis statistics")
    print("3. Sync database data to Redis") 
    print("4. Flush all Redis data")
    print("5. Exit")
    print("="*50)


def main():
    """Main menu loop."""
    while True:
        show_menu()
        choice = input("\nEnter your choice (1-5): ").strip()
        
        if choice == '1':
            check_redis_connection()
        elif choice == '2':
            show_redis_stats()
        elif choice == '3':
            sync_data()
        elif choice == '4':
            flush_redis_data()
        elif choice == '5':
            print("👋 Goodbye!")
            break
        else:
            print("❌ Invalid choice. Please enter 1-5.")
        
        input("\nPress Enter to continue...")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Goodbye!")
    except Exception as e:
        print(f"\n❌ Error: {e}") 
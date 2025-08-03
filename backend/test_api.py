import requests
import json
from typing import Optional

BASE_URL = "http://localhost:8000/api/v1"


class VistagramAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.token = None
        self.session = requests.Session()
    
    def test_health(self):
        """Test health endpoint."""
        print("🏥 Testing health endpoint...")
        response = requests.get("http://localhost:8000/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        print()
    
    def test_register(self, username: str, email: str, password: str):
        """Test user registration."""
        print(f"👤 Testing registration for {username}...")
        data = {
            "username": username,
            "email": email,
            "password": password
        }
        response = requests.post(f"{self.base_url}/auth/register", json=data)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print(f"✅ Registration successful: {response.json()}")
        else:
            print(f"❌ Registration failed: {response.text}")
        print()
        return response.status_code == 200
    
    def test_login(self, username: str, password: str):
        """Test user login."""
        print(f"🔐 Testing login for {username}...")
        data = {
            "username": username,
            "password": password
        }
        response = requests.post(f"{self.base_url}/auth/login", data=data)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            self.token = result["access_token"]
            print(f"✅ Login successful: {result}")
        else:
            print(f"❌ Login failed: {response.text}")
        print()
        return response.status_code == 200
    
    def test_get_timeline(self):
        """Test getting timeline."""
        print("📱 Testing timeline endpoint...")
        headers = {"Authorization": f"Bearer {self.token}"} if self.token else {}
        response = requests.get(f"{self.base_url}/posts/timeline", headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Timeline retrieved: {len(result['posts'])} posts")
            print(f"Total posts: {result['total']}")
        else:
            print(f"❌ Timeline failed: {response.text}")
        print()
        return response.status_code == 200
    
    def test_get_me(self):
        """Test getting current user info."""
        print("👤 Testing get current user...")
        headers = {"Authorization": f"Bearer {self.token}"} if self.token else {}
        response = requests.get(f"{self.base_url}/auth/me", headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print(f"✅ User info: {response.json()}")
        else:
            print(f"❌ Get user failed: {response.text}")
        print()
        return response.status_code == 200
    
    def test_like_post(self, post_id: int):
        """Test liking a post."""
        print(f"❤️ Testing like post {post_id}...")
        headers = {"Authorization": f"Bearer {self.token}"} if self.token else {}
        response = requests.post(f"{self.base_url}/posts/{post_id}/like", headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print(f"✅ Like successful: {response.json()}")
        else:
            print(f"❌ Like failed: {response.text}")
        print()
        return response.status_code == 200
    
    def test_share_post(self, post_id: int):
        """Test sharing a post."""
        print(f"🔗 Testing share post {post_id}...")
        headers = {"Authorization": f"Bearer {self.token}"} if self.token else {}
        response = requests.post(f"{self.base_url}/posts/{post_id}/share", headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print(f"✅ Share successful: {response.json()}")
        else:
            print(f"❌ Share failed: {response.text}")
        print()
        return response.status_code == 200


def main():
    """Run API tests."""
    print("🧪 Starting Vistagram API Tests")
    print("=" * 50)
    
    tester = VistagramAPITester()
    
    # Test health endpoint
    tester.test_health()
    
    # Test registration
    tester.test_register("testuser", "test@example.com", "password123")
    
    # Test login
    if tester.test_login("testuser", "password123"):
        # Test authenticated endpoints
        tester.test_get_me()
        tester.test_get_timeline()
        
        # Test interactions
        tester.test_like_post(1)
        tester.test_share_post(1)
    
    print("🎉 API testing completed!")


if __name__ == "__main__":
    main() 
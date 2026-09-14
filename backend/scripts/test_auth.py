import urllib.request
import urllib.error
import json
import time

BASE_URL = "http://localhost:8000/api/auth"

def make_request(url, data=None, token=None, method="POST"):
    req = urllib.request.Request(url, method=method)
    if data:
        req.add_header('Content-Type', 'application/json')
        data = json.dumps(data).encode('utf-8')
    if token:
        req.add_header('Authorization', f'Bearer {token}')
    
    try:
        response = urllib.request.urlopen(req, data=data)
        return response.status, json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode())
    except Exception as e:
        print("Request failed:", e)
        return 0, {}

test_user = {
    "email": f"test{int(time.time())}@example.com",
    "password": "password123",
    "name": "Test User"
}

print("1. Registering user...")
status, body = make_request(f"{BASE_URL}/register", test_user)
print("Status:", status)
print("Body:", body)
assert status == 201

print("\n2. Logging in...")
status, body = make_request(f"{BASE_URL}/login", {"email": test_user["email"], "password": test_user["password"]})
print("Status:", status)
assert status == 200
token = body["access_token"]
print("Token received")

print("\n3. Get current user...")
status, body = make_request(f"{BASE_URL}/me", token=token, method="GET")
print("Status:", status)
print("Body:", body)
assert status == 200
assert body["email"] == test_user["email"]

print("\n4. Invalid login...")
status, body = make_request(f"{BASE_URL}/login", {"email": test_user["email"], "password": "wrongpassword"})
print("Status:", status)
assert status == 401

print("\n5. Duplicate registration...")
status, body = make_request(f"{BASE_URL}/register", test_user)
print("Status:", status)
assert status == 409

print("\n6. Invalid token...")
status, body = make_request(f"{BASE_URL}/me", token="invalidtoken", method="GET")
print("Status:", status)
assert status == 401

print("\nAll tests passed successfully!")

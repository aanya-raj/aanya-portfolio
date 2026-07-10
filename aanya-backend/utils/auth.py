import bcrypt
from models.database import users_col


def hash_password(password: str) -> str:
    """Hash a plaintext password with bcrypt."""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    """Verify a plaintext password against a bcrypt hash."""
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except ValueError:
        return False


def get_user(username: str) -> dict | None:
    """Get a user by username."""
    return users_col.find_one({"username": username}, {"_id": 0})


def create_user(username: str, password: str, role: str = "admin") -> dict:
    """Create or update a user with a hashed password."""
    doc = {
        "username": username,
        "password_hash": hash_password(password),
        "role": role,
    }
    users_col.update_one({"username": username}, {"$set": doc}, upsert=True)
    return {"username": username, "role": role}


def authenticate(username: str, password: str) -> dict | None:
    """Return the user if credentials are valid."""
    user = get_user(username)
    if not user:
        return None
    if not verify_password(password, user.get("password_hash", "")):
        return None
    return user

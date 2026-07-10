from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
from utils.auth import authenticate, get_user, hash_password
from models.database import users_col

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate and return JWT token."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing request body"}), 400

    username = data.get("username", "").strip()
    password = data.get("password", "")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    user = authenticate(username, password)
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=username)
    return jsonify({
        "token": token,
        "user": {"username": user["username"], "role": user["role"]},
    }), 200


@auth_bp.route("/verify", methods=["GET"])
@jwt_required()
def verify():
    """Verify the current JWT token is valid."""
    username = get_jwt_identity()
    user = get_user(username)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({
        "valid": True,
        "user": {"username": user["username"], "role": user.get("role", "admin")},
    }), 200


@auth_bp.route("/change-password", methods=["POST"])
@jwt_required()
def change_password():
    """Change the admin password."""
    username = get_jwt_identity()
    data = request.get_json()

    current_password = data.get("current_password", "")
    new_password = data.get("new_password", "")

    if not current_password or not new_password:
        return jsonify({"error": "Both current and new password required"}), 400

    if len(new_password) < 8:
        return jsonify({"error": "New password must be at least 8 characters"}), 400

    # Verify current password
    user = authenticate(username, current_password)
    if not user:
        return jsonify({"error": "Current password is incorrect"}), 401

    # Update password
    users_col.update_one(
        {"username": username},
        {"$set": {"password_hash": hash_password(new_password)}},
    )

    return jsonify({"message": "Password updated successfully"}), 200

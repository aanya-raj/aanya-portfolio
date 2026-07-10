import os
import uuid
import base64
from flask import Blueprint, request, jsonify, send_from_directory, current_app
from flask_jwt_extended import jwt_required
from models.database import get_all_stickers, upsert_sticker, delete_sticker
from config import Config

stickers_bp = Blueprint("stickers", __name__, url_prefix="/api/stickers")


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in Config.ALLOWED_EXTENSIONS


@stickers_bp.route("", methods=["GET"])
def get_all():
    """Get all placed stickers (public - rendered by frontend)."""
    stickers = get_all_stickers()
    return jsonify(stickers), 200


@stickers_bp.route("", methods=["POST"])
@jwt_required()
def create():
    """Create or update a sticker (admin only)."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing request body"}), 400

    sticker_id = data.get("sticker_id") or f"sticker-{uuid.uuid4().hex[:12]}"

    sticker = {
        "sticker_id": sticker_id,
        "src": data.get("src", "✦"),
        "type": data.get("type", "emoji"),
        "x": data.get("x", 50),
        "y": data.get("y", 50),
        "rotation": data.get("rotation", 0),
        "scale": data.get("scale", 1),
        "page": data.get("page", "all"),
        "zIndex": data.get("zIndex", 50),
    }

    upsert_sticker(sticker_id, sticker)
    return jsonify({"message": "Sticker saved", "sticker": sticker}), 201


@stickers_bp.route("/<sticker_id>", methods=["PUT"])
@jwt_required()
def update(sticker_id: str):
    """Update sticker position/properties (admin only)."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing request body"}), 400

    # Merge with existing
    existing = None
    for s in get_all_stickers():
        if s.get("sticker_id") == sticker_id:
            existing = s
            break

    if not existing:
        return jsonify({"error": "Sticker not found"}), 404

    updated = {**existing, **data, "sticker_id": sticker_id}
    upsert_sticker(sticker_id, updated)
    return jsonify({"message": "Sticker updated", "sticker": updated}), 200


@stickers_bp.route("/<sticker_id>", methods=["DELETE"])
@jwt_required()
def delete(sticker_id: str):
    """Delete a sticker (admin only)."""
    # Also delete uploaded file if it exists
    for s in get_all_stickers():
        if s.get("sticker_id") == sticker_id and s.get("type") == "image":
            src = s.get("src", "")
            if src.startswith("/api/stickers/file/"):
                filename = src.split("/")[-1]
                filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
                if os.path.exists(filepath):
                    os.remove(filepath)

    success = delete_sticker(sticker_id)
    if not success:
        return jsonify({"error": "Sticker not found"}), 404

    return jsonify({"message": "Sticker deleted"}), 200


@stickers_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload_image():
    """Upload a sticker image file (admin only). Returns the URL to use as src."""

    # Support both file upload and base64
    if "file" in request.files:
        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400
        if not allowed_file(file.filename):
            return jsonify({"error": f"File type not allowed. Use: {', '.join(Config.ALLOWED_EXTENSIONS)}"}), 400

        ext = file.filename.rsplit(".", 1)[1].lower()
        filename = f"{uuid.uuid4().hex[:16]}.{ext}"
        filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
        file.save(filepath)

        url = f"/api/stickers/file/{filename}"
        return jsonify({"url": url, "filename": filename}), 201

    # Base64 upload
    data = request.get_json()
    if data and data.get("base64"):
        b64 = data["base64"]
        # Extract extension from data URL
        if b64.startswith("data:image/"):
            ext = b64.split(";")[0].split("/")[1]
            if ext == "svg+xml":
                ext = "svg"
            b64_data = b64.split(",", 1)[1]
        else:
            ext = "png"
            b64_data = b64

        if ext not in Config.ALLOWED_EXTENSIONS:
            return jsonify({"error": f"File type not allowed"}), 400

        filename = f"{uuid.uuid4().hex[:16]}.{ext}"
        filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

        with open(filepath, "wb") as f:
            f.write(base64.b64decode(b64_data))

        url = f"/api/stickers/file/{filename}"
        return jsonify({"url": url, "filename": filename}), 201

    return jsonify({"error": "No file or base64 data provided"}), 400


@stickers_bp.route("/file/<filename>", methods=["GET"])
def serve_file(filename: str):
    """Serve an uploaded sticker image (public)."""
    upload_dir = os.path.join(os.getcwd(), Config.UPLOAD_FOLDER)
    return send_from_directory(upload_dir, filename)


@stickers_bp.route("/bulk", methods=["PUT"])
@jwt_required()
def bulk_update():
    """Bulk update all stickers (admin only). Replaces all stickers."""
    data = request.get_json()
    if not isinstance(data, list):
        return jsonify({"error": "Expected a JSON array of stickers"}), 400

    # Delete all existing
    from models.database import stickers_col
    stickers_col.delete_many({})

    # Insert all new
    for sticker in data:
        sid = sticker.get("sticker_id") or f"sticker-{uuid.uuid4().hex[:12]}"
        sticker["sticker_id"] = sid
        upsert_sticker(sid, sticker)

    return jsonify({"message": f"Saved {len(data)} stickers"}), 200

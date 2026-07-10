from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.database import get_content, set_content, get_all_content

content_bp = Blueprint("content", __name__, url_prefix="/api/content")

# Valid content keys
VALID_KEYS = {
    "projects",
    "experiences",
    "personalities",
    "hobbies",
    "skills",
    "hero",
    "oracle_prompt",
    "featured_slugs",
    "site_meta",
}


@content_bp.route("", methods=["GET"])
def get_all():
    """Get all content (public - used by frontend to render the site)."""
    content = get_all_content()
    return jsonify(content), 200


@content_bp.route("/<key>", methods=["GET"])
def get_one(key: str):
    """Get a specific content section by key."""
    if key not in VALID_KEYS:
        return jsonify({"error": f"Invalid content key: {key}"}), 400

    doc = get_content(key)
    if not doc:
        return jsonify({"error": "Content not found", "key": key}), 404

    return jsonify(doc), 200


@content_bp.route("/<key>", methods=["PUT"])
@jwt_required()
def update_one(key: str):
    """Update a content section (admin only)."""
    if key not in VALID_KEYS:
        return jsonify({"error": f"Invalid content key: {key}"}), 400

    data = request.get_json()
    if data is None:
        return jsonify({"error": "Missing request body"}), 400

    result = set_content(key, data)
    return jsonify({"message": f"Updated {key}", "data": result}), 200


@content_bp.route("/bulk", methods=["PUT"])
@jwt_required()
def bulk_update():
    """Update multiple content sections at once (admin only)."""
    data = request.get_json()
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Expected a JSON object with content keys"}), 400

    updated = []
    errors = []

    for key, value in data.items():
        if key not in VALID_KEYS:
            errors.append(f"Invalid key: {key}")
            continue
        set_content(key, value)
        updated.append(key)

    return jsonify({
        "message": f"Updated {len(updated)} sections",
        "updated": updated,
        "errors": errors,
    }), 200


@content_bp.route("/export", methods=["GET"])
@jwt_required()
def export_all():
    """Export all content as a single JSON (admin only)."""
    content = get_all_content()
    return jsonify({
        "version": 1,
        "content": content,
    }), 200


@content_bp.route("/import", methods=["POST"])
@jwt_required()
def import_all():
    """Import content from a JSON export (admin only)."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing request body"}), 400

    # Support both raw content dict and versioned export format
    content = data.get("content", data)
    if not isinstance(content, dict):
        return jsonify({"error": "Invalid format"}), 400

    updated = []
    for key, value in content.items():
        if key in VALID_KEYS:
            set_content(key, value)
            updated.append(key)

    return jsonify({
        "message": f"Imported {len(updated)} sections",
        "updated": updated,
    }), 200


@content_bp.route("/reset", methods=["POST"])
@jwt_required()
def reset_all():
    """Delete all custom content, reverting to frontend defaults (admin only)."""
    from models.database import content_col

    result = content_col.delete_many({})
    return jsonify({
        "message": f"Deleted {result.deleted_count} content documents. Frontend will use defaults.",
    }), 200

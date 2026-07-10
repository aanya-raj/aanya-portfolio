import sqlite3
import json
import os
from contextlib import contextmanager
from typing import Optional, Dict, List, Any

# Database file path
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "portfolio.db")


@contextmanager
def get_db():
    """Context manager for database connections."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db():
    """Initialize the SQLite database with required tables."""
    with get_db() as conn:
        cursor = conn.cursor()

        # Users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                username TEXT PRIMARY KEY,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'admin'
            )
        """)

        # Content table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS content (
                key TEXT PRIMARY KEY,
                data TEXT NOT NULL
            )
        """)

        # Stickers table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS stickers (
                sticker_id TEXT PRIMARY KEY,
                src TEXT NOT NULL,
                type TEXT NOT NULL DEFAULT 'emoji',
                x REAL NOT NULL DEFAULT 50,
                y REAL NOT NULL DEFAULT 50,
                rotation REAL NOT NULL DEFAULT 0,
                scale REAL NOT NULL DEFAULT 1,
                page TEXT NOT NULL DEFAULT 'all',
                zIndex INTEGER NOT NULL DEFAULT 50
            )
        """)

        conn.commit()


# Initialize database on module import
init_db()


# ─── Users Collection Functions ────────────────────────────────

def users_find_one(query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Find a single user by query."""
    with get_db() as conn:
        cursor = conn.cursor()
        username = query.get("username")
        if not username:
            return None

        cursor.execute("SELECT username, password_hash, role FROM users WHERE username = ?", (username,))
        row = cursor.fetchone()

        if row:
            return {
                "username": row["username"],
                "password_hash": row["password_hash"],
                "role": row["role"]
            }
        return None


def users_update_one(query: Dict[str, Any], update: Dict[str, Any], upsert: bool = False):
    """Update or insert a user."""
    with get_db() as conn:
        cursor = conn.cursor()
        username = query.get("username")
        set_data = update.get("$set", {})

        if upsert:
            cursor.execute("""
                INSERT INTO users (username, password_hash, role)
                VALUES (?, ?, ?)
                ON CONFLICT(username) DO UPDATE SET
                    password_hash = excluded.password_hash,
                    role = excluded.role
            """, (
                username,
                set_data.get("password_hash", ""),
                set_data.get("role", "admin")
            ))
        else:
            cursor.execute("""
                UPDATE users SET password_hash = ? WHERE username = ?
            """, (set_data.get("password_hash"), username))


# Compatibility layer for existing code
class UsersCollection:
    def find_one(self, query: Dict[str, Any], projection: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        return users_find_one(query)

    def update_one(self, query: Dict[str, Any], update: Dict[str, Any], upsert: bool = False):
        return users_update_one(query, update, upsert)

    def create_index(self, field: str, unique: bool = False):
        # Indexes are created in init_db
        pass


users_col = UsersCollection()


# ─── Content Collection Functions ────────────────────────────────

def get_content(key: str) -> Optional[Dict[str, Any]]:
    """Get a content document by key."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT key, data FROM content WHERE key = ?", (key,))
        row = cursor.fetchone()

        if row:
            return {
                "key": row["key"],
                "data": json.loads(row["data"])
            }
        return None


def set_content(key: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """Upsert a content document by key."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO content (key, data)
            VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET data = excluded.data
        """, (key, json.dumps(data)))

        return {"key": key, "data": data}


def get_all_content() -> Dict[str, Any]:
    """Get all content documents as a key->data map."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT key, data FROM content")
        rows = cursor.fetchall()

        return {row["key"]: json.loads(row["data"]) for row in rows}


class ContentCollection:
    def find_one(self, query: Dict[str, Any], projection: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        return get_content(query.get("key"))

    def update_one(self, query: Dict[str, Any], update: Dict[str, Any], upsert: bool = False):
        key = query.get("key")
        set_data = update.get("$set", {})
        if key:
            set_content(key, set_data.get("data", {}))

    def find(self, query: Optional[Dict[str, Any]] = None, projection: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        content = get_all_content()
        return [{"key": k, "data": v} for k, v in content.items()]

    def delete_many(self, query: Optional[Dict[str, Any]] = None):
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM content")
            return type('obj', (object,), {'deleted_count': cursor.rowcount})()

    def create_index(self, field: str, unique: bool = False):
        # Indexes are created in init_db
        pass


content_col = ContentCollection()


# ─── Stickers Collection Functions ────────────────────────────────

def get_all_stickers() -> List[Dict[str, Any]]:
    """Get all sticker documents."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT sticker_id, src, type, x, y, rotation, scale, page, zIndex
            FROM stickers
        """)
        rows = cursor.fetchall()

        return [{
            "sticker_id": row["sticker_id"],
            "src": row["src"],
            "type": row["type"],
            "x": row["x"],
            "y": row["y"],
            "rotation": row["rotation"],
            "scale": row["scale"],
            "page": row["page"],
            "zIndex": row["zIndex"]
        } for row in rows]


def upsert_sticker(sticker_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """Upsert a sticker document."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO stickers (sticker_id, src, type, x, y, rotation, scale, page, zIndex)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(sticker_id) DO UPDATE SET
                src = excluded.src,
                type = excluded.type,
                x = excluded.x,
                y = excluded.y,
                rotation = excluded.rotation,
                scale = excluded.scale,
                page = excluded.page,
                zIndex = excluded.zIndex
        """, (
            sticker_id,
            data.get("src", "✦"),
            data.get("type", "emoji"),
            data.get("x", 50),
            data.get("y", 50),
            data.get("rotation", 0),
            data.get("scale", 1),
            data.get("page", "all"),
            data.get("zIndex", 50)
        ))

        return data


def delete_sticker(sticker_id: str) -> bool:
    """Delete a sticker by ID."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM stickers WHERE sticker_id = ?", (sticker_id,))
        return cursor.rowcount > 0


class StickersCollection:
    def find(self, query: Optional[Dict[str, Any]] = None, projection: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        return get_all_stickers()

    def update_one(self, query: Dict[str, Any], update: Dict[str, Any], upsert: bool = False):
        sticker_id = query.get("sticker_id")
        set_data = update.get("$set", {})
        if sticker_id:
            upsert_sticker(sticker_id, set_data)

    def delete_one(self, query: Dict[str, Any]):
        sticker_id = query.get("sticker_id")
        if sticker_id:
            deleted = delete_sticker(sticker_id)
            return type('obj', (object,), {'deleted_count': 1 if deleted else 0})()
        return type('obj', (object,), {'deleted_count': 0})()

    def delete_many(self, query: Optional[Dict[str, Any]] = None):
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM stickers")
            return type('obj', (object,), {'deleted_count': cursor.rowcount})()

    def create_index(self, field: str, unique: bool = False):
        # Indexes are created in init_db
        pass


stickers_col = StickersCollection()

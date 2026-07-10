#!/usr/bin/env python3
"""
Run this script once to create your admin user.

Usage:
    python setup_admin.py

It will prompt you for a username and password, hash the password with bcrypt,
and store it in SQLite database.
"""

import getpass
import sys
from dotenv import load_dotenv

load_dotenv()


def main():
    print("\n✦ Portfolio Admin Setup ✦\n")

    # Import after loading env
    from utils.auth import create_user, get_user

    username = input("Admin username [aanya]: ").strip() or "aanya"

    # Check if user exists
    existing = get_user(username)
    if existing:
        print(f"\nUser '{username}' already exists.")
        confirm = input("Overwrite password? (y/N): ").strip().lower()
        if confirm != "y":
            print("Aborted.")
            sys.exit(0)

    password = getpass.getpass("Admin password (min 8 chars): ")
    if len(password) < 8:
        print("Error: Password must be at least 8 characters.")
        sys.exit(1)

    confirm = getpass.getpass("Confirm password: ")
    if password != confirm:
        print("Error: Passwords don't match.")
        sys.exit(1)

    user = create_user(username, password)
    print(f"\n✦ Admin user '{user['username']}' created successfully!")
    print(f"  Role: {user['role']}")
    print(f"\n  Login at: POST /api/auth/login")
    print(f"  Body: {{'username': '{username}', 'password': '<your-password>'}}")
    print()


if __name__ == "__main__":
    main()

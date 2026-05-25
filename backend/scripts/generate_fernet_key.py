#!/usr/bin/env python
"""
Run this script ONCE to generate your FERNET_KEY and copy it into .env.

Usage:
    python scripts/generate_fernet_key.py
"""

from cryptography.fernet import Fernet

key = Fernet.generate_key().decode()
print(f"\nYour FERNET_KEY:\n\n{key}\n")
print("Copy the value above into your .env file as:")
print(f"FERNET_KEY={key}")

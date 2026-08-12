import re
import secrets
import string


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text or "form"


def generate_unique_slug(title: str) -> str:
    base = slugify(title)
    random_str = ''.join(secrets.choice(string.ascii_lowercase + string.digits) for _ in range(6))
    return f"{base}-{random_str}"

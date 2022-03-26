import os


def get_db_uri():
    user = os.getenv("POSTGRES_USER", "root")
    password = os.getenv("POSTGRES_PASSWORD", "root")
    host = os.getenv("POSTGRES_HOST", "localhost")
    port = os.getenv("POSTGRES_PORT", "5432")
    db = os.getenv("POSTGRES_DB", "tasks")

    print()

    return f"postgresql://{user}:{password}@{host}:{port}/{db}"


class Config:
    DATABASE_URI = get_db_uri()
    AUTO_MIGRATE = os.getenv("AUTO_MIGRATE", False)

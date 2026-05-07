import psycopg2
from psycopg2.pool import ThreadedConnectionPool
from database.config import DATABASE_URL

# Connection pool — min 1, max 10 connections
_pool: ThreadedConnectionPool = None


def get_pool() -> ThreadedConnectionPool:
    global _pool
    if _pool is None:
        _pool = ThreadedConnectionPool(1, 10, dsn=DATABASE_URL)
    return _pool


def get_connection():
    """Get a connection from the pool."""
    return get_pool().getconn()


def release_connection(conn):
    """Return a connection back to the pool."""
    get_pool().putconn(conn)


def close_pool():
    """Close all connections in the pool (call on app shutdown)."""
    global _pool
    if _pool:
        _pool.closeall()
        _pool = None

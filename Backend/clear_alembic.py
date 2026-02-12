import sqlalchemy as sa
from sqlalchemy import text

# Database connection
engine = sa.create_engine('mysql+mysqlconnector://root:admin@localhost/validator_db')

with engine.connect() as conn:
    conn.execute(text('DELETE FROM alembic_version'))
    conn.commit()
    print("Cleared alembic_version table")

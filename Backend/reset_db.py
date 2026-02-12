import sqlalchemy as sa
from sqlalchemy import text

# Database connection
engine = sa.create_engine('mysql+mysqlconnector://root:admin@localhost/validator_db')

with engine.connect() as conn:
    # Drop the reports table if it exists
    conn.execute(text('DROP TABLE IF EXISTS reports'))
    # Clear alembic version
    conn.execute(text('DELETE FROM alembic_version'))
    conn.commit()
    print("Dropped reports table and cleared alembic_version")

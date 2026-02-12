import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

# 1. Add your project root to sys.path so Python can find 'app'
sys.path.append(os.getcwd())

# 2. Import your App's components
from app.core.config import settings
from app.database import Base
# IMPORTANT: You must import all models here so Alembic can see them
from app.models.users import User 
from app.models.report import Report
from app.models.xsd import XSD
# This is the Alembic Config object, which provides access to the .ini file in use.
config = context.config

# 3. Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# 4. Set the SQLAlchemy URL dynamically from our Settings
config.set_main_option("sqlalchemy.url", settings.sqlalchemy_database_uri)

# 5. Set the metadata for 'autogenerate' support
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "pyformat"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, 
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
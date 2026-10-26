from alembic import context
from sqlalchemy import engine_from_config, pool
from flask import current_app
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import upgrade
from alembic import context
from sqlalchemy import MetaData

# Enable batch mode for SQLite migrations
from alembic.operations import Operations
from alembic.migration import MigrationContext

# Your database URL and other settings would be initialized here as usual
def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix='sqlalchemy.',
        poolclass=pool.NullPool,
    )

    # Open a connection to the database
    with connectable.connect() as connection:
        # Enable batch mode if you're using SQLite
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            process_bind_parameters=True,
            version_table='alembic_version',
            dialect_opts={'paramstyle': 'named'}
        )
        # Use batch mode for migrations to handle SQLite limitations
        with context.begin_transaction():
            context.run_migrations()

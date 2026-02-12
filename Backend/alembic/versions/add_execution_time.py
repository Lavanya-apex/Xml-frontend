"""add execution_time column to reports

Revision ID: add_execution_time_001
Revises: add_username_001
Create Date: 2026-02-05 14:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'add_execution_time_001'
down_revision: Union[str, Sequence[str], None] = 'add_username_001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add execution_time column to reports table."""
    try:
        op.add_column('reports', sa.Column('execution_time', sa.Float(), nullable=True, server_default='0.0'))
    except:
        pass


def downgrade() -> None:
    """Remove execution_time column."""
    try:
        op.drop_column('reports', 'execution_time')
    except:
        pass

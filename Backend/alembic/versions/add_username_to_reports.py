"""add username column to reports table

Revision ID: add_username_001
Revises: 
Create Date: 2026-02-05 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'add_username_001'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema - create or fix reports table."""
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()
    
    if 'reports' not in tables:
        # Create the complete reports table
        op.create_table(
            'reports',
            sa.Column('file_id', sa.Integer(), nullable=False, autoincrement=True),
            sa.Column('file_name', sa.String(255), nullable=False),
            sa.Column('is_valid', sa.Boolean(), nullable=True, server_default='1'),
            sa.Column('error_msg', sa.Text(), nullable=True),
            sa.Column('validated_date', sa.DateTime(), nullable=False, server_default=sa.func.now()),
            sa.Column('file_type', sa.String(50), nullable=False),
            sa.Column('username', sa.String(40), nullable=False),
            sa.PrimaryKeyConstraint('file_id'),
            sa.ForeignKeyConstraint(['username'], ['users.username'], ondelete='CASCADE')
        )
    else:
        # Table exists, add missing columns
        try:
            op.add_column('reports', sa.Column('file_id', sa.Integer(), nullable=False, server_default='1'))
        except:
            pass
        
        try:
            op.add_column('reports', sa.Column('file_name', sa.String(255), nullable=False, server_default='unknown'))
        except:
            pass
        
        try:
            op.add_column('reports', sa.Column('is_valid', sa.Boolean(), nullable=True, server_default='1'))
        except:
            pass
        
        try:
            op.add_column('reports', sa.Column('error_msg', sa.Text(), nullable=True))
        except:
            pass
        
        try:
            op.add_column('reports', sa.Column('validated_date', sa.DateTime(), nullable=False, server_default=sa.func.now()))
        except:
            pass
        
        try:
            op.add_column('reports', sa.Column('file_type', sa.String(50), nullable=False, server_default='xml'))
        except:
            pass
        
        try:
            op.add_column('reports', sa.Column('username', sa.String(40), nullable=False, server_default='unknown'))
        except:
            pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

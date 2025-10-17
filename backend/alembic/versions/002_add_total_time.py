"""Add total_time to sessions

Revision ID: 002
Revises: 001
Create Date: 2025-01-16 14:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Add total_time column to sessions and notation_sessions tables."""
    # Add total_time to sessions table
    op.add_column('sessions', sa.Column('total_time', sa.DECIMAL(precision=10, scale=3), nullable=True))
    
    # Add total_time to notation_sessions table
    op.add_column('notation_sessions', sa.Column('total_time', sa.DECIMAL(precision=10, scale=3), nullable=True))


def downgrade() -> None:
    """Remove total_time column from sessions and notation_sessions tables."""
    op.drop_column('sessions', 'total_time')
    op.drop_column('notation_sessions', 'total_time')


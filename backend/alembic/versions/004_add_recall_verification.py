"""Add recall verification fields

Revision ID: 004
Revises: 002
Create Date: 2025-01-16 16:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '004'
down_revision = '002'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Add user_recall and recall_validation columns to sessions table."""
    # Add user_recall text column
    op.add_column('sessions', sa.Column('user_recall', sa.Text(), nullable=True))
    
    # Add recall_validation JSONB column
    op.add_column('sessions', sa.Column('recall_validation', postgresql.JSONB(astext_type=sa.Text()), nullable=True))


def downgrade() -> None:
    """Remove user_recall and recall_validation columns from sessions table."""
    op.drop_column('sessions', 'recall_validation')
    op.drop_column('sessions', 'user_recall')


"""Initial schema

Revision ID: 001
Revises: 
Create Date: 2025-01-16 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create initial schema."""
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('firebase_uid', sa.String(length=128), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('display_name', sa.String(length=255), nullable=True),
        sa.Column('profile_picture_url', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('last_login', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True, server_default=sa.text('true')),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_users_firebase_uid', 'users', ['firebase_uid'], unique=True)
    op.create_index('idx_users_email', 'users', ['email'], unique=True)
    
    # Create sessions table
    op.create_table(
        'sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('session_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('drill_type', sa.String(length=50), nullable=False),
        sa.Column('pair_count', sa.Integer(), nullable=False),
        sa.Column('pairs', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('timings', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('average_time', sa.DECIMAL(precision=10, scale=3), nullable=False),
        sa.Column('recall_accuracy', sa.DECIMAL(precision=5, scale=2), nullable=False),
        sa.Column('vividness', sa.Integer(), nullable=True),
        sa.Column('flow', sa.Integer(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_sessions_user_id', 'sessions', ['user_id'])
    op.create_index('idx_sessions_date', 'sessions', ['session_date'], postgresql_ops={'session_date': 'DESC'})
    op.create_index('idx_sessions_drill_type', 'sessions', ['drill_type'])
    op.create_index('idx_sessions_user_date', 'sessions', ['user_id', 'session_date'], postgresql_ops={'session_date': 'DESC'})
    
    # Create notation_sessions table
    op.create_table(
        'notation_sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('session_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('drill_type', sa.String(length=50), nullable=False),
        sa.Column('attempts', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('total_pieces', sa.Integer(), nullable=False),
        sa.Column('correct_count', sa.Integer(), nullable=False),
        sa.Column('accuracy', sa.DECIMAL(precision=5, scale=2), nullable=False),
        sa.Column('average_time', sa.DECIMAL(precision=10, scale=3), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_notation_sessions_user_id', 'notation_sessions', ['user_id'])
    op.create_index('idx_notation_sessions_date', 'notation_sessions', ['session_date'], postgresql_ops={'session_date': 'DESC'})
    op.create_index('idx_notation_sessions_drill_type', 'notation_sessions', ['drill_type'])


def downgrade() -> None:
    """Drop initial schema."""
    op.drop_index('idx_notation_sessions_drill_type', table_name='notation_sessions')
    op.drop_index('idx_notation_sessions_date', table_name='notation_sessions')
    op.drop_index('idx_notation_sessions_user_id', table_name='notation_sessions')
    op.drop_table('notation_sessions')
    
    op.drop_index('idx_sessions_user_date', table_name='sessions')
    op.drop_index('idx_sessions_drill_type', table_name='sessions')
    op.drop_index('idx_sessions_date', table_name='sessions')
    op.drop_index('idx_sessions_user_id', table_name='sessions')
    op.drop_table('sessions')
    
    op.drop_index('idx_users_email', table_name='users')
    op.drop_index('idx_users_firebase_uid', table_name='users')
    op.drop_table('users')


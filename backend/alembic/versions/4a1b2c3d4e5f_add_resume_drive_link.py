"""add resume drive link

Revision ID: 4a1b2c3d4e5f
Revises: 3ce0c78ddfdf
Create Date: 2026-04-05 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4a1b2c3d4e5f'
down_revision: Union[str, None] = '3ce0c78ddfdf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('applications', sa.Column('resume_drive_link', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('applications', 'resume_drive_link')
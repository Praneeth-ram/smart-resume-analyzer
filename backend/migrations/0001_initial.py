"""Initial database migration — creates all tables

Run with:
    alembic upgrade head

Or use SQLAlchemy auto-create (already in main.py):
    Base.metadata.create_all(bind=engine)
"""
from alembic import op
import sqlalchemy as sa

revision = '0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('email', sa.String(), unique=True, nullable=False, index=True),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('role', sa.Enum('student', 'hr', name='userrole'), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        'student_profiles',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), unique=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('date_of_birth', sa.Date()),
        sa.Column('phone', sa.String()),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        'hr_profiles',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), unique=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('company_name', sa.String(), nullable=False),
        sa.Column('department', sa.String()),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        'job_posts',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('hr_id', sa.Integer(), sa.ForeignKey('hr_profiles.id')),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('company', sa.String(), nullable=False),
        sa.Column('location', sa.String()),
        sa.Column('job_type', sa.String()),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('requirements', sa.Text()),
        sa.Column('skills_required', sa.Text()),
        sa.Column('experience_required', sa.String()),
        sa.Column('salary_range', sa.String()),
        sa.Column('ats_threshold', sa.Float(), default=80.0),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('deadline', sa.Date()),
    )

    op.create_table(
        'applications',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('student_id', sa.Integer(), sa.ForeignKey('student_profiles.id')),
        sa.Column('job_post_id', sa.Integer(), sa.ForeignKey('job_posts.id')),
        sa.Column('status', sa.Enum(
            'applied', 'ats_passed', 'ats_failed', 'shortlisted', 'rejected', 'selected',
            name='applicationstatus'), default='applied'),
        sa.Column('ats_score', sa.Float()),
        sa.Column('resume_filename', sa.String()),
        sa.Column('resume_drive_link', sa.String()),
        sa.Column('applied_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )


def downgrade():
    op.drop_table('applications')
    op.drop_table('job_posts')
    op.drop_table('hr_profiles')
    op.drop_table('student_profiles')
    op.drop_table('users')

import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Form(Base):
    __tablename__ = "forms"

    id = Column(Integer, primary_key=True, index=True)
    creator_id = Column(Integer, ForeignKey("creators.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False, default="Untitled form")
    description = Column(String, nullable=True)
    status = Column(String, nullable=False, default="draft")  # draft | published
    public_slug = Column(String, unique=True, index=True, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    published_at = Column(DateTime, nullable=True)

    creator = relationship("Creator", back_populates="forms")
    questions = relationship(
        "Question",
        back_populates="form",
        cascade="all, delete-orphan",
        order_by="Question.order_index"
    )
    responses = relationship(
        "Response",
        back_populates="form",
        cascade="all, delete-orphan",
        order_by="Response.submitted_at.desc()"
    )

import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.form import Form
from app.models.question import Question, QuestionOption
from app.schemas.form import FormCreate, FormUpdate
from app.utils.slug import generate_unique_slug


def get_forms(db: Session, creator_id: int = 1) -> List[Form]:
    return db.query(Form).filter(Form.creator_id == creator_id).order_by(Form.updated_at.desc()).all()


def get_form_by_id(db: Session, form_id: int) -> Optional[Form]:
    return db.query(Form).filter(Form.id == form_id).first()


def get_form_by_slug(db: Session, slug: str) -> Optional[Form]:
    return db.query(Form).filter(Form.public_slug == slug).first()


def create_form(db: Session, form_in: FormCreate, creator_id: int = 1) -> Form:
    # Ensure creator exists to prevent foreign key constraint errors
    from app.models.creator import Creator
    creator = db.query(Creator).filter(Creator.id == creator_id).first()
    if not creator:
        new_creator = Creator(id=creator_id, name="Demo Creator", email="demo@example.com")
        db.add(new_creator)
        db.commit()

    form = Form(
        creator_id=creator_id,
        title=form_in.title or "Untitled form",
        description=form_in.description,
        status="draft"
    )
    db.add(form)
    db.commit()
    db.refresh(form)
    return form


def update_form(db: Session, form_id: int, form_in: FormUpdate) -> Form:
    form = get_form_by_id(db, form_id)
    if not form:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Form not found")

    if form_in.title is not None:
        form.title = form_in.title.strip() or "Untitled form"
    if form_in.description is not None:
        form.description = form_in.description

    form.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(form)
    return form


def delete_form(db: Session, form_id: int) -> bool:
    form = get_form_by_id(db, form_id)
    if not form:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Form not found")

    db.delete(form)
    db.commit()
    return True


def duplicate_form(db: Session, form_id: int) -> Form:
    original = get_form_by_id(db, form_id)
    if not original:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Form not found")

    # Create duplicated form draft
    new_form = Form(
        creator_id=original.creator_id,
        title=f"{original.title} Copy",
        description=original.description,
        status="draft",
        public_slug=None
    )
    db.add(new_form)
    db.flush()

    # Copy questions & options
    for q in original.questions:
        new_q = Question(
            form_id=new_form.id,
            type=q.type,
            title=q.title,
            description=q.description,
            required=q.required,
            order_index=q.order_index
        )
        db.add(new_q)
        db.flush()

        for opt in q.options:
            new_opt = QuestionOption(
                question_id=new_q.id,
                label=opt.label,
                value=opt.value,
                order_index=opt.order_index
            )
            db.add(new_opt)

    db.commit()
    db.refresh(new_form)
    return new_form


def publish_form(db: Session, form_id: int) -> Form:
    form = get_form_by_id(db, form_id)
    if not form:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Form not found")

    # Publish Validation
    if not form.title or not form.title.strip():
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Form must have a valid title.")

    if not form.questions:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Your form needs at least one question before it can be published."
        )

    for q in form.questions:
        if not q.title or not q.title.strip():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Question #{q.order_index + 1} is missing a title."
            )
        if q.type == "multiple_choice" and len(q.options) < 2:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Multiple choice question '{q.title}' must have at least 2 options."
            )
        if q.type == "dropdown" and len(q.options) < 1:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Dropdown question '{q.title}' must have at least 1 option."
            )

    if not form.public_slug:
        form.public_slug = generate_unique_slug(form.title)

    form.status = "published"
    form.published_at = datetime.datetime.utcnow()
    form.updated_at = datetime.datetime.utcnow()

    db.commit()
    db.refresh(form)
    return form


def unpublish_form(db: Session, form_id: int) -> Form:
    form = get_form_by_id(db, form_id)
    if not form:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Form not found")

    form.status = "draft"
    form.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(form)
    return form

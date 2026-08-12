import re
from typing import Tuple, Optional, List
from app.models.question import Question, QuestionOption


EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")


def validate_answer_for_question(question: Question, raw_answer: Optional[str]) -> Tuple[bool, Optional[str]]:
    val = (raw_answer or "").strip()

    # Required check
    if question.required and not val:
        return False, f"Question '{question.title}' is required."

    if not val:
        # Optional & empty is valid
        return True, None

    q_type = question.type

    if q_type == "email":
        if not EMAIL_REGEX.match(val):
            return False, f"Invalid email format for question '{question.title}'."

    elif q_type == "number":
        try:
            float(val)
        except ValueError:
            return False, f"Value must be a valid number for question '{question.title}'."

    elif q_type in ["multiple_choice", "dropdown"]:
        valid_options = [opt.value for opt in question.options]
        # Also allow label matching in case frontend sent option label
        valid_labels = [opt.label for opt in question.options]
        if val not in valid_options and val not in valid_labels:
            return False, f"Selected option '{val}' is not valid for question '{question.title}'."

    elif q_type == "yes_no":
        if val.lower() not in ["yes", "no"]:
            return False, f"Answer must be 'yes' or 'no' for question '{question.title}'."

    elif q_type == "rating":
        try:
            r_val = int(val)
            if r_val < 1 or r_val > 5:
                return False, f"Rating must be an integer between 1 and 5 for question '{question.title}'."
        except ValueError:
            return False, f"Rating must be an integer between 1 and 5 for question '{question.title}'."

    elif q_type in ["short_text", "long_text"]:
        # Text string validation
        pass

    return True, None

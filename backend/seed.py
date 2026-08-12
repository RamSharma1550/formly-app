import datetime
from app.database import engine, Base, SessionLocal
from app.models.creator import Creator
from app.models.form import Form
from app.models.question import Question, QuestionOption
from app.models.response import Response, Answer
from app.utils.slug import generate_unique_slug


def seed():
    print("🌱 Initializing Formly Database Seeding...")

    # Drop and recreate tables for clean seed run
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # 1. Create Default Creator
        creator = Creator(
            id=1,
            name="Demo Creator",
            email="demo@example.com",
            created_at=datetime.datetime.utcnow()
        )
        db.add(creator)
        db.flush()

        # 2. Form 1: Customer Feedback (Published)
        form1 = Form(
            creator_id=creator.id,
            title="Customer Feedback",
            description="We would love to get your feedback on our recent product release!",
            status="published",
            public_slug="customer-feedback-demo",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=7),
            updated_at=datetime.datetime.utcnow() - datetime.timedelta(days=7),
            published_at=datetime.datetime.utcnow() - datetime.timedelta(days=7)
        )
        db.add(form1)
        db.flush()

        q1_1 = Question(
            form_id=form1.id,
            type="short_text",
            title="What is your name?",
            description="Please enter your full name.",
            required=True,
            order_index=0
        )
        q1_2 = Question(
            form_id=form1.id,
            type="email",
            title="What is your email address?",
            description="We promise not to spam you.",
            required=True,
            order_index=1
        )
        q1_3 = Question(
            form_id=form1.id,
            type="rating",
            title="How would you rate your experience with us?",
            description="1 being poor, 5 being exceptional.",
            required=True,
            order_index=2
        )
        q1_4 = Question(
            form_id=form1.id,
            type="long_text",
            title="What did you like most about our product?",
            description="Tell us what features stood out to you.",
            required=False,
            order_index=3
        )
        q1_5 = Question(
            form_id=form1.id,
            type="yes_no",
            title="Would you recommend our product to a friend?",
            description="Your honest answer helps us improve.",
            required=True,
            order_index=4
        )
        db.add_all([q1_1, q1_2, q1_3, q1_4, q1_5])
        db.flush()

        # 3. Form 2: Job Application (Published)
        form2 = Form(
            creator_id=creator.id,
            title="Job Application",
            description="Apply for our Senior Full-Stack Engineering opening.",
            status="published",
            public_slug="job-application-demo",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=5),
            updated_at=datetime.datetime.utcnow() - datetime.timedelta(days=5),
            published_at=datetime.datetime.utcnow() - datetime.timedelta(days=5)
        )
        db.add(form2)
        db.flush()

        q2_1 = Question(
            form_id=form2.id,
            type="short_text",
            title="What is your full name?",
            description="First and Last name.",
            required=True,
            order_index=0
        )
        q2_2 = Question(
            form_id=form2.id,
            type="email",
            title="What is your primary email?",
            description="We will contact you here for interview schedules.",
            required=True,
            order_index=1
        )
        q2_3 = Question(
            form_id=form2.id,
            type="number",
            title="How many years of relevant software engineering experience do you have?",
            description="Enter total years of experience.",
            required=True,
            order_index=2
        )
        q2_4 = Question(
            form_id=form2.id,
            type="dropdown",
            title="What is your current work mode availability?",
            description="Select your preferred setup.",
            required=True,
            order_index=3
        )
        db.add_all([q2_1, q2_2, q2_3, q2_4])
        db.flush()

        opt2_4_1 = QuestionOption(question_id=q2_4.id, label="Remote", value="Remote", order_index=0)
        opt2_4_2 = QuestionOption(question_id=q2_4.id, label="Hybrid", value="Hybrid", order_index=1)
        opt2_4_3 = QuestionOption(question_id=q2_4.id, label="On-site", value="On-site", order_index=2)
        db.add_all([opt2_4_1, opt2_4_2, opt2_4_3])

        q2_5 = Question(
            form_id=form2.id,
            type="multiple_choice",
            title="Which technology stack do you prefer?",
            description="Choose your primary language/stack.",
            required=True,
            order_index=4
        )
        db.add(q2_5)
        db.flush()

        opt2_5_1 = QuestionOption(question_id=q2_5.id, label="Python / FastAPI", value="Python / FastAPI", order_index=0)
        opt2_5_2 = QuestionOption(question_id=q2_5.id, label="TypeScript / React / Next.js", value="TypeScript / React / Next.js", order_index=1)
        opt2_5_3 = QuestionOption(question_id=q2_5.id, label="Java / Spring Boot", value="Java / Spring Boot", order_index=2)
        opt2_5_4 = QuestionOption(question_id=q2_5.id, label="Go / Microservices", value="Go / Microservices", order_index=3)
        db.add_all([opt2_5_1, opt2_5_2, opt2_5_3, opt2_5_4])

        q2_6 = Question(
            form_id=form2.id,
            type="yes_no",
            title="Are you willing to relocate if required?",
            description="Select Yes or No.",
            required=True,
            order_index=5
        )
        q2_7 = Question(
            form_id=form2.id,
            type="rating",
            title="How would you rate your system design skills?",
            description="1 (Beginner) to 5 (Expert).",
            required=True,
            order_index=6
        )
        db.add_all([q2_6, q2_7])
        db.flush()

        # 4. Form 3: Event Registration (Draft)
        form3 = Form(
            creator_id=creator.id,
            title="Tech Conference Registration",
            description="Registration form for the annual developer summit.",
            status="draft",
            public_slug=None,
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=2),
            updated_at=datetime.datetime.utcnow() - datetime.timedelta(days=2)
        )
        db.add(form3)
        db.flush()

        q3_1 = Question(
            form_id=form3.id,
            type="short_text",
            title="Attendee Name",
            description="Enter attendee full name.",
            required=True,
            order_index=0
        )
        q3_2 = Question(
            form_id=form3.id,
            type="email",
            title="Attendee Email",
            description="Ticket QR code will be sent to this email.",
            required=True,
            order_index=1
        )
        db.add_all([q3_1, q3_2])
        db.flush()

        # 5. Add Sample Responses for Form 1 (Customer Feedback)
        responses_f1 = [
            {
                "name": "Ramu Sharma",
                "email": "ramu@gmail.com",
                "rating": "5",
                "feedback": "Loved the clean UI and keyboard navigation! Very smooth experience.",
                "recommend": "Yes"
            },
            {
                "name": "Priya Patel",
                "email": "priya@example.com",
                "rating": "4",
                "feedback": "The form builder was very intuitive. Reordering worked seamlessly.",
                "recommend": "Yes"
            },
            {
                "name": "Amit Kumar",
                "email": "amit.k@tech.io",
                "rating": "3",
                "feedback": "Good app overall, could use more styling customisation options.",
                "recommend": "No"
            },
            {
                "name": "Sarah Jenkins",
                "email": "sarah.j@company.org",
                "rating": "5",
                "feedback": "Super fast load times and clean minimalist design.",
                "recommend": "Yes"
            }
        ]

        for idx, r_data in enumerate(responses_f1):
            r_time = datetime.datetime.utcnow() - datetime.timedelta(hours=(idx + 1) * 6)
            resp = Response(form_id=form1.id, submitted_at=r_time)
            db.add(resp)
            db.flush()

            db.add_all([
                Answer(response_id=resp.id, question_id=q1_1.id, answer_text=r_data["name"]),
                Answer(response_id=resp.id, question_id=q1_2.id, answer_text=r_data["email"]),
                Answer(response_id=resp.id, question_id=q1_3.id, answer_text=r_data["rating"]),
                Answer(response_id=resp.id, question_id=q1_4.id, answer_text=r_data["feedback"]),
                Answer(response_id=resp.id, question_id=q1_5.id, answer_text=r_data["recommend"]),
            ])

        # 6. Add Sample Responses for Form 2 (Job Application)
        responses_f2 = [
            {
                "name": "Alex Mercer",
                "email": "alex.mercer@dev.net",
                "exp": "5",
                "mode": "Remote",
                "stack": "TypeScript / React / Next.js",
                "relocate": "Yes",
                "rating": "5"
            },
            {
                "name": "David Miller",
                "email": "dmiller@code.com",
                "exp": "7",
                "mode": "Hybrid",
                "stack": "Python / FastAPI",
                "relocate": "No",
                "rating": "4"
            },
            {
                "name": "Elena Rostova",
                "email": "elena.r@techhub.io",
                "exp": "4",
                "mode": "Remote",
                "stack": "Python / FastAPI",
                "relocate": "Yes",
                "rating": "4"
            },
            {
                "name": "Rohan Gupta",
                "email": "rohan.g@startup.in",
                "exp": "3",
                "mode": "On-site",
                "stack": "Java / Spring Boot",
                "relocate": "Yes",
                "rating": "3"
            },
            {
                "name": "Chen Wei",
                "email": "chen.wei@cloud.org",
                "exp": "8",
                "mode": "Remote",
                "stack": "Go / Microservices",
                "relocate": "No",
                "rating": "5"
            }
        ]

        for idx, r_data in enumerate(responses_f2):
            r_time = datetime.datetime.utcnow() - datetime.timedelta(hours=(idx + 1) * 4)
            resp = Response(form_id=form2.id, submitted_at=r_time)
            db.add(resp)
            db.flush()

            db.add_all([
                Answer(response_id=resp.id, question_id=q2_1.id, answer_text=r_data["name"]),
                Answer(response_id=resp.id, question_id=q2_2.id, answer_text=r_data["email"]),
                Answer(response_id=resp.id, question_id=q2_3.id, answer_text=r_data["exp"]),
                Answer(response_id=resp.id, question_id=q2_4.id, answer_text=r_data["mode"]),
                Answer(response_id=resp.id, question_id=q2_5.id, answer_text=r_data["stack"]),
                Answer(response_id=resp.id, question_id=q2_6.id, answer_text=r_data["relocate"]),
                Answer(response_id=resp.id, question_id=q2_7.id, answer_text=r_data["rating"]),
            ])

        db.commit()
        print("✅ Database seeding completed successfully!")
        print("   - Default Creator: Demo Creator (demo@example.com)")
        print("   - Form 1 (Published): 'Customer Feedback' (Slug: customer-feedback-demo)")
        print("   - Form 2 (Published): 'Job Application' (Slug: job-application-demo)")
        print("   - Form 3 (Draft): 'Tech Conference Registration'")
        print("   - Total Sample Submissions Seeded: 9 responses across published forms.")
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding database: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed()

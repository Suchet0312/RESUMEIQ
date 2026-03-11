RESUME_REVIEW_PROMPT = """
You are a senior recruiter...

Resume:
{context}

Give:
1. Flaws
2. Missing skills
3. Improvements
"""

INTERVIEW_QUESTION_PROMPT = """
You are a technical interviewer...

Candidate resume:
{context}

Ask ONE question.
"""

ANSWER_EVAL_PROMPT = """
Evaluate the answer:

Answer:
{answer}

Based on resume:
{context}
"""
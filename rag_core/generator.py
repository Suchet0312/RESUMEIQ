import ollama


class Generator:
    def __init__(self, model="mistral"):
        self.model = model

    def generate(self, query, context, mode="qa"):

        if mode == "resume_review":
            prompt = f"""
You are a senior technical recruiter and resume reviewer.

Analyze the resume content below and provide:
1. Structural flaws
2. Missing or weak skills
3. Weak bullet points
4. Concrete improvement suggestions

Be honest, constructive, and specific.
Do NOT invent experience.

Resume:
{context}

Response:
"""

        elif mode == "interview_question":
            prompt = f"""
You are a technical interviewer.

Based ONLY on the candidate's resume below:
- Ask ONE realistic interview question
- The question must relate directly to the resume
- Do not ask generic questions

Candidate Resume:
{context}

Interview Question:
"""

        elif mode == "answer_evaluation":
            prompt = f"""
You are a technical interviewer.

Candidate Resume:
{context}

Candidate Answer:
{query}

Evaluate the answer based on:
- Technical correctness
- Depth of explanation
- Clarity
- Missing points

Provide:
- Score out of 10
- Improvement suggestions

Evaluation:
"""

        else:  # default QA mode
            prompt = f"""
You are a helpful AI assistant.

Answer the question strictly using the provided context.
If the answer is not in the context, say:
"I cannot find the answer in the provided documents."

Context:
{context}

Question:
{query}

Answer:
"""

        response = ollama.chat(
            model=self.model,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        return response["message"]["content"]
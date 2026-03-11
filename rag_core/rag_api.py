from fastapi import FastAPI
import requests
import tempfile

from generator import Generator
from main1 import ingest_resume
from hybrid import hybrid_retrieve

app = FastAPI()

generator = Generator()


@app.post("/analyze-resume")
async def analyze_resume(data: dict):

    resume_url = data["resume_url"]

    # download resume from Supabase
    response = requests.get(resume_url)

    # save temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(response.content)
        resume_path = tmp.name

    retriever, bm25, reranker = ingest_resume(resume_path)

    results = hybrid_retrieve(
        query="Review this resume",
        retriever=retriever,
        bm25=bm25,
        top_k=5
    )

    for r in results:
        if isinstance(r["parent_text"], dict):
            r["parent_text"] = r["parent_text"]["text"]

    reranked = reranker.rerank("resume review", results)

    context = "\n\n".join([r["parent_text"] for r in reranked])

    answer = generator.generate(
        query="Review this resume",
        context=context,
        mode="resume_review"
    )

    return {
        "analysis": answer
    }
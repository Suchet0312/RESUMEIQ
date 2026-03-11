import os
from embedder import Embedder
from chunker import create_parent_child_chunks
from vector_index import vectorIndex
from retriever import Retriever
from reranker import Reranker
from bm25_retriever import BM25Retriever
from hybrid import hybrid_retrieve
from generator import Generator
from pdf_loader import load_pdf

DATA_FOLDER = "data"


def load_documents(folder_path):
    documents = []

    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)

        if filename.endswith(".txt"):
            with open(file_path, "r", encoding="utf-8") as f:
                text = f.read()

        elif filename.endswith(".pdf"):
            text = load_pdf(file_path)

        else:
            continue

        documents.append({
            "doc_id": filename,
            "text": text
        })

    return documents


def build_rag(documents):
    all_parents = []
    all_children = []
    all_child_to_parent = {}

    parent_offset = 0

    for doc in documents:
        parents, children, child_to_parent = create_parent_child_chunks(doc["text"])

        for i in range(len(parents)):
            parents[i] = {
                "doc_id": doc["doc_id"],
                "text": parents[i]
            }

        updated_child_to_parent = {
            (k + len(all_children)): (v + parent_offset)
            for k, v in child_to_parent.items()
        }

        all_parents.extend(parents)
        all_children.extend(children)
        all_child_to_parent.update(updated_child_to_parent)

        parent_offset += len(parents)

    embedder = Embedder()
    child_vectors = embedder.embed(all_children)
    child_vectors = embedder.normalize(child_vectors)

    index = vectorIndex(child_vectors.shape[1])
    index.add(child_vectors)

    retriever = Retriever(
        embedder=embedder,
        index=index,
        children=all_children,
        parents=all_parents,
        child_to_parent=all_child_to_parent
    )

    bm25 = BM25Retriever([p["text"] for p in all_parents])
    reranker = Reranker()

    return retriever, bm25, reranker


def ingest_resume(resume_path):
    text = load_pdf(resume_path)

    parents, children, mapping = create_parent_child_chunks(text)

    parents = [{"doc_id": "resume", "text": p} for p in parents]

    embedder = Embedder()
    child_vectors = embedder.embed(children)
    child_vectors = embedder.normalize(child_vectors)

    index = vectorIndex(child_vectors.shape[1])
    index.add(child_vectors)

    retriever = Retriever(
        embedder=embedder,
        index=index,
        children=children,
        parents=parents,
        child_to_parent=mapping
    )

    bm25 = BM25Retriever([p["text"] for p in parents])
    reranker = Reranker()

    return retriever, bm25, reranker


def resume_review_flow(generator):
    resume_path = input("\nEnter resume PDF path: ").strip()

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

    print("\n===== RESUME REVIEW =====\n")
    print(answer)

def mock_interview_flow(generator):
    resume_path = input("\nEnter resume PDF path: ").strip()

    retriever, bm25, reranker = ingest_resume(resume_path)

    while True:
        results = hybrid_retrieve(
            query="Generate interview question",
            retriever=retriever,
            bm25=bm25,
            top_k=5
        )

        for r in results:
            if isinstance(r["parent_text"], dict):
                r["parent_text"] = r["parent_text"]["text"]

        reranked = reranker.rerank("interview question", results)
        context = "\n\n".join([r["parent_text"] for r in reranked])

        question = generator.generate(
            query="",
            context=context,
            mode="interview_question"
        )

        print("\nINTERVIEWER:", question)

        user_answer = input("\nYour answer (or type 'exit'): ")
        if user_answer.lower() == "exit":
            break

        feedback = generator.generate(
            query=user_answer,
            context=context,
            mode="answer_evaluation"
        )

        print("\nFEEDBACK:")
        print(feedback)


def knowledge_qa_flow(generator, retriever, bm25, reranker):
    while True:
        query = input("\nAsk a question (or type 'exit'): ")
        if query.lower() == "exit":
            break

        results = hybrid_retrieve(query, retriever, bm25, top_k=5)

        for r in results:
            if isinstance(r["parent_text"], dict):
                r["parent_text"] = r["parent_text"]["text"]

        reranked = reranker.rerank(query, results)
        context = "\n\n".join([r["parent_text"] for r in reranked[:3]])

        answer = generator.generate(query, context, mode="qa")

        print("\n===== ANSWER =====\n")
        print(answer)

def main():
    print("\n===== MULTI-MODE RAG SYSTEM =====\n")

    generator = Generator()

    print("""
Choose mode:
1. Resume Review
2. Mock Interview
3. Knowledge QA
""")

    choice = input("Enter choice: ").strip()

    if choice == "1":
        resume_review_flow(generator)

    elif choice == "2":
        mock_interview_flow(generator)

    else:
        documents = load_documents(DATA_FOLDER)
        retriever, bm25, reranker = build_rag(documents)
        knowledge_qa_flow(generator, retriever, bm25, reranker)


if __name__ == "__main__":
    main()
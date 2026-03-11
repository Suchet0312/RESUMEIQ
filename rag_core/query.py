import pickle
from embedder import Embedder
from vector_index import vectorIndex
from retriever import Retriever
from reranker import Reranker
from generator import Generator

INDEX_PATH = "index/vector.index"
META_PATH = "index/meta.pkl"


def query_loop():

    embedder = Embedder()

    index = vectorIndex.load(INDEX_PATH)

    with open(META_PATH, "rb") as f:
        meta = pickle.load(f)

    retriever = Retriever(
        embedder=embedder,
        index=index,
        children=meta["children"],
        parents=meta["parents"],
        child_to_parent=meta["child_to_parent"]
    )

    reranker = Reranker()
    generator = Generator()

    while True:
        q = input("\nAsk a question (or 'exit'): ")

        if q.lower() == "exit":
            break

        results = retriever.retrieve(q, top_k=5)
        reranked = reranker.rerank(q, results)

        context = "\n\n".join([r["parent_text"] for r in reranked[:3]])

        answer = generator.generate(q, context)

        print("\n🔹 Answer:\n", answer)


if __name__ == "__main__":
    query_loop()
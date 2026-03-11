from sentence_transformers import CrossEncoder


class Reranker:
    def __init__(self, model_name="cross-encoder/ms-marco-MiniLM-L-6-v2"):
        self.model = CrossEncoder(model_name)

    def rerank(self, query, results):
        pairs = [(query, r["parent_text"]) for r in results]
        scores = self.model.predict(pairs)

        reranked = []

        for r, score in zip(results, scores):
            item = r.copy()  # preserve everything
            item["rerank_score"] = float(score)
            reranked.append(item)

        reranked = sorted(
            reranked,
            key=lambda x: x["rerank_score"],
            reverse=True
        )

        return reranked
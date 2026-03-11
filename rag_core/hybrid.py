def hybrid_retrieve(query, retriever, bm25, top_k=5):
    vector_results = retriever.retrieve(query, top_k=top_k)
    bm25_results = bm25.retrieve(query, top_k=top_k)

    combined = {}

    # Add vector results
    for r in vector_results:
        pid = r["parent_id"]
        combined[pid] = {
            "parent_id": pid,
            "parent_text": r["parent_text"],
            "vector_score": r.get("score", 0.0),
            "bm25_score": 0.0,
            "hybrid_score": 0.0,
            "rerank_score": 0.0
        }

    # Add BM25 results
    for r in bm25_results:
        pid = r["parent_id"]

        if pid not in combined:
            combined[pid] = {
                "parent_id": pid,
                "parent_text": r["parent_text"],
                "vector_score": 0.0,
                "bm25_score": r.get("bm25_score", 0.0),
                "hybrid_score": 0.0,
                "rerank_score": 0.0
            }
        else:
            combined[pid]["bm25_score"] = r.get("bm25_score", 0.0)

    # Normalize
    max_vec = max((v["vector_score"] for v in combined.values()), default=1)
    max_bm25 = max((v["bm25_score"] for v in combined.values()), default=1)

    for v in combined.values():
        if max_vec > 0:
            v["vector_score"] /= max_vec
        if max_bm25 > 0:
            v["bm25_score"] /= max_bm25

        v["hybrid_score"] = v["vector_score"] + v["bm25_score"]

    sorted_results = sorted(
        combined.values(),
        key=lambda x: x["hybrid_score"],
        reverse=True
    )

    return sorted_results[:top_k]
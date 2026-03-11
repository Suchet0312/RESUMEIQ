class Evaluator:
    def __init__(self, retriever, reranker=None, bm25=None, use_hybrid=False):
        self.retriever = retriever
        self.reranker = reranker
        self.bm25 = bm25
        self.use_hybrid = use_hybrid

    def recall_at_k(self, evaluation_data, k=2):
        correct = 0
        total = len(evaluation_data)

        for item in evaluation_data:
            question = item["question"]
            ground_truth = item["ground_truth"]

            # Choose retrieval strategy
            if self.use_hybrid:
                from hybrid import hybrid_retrieve
                results = hybrid_retrieve(
                    question,
                    self.retriever,
                    self.bm25,
                    top_k=5
                )
            else:
                results = self.retriever.retrieve(question, top_k=5)

            # Rerank if enabled
            if self.reranker is not None:
                results = self.reranker.rerank(question, results)

            results = results[:k]

            retrieved_texts = [r["parent_text"] for r in results]

            hit = any(ground_truth in text for text in retrieved_texts)

            if hit:
                correct += 1

            print("\nQuestion:", question)
            print("Hit:", hit)
            print("Top Results:")
            for text in retrieved_texts:
                print("-", text)

        return correct / total
# class Retriever:
#     def __init__(self, embedder, index, documents):
#         self.embedder = embedder
#         self.index = index
#         self.documents = documents

#     def retrieve(self, query, top_k=3):
#         query_vec = self.embedder.embed([query])
#         query_vec = self.embedder.normalize(query_vec)

#         scores, indices = self.index.search(query_vec, top_k)

#         results = []
#         for score, idx in zip(scores[0], indices[0]):
#             if idx < 0 or idx >= len(self.documents):
#                 continue
#             results.append({
#                 "chunk": self.documents[idx],
#                 "score": float(score),
#                 "index": int(idx)
#             })

#         return results

class Retriever:
    def __init__(self, embedder, index, children, parents, child_to_parent):
        self.embedder = embedder
        self.index = index
        self.children = children
        self.parents = parents
        self.child_to_parent = child_to_parent

    def retrieve(self, query, top_k=3):
        query_vec = self.embedder.embed([query])
        query_vec = self.embedder.normalize(query_vec)

        scores, indices = self.index.search(query_vec, top_k)

        parent_results = []
        seen_parents = set()

        for score, idx in zip(scores[0], indices[0]):
            if idx < 0:
                continue

            parent_id = self.child_to_parent[idx]

            if parent_id not in seen_parents:
                parent_results.append({
                    "parent_text": self.parents[parent_id],
                    "score": float(score),
                    "parent_id": parent_id
                })
                seen_parents.add(parent_id)

        return parent_results


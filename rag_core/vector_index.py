import faiss

class vectorIndex:
    def __init__(self,dimension):
        self.index = faiss.IndexFlatIP(dimension)

    def add(self,vectors):
        self.index.add(vectors)

    
    def search(self,query_vector,top_k=3):
        scores,indices = self.index.search(query_vector,top_k)
        return scores,indices
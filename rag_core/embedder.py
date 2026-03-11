from sentence_transformers import SentenceTransformer
import numpy as np

class Embedder:
    def __init__(self, model_name="BAAI/bge-base-en-v1.5", local_path="./models/bge-base"):
        # Try to load from local path first, else download and save
        try:
            self.model = SentenceTransformer(local_path)
            print(f"Loaded model from local path: {local_path}")
        except:
            print(f"Downloading model: {model_name}")
            self.model = SentenceTransformer(model_name)
            self.model.save(local_path)  # ← saves locally
            print(f"Model saved to: {local_path}")

    def embed(self, texts):
        embeddings = self.model.encode(
            texts,
            convert_to_numpy=True,
            normalize_embeddings=False  # we will normalize manually
        )
        return embeddings

    def normalize(self, vectors):
        norms = np.linalg.norm(vectors, axis=1, keepdims=True)
        return vectors / norms
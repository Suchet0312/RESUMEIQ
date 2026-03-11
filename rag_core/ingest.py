import os
from embedder import Embedder
from chunker import create_parent_child_chunks
from vector_index import vectorIndex
import pickle
from pdf_loader import load_pdf

DATA_PATH = "data/sample.txt"
INDEX_PATH = "index/vector.index"
META_PATH = "index/meta.pkl"

def ingest_resume(file_path):
    text = load_pdf(file_path)
    parents, children, mapping = create_parent_child_chunks(text)
    return parents, children, mapping

def ingest():

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        document = f.read()

    parents, children, child_to_parent = create_parent_child_chunks(document)

    embedder = Embedder()
    child_vectors = embedder.embed(children)
    child_vectors = embedder.normalize(child_vectors)

    index = vectorIndex(child_vectors.shape[1])
    index.add(child_vectors)

    index.save(INDEX_PATH)

    with open(META_PATH, "wb") as f:
        pickle.dump({
            "parents": parents,
            "children": children,
            "child_to_parent": child_to_parent
        }, f)

    print("✅ Index built successfully!")


if __name__ == "__main__":
    ingest()
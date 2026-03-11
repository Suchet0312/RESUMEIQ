def fixed_chunk(text, chunk_size=300, overlap=50):
    words = text.split()
    chunks = []

    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start = end - overlap

    return chunks

import re

def create_parent_child_chunks(text):
    # Split into sentences
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())

    parents = []
    children = []
    child_to_parent = {}

    # Group every 3 sentences into one parent
    for i in range(0, len(sentences), 3):
        parent_text = " ".join(sentences[i:i+3]).strip()
        parent_id = len(parents)
        parents.append(parent_text)

        # Each sentence becomes a child
        for sentence in sentences[i:i+3]:
            child_id = len(children)
            children.append(sentence.strip())
            child_to_parent[child_id] = parent_id

    return parents, children, child_to_parent


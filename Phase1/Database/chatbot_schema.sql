CREATE EXTENSION vector;

CREATE TABLE faq_chunks (
    chunk_id    SERIAL PRIMARY KEY,
    source_doc  VARCHAR(150) NOT NULL,
    content     TEXT NOT NULL,
    embedding   VECTOR(1536),     
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_faq_embedding
ON faq_chunks USING ivfflat (embedding vector_cosine_ops);
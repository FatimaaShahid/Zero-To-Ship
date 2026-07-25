CREATE TABLE knowledge_base (
    knowledge_id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    keywords TEXT
);

CREATE TABLE conversations (
    conversation_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
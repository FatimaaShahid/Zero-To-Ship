CREATE TABLE event_logs (
    event_id SERIAL PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_event_service
ON event_logs(service_name);

CREATE INDEX idx_event_type
ON event_logs(event_type);
INSERT INTO event_logs
(service_name, event_type, payload)
VALUES

(
'User Service',
'USER_CREATED',
'{"user_id":1,"name":"Abdul Moazzim"}'
),

(
'Library Service',
'BOOK_ADDED',
'{"book_id":1}'
),

(
'Bus Service',
'ROUTE_UPDATED',
'{"route":"Route A"}'
);

SELECT * FROM event_logs;
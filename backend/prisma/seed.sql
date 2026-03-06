-- Insert Wards
INSERT INTO "wards" ("name", "geojson", "createdAt", "updatedAt") VALUES
('Ward 1', '{"type":"Feature","properties":{"name":"Ward 1"},"geometry":{"type":"Polygon","coordinates":[[[0,0],[1,0],[1,1],[0,1],[0,0]]]}}', NOW(), NOW()),
('Ward 2', '{"type":"Feature","properties":{"name":"Ward 2"},"geometry":{"type":"Polygon","coordinates":[[[2,0],[3,0],[3,1],[2,1],[2,0]]]}}', NOW(), NOW()),
('Ward 3', '{"type":"Feature","properties":{"name":"Ward 3"},"geometry":{"type":"Polygon","coordinates":[[[4,0],[5,0],[5,1],[4,1],[4,0]]]}}', NOW(), NOW());

-- Insert Departments
INSERT INTO "departments" ("name", "slaHours", "createdAt", "updatedAt") VALUES
('Water', 24, NOW(), NOW()),
('Roads', 48, NOW(), NOW()),
('Sanitation', 12, NOW(), NOW());

-- Insert Users (passwords are hashed with bcrypt)
INSERT INTO "users" ("fullName", "email", "phone", "password", "role", "createdAt", "updatedAt") VALUES
('Admin User', 'admin@civiccrm.gov', '+1234567890', '$2b$10$K7m1W7Z8Q9w8X3Y2Z5a6O7n8P9q0r1s2t3u4v5w6x7y8z9a0b1c2d3e4f5g6h7i8j', 'admin', NOW(), NOW()),
('John Officer', 'officer@civiccrm.gov', '+1234567891', '$2b$10$L8n2X8Y9R0x9Y3Z2a6b7O8n9P0r1s2t3u4v5w6x7y8z9a0b1c2d3e4f5g6h7i8j9k', 'officer', NOW(), NOW()),
('Jane Citizen', 'citizen@example.com', '+1234567892', '$2b$10$M9o3Y9Z0S1y0Z3a2b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x8y9z0a', 'citizen', NOW(), NOW());

-- Insert Officer (linked to John Officer)
INSERT INTO "officers" ("userId", "wardId", "departmentId", "workload", "createdAt", "updatedAt") VALUES
(2, 1, 1, 0, NOW(), NOW());

-- Insert Sample Complaints
INSERT INTO "complaints" ("citizenId", "wardId", "departmentId", "description", "location", "latitude", "longitude", "category", "sentiment", "priorityScore", "status", "assignedOfficer", "assignedAt", "createdAt") VALUES
(3, 1, 1, 'Water supply has been interrupted for the past 2 days. No water in taps.', '123 Main Street, Ward 1', 40.7128, -74.0060, 'Water Supply', 'negative', 8.5, 'submitted', 1, NOW(), NOW()),
(3, 2, 2, 'Large pothole on the main road causing traffic issues.', '456 Oak Avenue, Ward 2', 40.7580, -73.9855, 'Road Damage', 'negative', 7.0, 'in_progress', NULL, NULL, NOW());

-- Insert Audit Logs
INSERT INTO "audit_logs" ("actorId", "action", "targetType", "targetId", "metadata", "createdAt") VALUES
(1, 'CREATE', 'User', 2, '{"role":"officer","department":"Water"}', NOW()),
(3, 'CREATE', 'Complaint', NULL, '{"category":"Water Supply","status":"submitted"}', NOW());

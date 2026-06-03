CREATE TABLE IF NOT EXISTS organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- Insert sample data
INSERT INTO organization (name, description, contact_email, logo_filename)
SELECT 'BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'
WHERE NOT EXISTS (SELECT 1 FROM organization WHERE name = 'BrightFuture Builders');

INSERT INTO organization (name, description, contact_email, logo_filename)
SELECT 'GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'
WHERE NOT EXISTS (SELECT 1 FROM organization WHERE name = 'GreenHarvest Growers');

INSERT INTO organization (name, description, contact_email, logo_filename)
SELECT 'UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png'
WHERE NOT EXISTS (SELECT 1 FROM organization WHERE name = 'UnityServe Volunteers');

DROP TABLE IF EXISTS service_project_category;
DROP TABLE IF EXISTS service_project;
DROP TABLE IF EXISTS category;

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organization(organization_id),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time_commitment VARCHAR(100) NOT NULL,
    volunteers_needed INTEGER NOT NULL CHECK (volunteers_needed > 0)
);

CREATE TABLE service_project_category (
    project_id INTEGER NOT NULL REFERENCES service_project(project_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES category(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

INSERT INTO category (name) VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');

INSERT INTO service_project (organization_id, title, description, location, date, time_commitment, volunteers_needed) VALUES
-- BrightFuture Builders (org 1)
(1, 'City Park Cleanup', 'Join us every Saturday morning to clean up litter, restore trails, and plant native species in our local parks.', 'Central Park', '2026-06-07', '3 hours / week', 20),
(1, 'Neighborhood Mural Project', 'Help design and paint community murals to beautify local neighborhoods and celebrate cultural heritage.', 'Westside Arts District', '2026-06-21', '4 hours / week', 12),
(1, 'Home Repair for Seniors', 'Assist elderly residents with minor home repairs such as painting, fixing leaks, and installing safety rails.', 'Various Locations', '2026-07-05', '5 hours / week', 10),
(1, 'Community Garden Build', 'Help construct raised garden beds and install irrigation systems for a new community garden.', 'Northside Community Park', '2026-07-12', '6 hours (one-time event)', 25),
(1, 'Trail Restoration Crew', 'Work alongside park rangers to restore damaged hiking trails and install erosion-control measures.', 'Greenway Nature Reserve', '2026-08-02', '4 hours / week', 18),
-- GreenHarvest Growers (org 2)
(2, 'After-School Tutoring Program', 'Provide one-on-one tutoring in math, science, and reading to students in grades 3-8 after school hours.', 'Eastside Community Center', '2026-06-10', '2 hours / week', 15),
(2, 'Urban Farm Volunteer Day', 'Help plant, water, and harvest crops at our urban farm that donates fresh produce to local food banks.', 'GreenHarvest Urban Farm', '2026-06-14', '3 hours / week', 20),
(2, 'Composting Workshop', 'Teach community members how to compost at home and help set up composting stations in local parks.', 'Eastside Community Center', '2026-06-28', '2 hours / week', 8),
(2, 'Farmers Market Support', 'Assist vendors at our weekly farmers market, helping with setup, customer service, and breakdown.', 'City Farmers Market', '2026-07-06', '4 hours / week', 12),
(2, 'School Garden Educator', 'Visit local elementary schools to teach students about gardening, nutrition, and sustainable food systems.', 'Various Elementary Schools', '2026-07-20', '3 hours / week', 10),
-- UnityServe Volunteers (org 3)
(3, 'Monthly Food Drive', 'Help collect, sort, and distribute food donations to families in need throughout the city.', 'Downtown Food Bank', '2026-06-14', '4 hours / month', 30),
(3, 'Community Health Fair', 'Assist with organizing and running free health screenings, fitness workshops, and wellness consultations.', 'Riverside Convention Center', '2026-07-19', '6 hours (one-time event)', 50),
(3, 'Homeless Shelter Meal Service', 'Prepare and serve meals to residents at the downtown homeless shelter every Sunday morning.', 'Unity Shelter Downtown', '2026-06-22', '3 hours / week', 15),
(3, 'Youth Mentorship Program', 'Mentor at-risk youth through weekly one-on-one meetings focused on academics, life skills, and career exploration.', 'UnityServe Community Hub', '2026-07-07', '2 hours / week', 20),
(3, 'Disaster Relief Supply Drive', 'Help sort and pack emergency supply kits for families displaced by natural disasters in our region.', 'UnityServe Warehouse', '2026-08-10', '4 hours / week', 35);

INSERT INTO service_project_category (project_id, category_id) VALUES
-- BrightFuture Builders projects
(1, 1),
(2, 3),
(3, 3),
(4, 1),
(5, 1),
-- GreenHarvest Growers projects
(6, 2),
(7, 1),
(8, 1),
(9, 3),
(10, 2),
-- UnityServe Volunteers projects
(11, 3),
(12, 4),
(13, 3),
(14, 2),
(15, 3);

-- Quick verification
SELECT * FROM organization;

-- Roles table for role-based access control
CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description)
SELECT 'user', 'Standard user with basic access'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE role_name = 'user');

INSERT INTO roles (role_name, role_description)
SELECT 'admin', 'Administrator with full system access'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE role_name = 'admin');

-- Users table references roles for RBAC
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grader admin test account (password: cse340!)
INSERT INTO users (name, email, password_hash, role_id)
SELECT 'Admin', 'admin@example.com', '$2b$10$VFbPQxhrdKevqBxzv9EMP.P1CgslYh7xy2BDqTf9NUNsMAHji27KG',
       (SELECT role_id FROM roles WHERE role_name = 'admin')
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com');

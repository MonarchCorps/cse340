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

INSERT INTO service_project (organization_id, title, description, location, time_commitment, volunteers_needed) VALUES
(1, 'City Park Cleanup', 'Join us every Saturday morning to clean up litter, restore trails, and plant native species in our local parks.', 'Central Park', '3 hours / week', 20),
(2, 'After-School Tutoring Program', 'Provide one-on-one tutoring in math, science, and reading to students in grades 3-8 after school hours.', 'Eastside Community Center', '2 hours / week', 15),
(3, 'Monthly Food Drive', 'Help collect, sort, and distribute food donations to families in need throughout the city.', 'Downtown Food Bank', '4 hours / month', 30),
(3, 'Community Health Fair', 'Assist with organizing and running free health screenings, fitness workshops, and wellness consultations.', 'Riverside Convention Center', '6 hours (one-time event)', 50);

INSERT INTO service_project_category (project_id, category_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(4, 3);

-- Quick verification
SELECT * FROM organization;

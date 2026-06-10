import db from './db.js';

const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO user_project (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
    `;
    await db.query(query, [userId, projectId]);
};

const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM user_project
        WHERE user_id = $1 AND project_id = $2
    `;
    await db.query(query, [userId, projectId]);
};

const getVolunteerProjectsByUserId = async (userId) => {
    const query = `
        SELECT sp.project_id, sp.title, sp.location, sp.date, sp.time_commitment,
               o.name AS organization_name
        FROM user_project up
        JOIN service_project sp ON up.project_id = sp.project_id
        JOIN organization o ON sp.organization_id = o.organization_id
        WHERE up.user_id = $1
        ORDER BY sp.date ASC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

const isVolunteering = async (userId, projectId) => {
    const query = `
        SELECT 1 FROM user_project
        WHERE user_id = $1 AND project_id = $2
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

export { addVolunteer, removeVolunteer, getVolunteerProjectsByUserId, isVolunteering };

import db from './db.js'

const getAllProjects = async() => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.date,
            p.time_commitment,
            p.volunteers_needed,
            o.name AS organization_name,
            COALESCE(string_agg(c.name, ', ' ORDER BY c.name), '') AS categories
        FROM public.service_project p
        JOIN public.organization o ON o.organization_id = p.organization_id
        LEFT JOIN public.service_project_category spc ON spc.project_id = p.project_id
        LEFT JOIN public.category c ON c.category_id = spc.category_id
        GROUP BY p.project_id, o.name
        ORDER BY p.project_id;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
      SELECT
        project_id,
        organization_id,
        title,
        description,
        location,
        date
      FROM service_project
      WHERE organization_id = $1
      ORDER BY date;
    `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
      SELECT sp.project_id, sp.title, sp.description, sp.location, sp.date
      FROM service_project sp
      JOIN service_project_category spc ON spc.project_id = sp.project_id
      WHERE spc.category_id = $1
      ORDER BY sp.date;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows;
};

const getProjectById = async (projectId) => {
    const query = `
      SELECT
        sp.project_id, sp.title, sp.description, sp.location,
        sp.date, sp.time_commitment, sp.volunteers_needed, sp.organization_id,
        o.name AS organization_name
      FROM service_project sp
      JOIN organization o ON o.organization_id = sp.organization_id
      WHERE sp.project_id = $1;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

const getUpcomingProjects = async () => {
    const query = `
      SELECT
        sp.project_id, sp.title, sp.description, sp.location,
        sp.date, sp.time_commitment, sp.volunteers_needed,
        o.organization_id, o.name AS organization_name,
        COALESCE(string_agg(c.name, ', ' ORDER BY c.name), '') AS categories
      FROM service_project sp
      JOIN organization o ON o.organization_id = sp.organization_id
      LEFT JOIN service_project_category spc ON spc.project_id = sp.project_id
      LEFT JOIN category c ON c.category_id = spc.category_id
      WHERE sp.date >= CURRENT_DATE
      GROUP BY sp.project_id, o.organization_id
      ORDER BY sp.date ASC
      LIMIT 5;
    `;
    const result = await db.query(query);
    return result.rows;
};

const createProject = async (title, description, location, date, organizationId, timeCommitment, volunteersNeeded) => {
    const query = `
      INSERT INTO service_project (title, description, location, date, organization_id, time_commitment, volunteers_needed)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId, timeCommitment, volunteersNeeded];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};

const updateProject = async (projectId, title, description, location, date, organizationId, timeCommitment, volunteersNeeded) => {
    const query = `
      UPDATE service_project
      SET title = $1, description = $2, location = $3, date = $4,
          organization_id = $5, time_commitment = $6, volunteers_needed = $7
      WHERE project_id = $8
      RETURNING project_id;
    `;
    const result = await db.query(query, [title, description, location, date, organizationId, timeCommitment, volunteersNeeded, projectId]);

    if (result.rows.length === 0) {
        throw new Error('Project not found or update failed');
    }

    return result.rows[0].project_id;
};

export { getAllProjects, getProjectsByOrganizationId, getProjectsByCategoryId, getProjectById, getUpcomingProjects, createProject, updateProject }
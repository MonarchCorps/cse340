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

export { getAllProjects, getProjectsByOrganizationId }
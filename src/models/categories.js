import db from './db.js'

const getAllCategories = async() => {
    const query = `
        SELECT category_id, name
        FROM public.category;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getCategoryById = async (categoryId) => {
    const query = `SELECT category_id, name FROM category WHERE category_id = $1;`;
    const result = await db.query(query, [categoryId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

const getCategoriesByProjectId = async (projectId) => {
    const query = `
      SELECT c.category_id, c.name
      FROM category c
      JOIN service_project_category spc ON spc.category_id = c.category_id
      WHERE spc.project_id = $1
      ORDER BY c.name;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

const assignCategoryToProject = async (projectId, categoryId) => {
    const query = `
      INSERT INTO service_project_category (project_id, category_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING;
    `;
    await db.query(query, [projectId, categoryId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
    await db.query(
        `DELETE FROM service_project_category WHERE project_id = $1;`,
        [projectId]
    );

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(projectId, categoryId);
    }
};

export { getAllCategories, getCategoryById, getCategoriesByProjectId, updateCategoryAssignments }
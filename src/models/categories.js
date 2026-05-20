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

export { getAllCategories, getCategoryById, getCategoriesByProjectId }
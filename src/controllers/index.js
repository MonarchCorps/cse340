import db from '../models/db.js';

const showHomePage = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM organization ORDER BY organization_id LIMIT 3');
        res.render('index', { title: 'Home', organizations: result.rows });
    } catch (error) {
        console.error('Error fetching organizations for home:', error.message);
        res.render('index', { title: 'Home', organizations: [] });
    }
};

export { showHomePage };

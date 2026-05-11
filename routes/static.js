import express from 'express'
import db from '../src/models/db.js'

const router = express.Router()

router.get('/', async (req, res) => {
	try {
		const result = await db.query('SELECT * FROM organization ORDER BY organization_id LIMIT 3')
		res.render('index', { title: 'Home', organizations: result.rows })
	} catch (error) {
		console.error('Error fetching organizations for home:', error.message)
		res.render('index', { title: 'Home', organizations: [] })
	}
})

router.get('/projects', async (req, res) => {
	res.render('projects', { title: 'Service Projects' })
})

router.get('/categories', async (req, res) => {
	res.render('categories', { title: 'Categories' })
})

export default router

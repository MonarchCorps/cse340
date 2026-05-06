import express from 'express'

const router = express.Router()

router.get('/', async (req, res) => {
	res.render('index', { title: 'Home' })
})

router.get('/organizations', async (req, res) => {
	res.render('organizations', { title: 'Organizations' })
})

router.get('/projects', async (req, res) => {
	res.render('projects', { title: 'Service Projects' })
})

router.get('/categories', async (req, res) => {
	res.render('categories', { title: 'Categories' })
})

export default router

import express from 'express'
import dotenv from 'dotenv'
import staticRoutes from './routes/static.js'
import { testConnection } from './src/models/db.js'
import { getAllOrganizations } from './src/models/organizations.js'
import { getAllCategories } from './src/models/categories.js'
import { getAllProjects } from './src/models/projects.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5500

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(express.static('public'))

app.get('/organizations', async (req, res) => {
	const organizations = await getAllOrganizations()

	const title = 'Our Partner Organizations'
	res.render('organizations', { title, organizations })
})

app.get('/categories', async (req, res) => {
	const categories = await getAllCategories()
	const title = 'Service Project Categories'
	res.render('categories', { title, categories })
})

app.get('/projects', async (req, res) => {
	const projects = await getAllProjects()
	const title = 'Service Projects'
	res.render('projects', { title, projects })
})

app.use('/', staticRoutes)

app.listen(port, async () => {
	const NODE_ENV = process.env.NODE_ENV || 'development'
	try {
		await testConnection()
		console.log(`Server running on http://localhost:${port}`)
		console.log(`Environment: ${NODE_ENV}`)
	} catch (error) {
		console.error('Error connecting to the database:', error.message)
	}
})

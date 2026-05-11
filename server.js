import express from 'express'
import dotenv from 'dotenv'
import staticRoutes from './routes/static.js'
import { testConnection } from './src/models/db.js'
import { getAllOrganizations } from './src/models/organizations.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5500

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(express.static('public'))

app.get('/organizations', async (req, res) => {
	const organizations = await getAllOrganizations()
	console.log(organizations)

	const title = 'Our Partner Organizations'
	res.render('organizations', { title, organizations })
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

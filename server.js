import express from 'express'
import dotenv from 'dotenv'
import staticRoutes from './routes/static.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5500

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(express.static('public'))

app.use('/', staticRoutes)

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`)
})

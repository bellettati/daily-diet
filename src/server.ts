import { app } from './app'

const PORT = 3333
app.listen({
	port: 3333
}).then(() => console.log(`server running on http://localhost:${PORT}`))
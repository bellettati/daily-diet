import { FastifyInstance } from 'fastify'
import { validateSessionId } from '../middlewares/validate-session-id'
import { knex } from '../database'
import z from 'zod'
import { randomUUID } from 'node:crypto'

export async function mealsRoutes(app: FastifyInstance) {
    app.addHook('preHandler', validateSessionId)

    app.get('/', async (req) => {
        const { sessionId } = req.cookies

        const user = await knex('users').where('session_id', sessionId).first()
        const meals = await knex('meals').where('user_id', user!.id).select()
        return { meals }
    })

    app.post('/', async (req, reply) => {
        const createMealBody = z.object({
            name: z.string(),
            description: z.string(),
        })
        const { name, description } = createMealBody.parse(req.body)

        const { sessionId } = req.cookies
        const user = await knex('users').where('session_id', sessionId).first()

        await knex('meals').insert({
            id: randomUUID(),
            name,
            description,
            meal_date: new Date().toString(),
            inside_diet: true, // TODO: add diet logic
            user_id: user!.id,
        })

        return reply.status(201).send()
    })
}

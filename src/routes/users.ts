import { FastifyInstance } from 'fastify'
import z from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function usersRoutes(app: FastifyInstance) {
    app.post('/', async (req, reply) => {
        const createUserRequestBody = z.object({
            email: z.string().email(),
            firstName: z.string(),
            lastName: z.string(),
        })
        const { email, firstName, lastName } = createUserRequestBody.parse(
            req.body
        )
        const sessionId = randomUUID()
        reply.cookie('sessionId', sessionId, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        })
        await knex('users').insert({
            id: randomUUID(),
            email,
            first_name: firstName,
            last_name: lastName,
            session_id: sessionId,
        })

        return reply.status(201).send()
    })
}

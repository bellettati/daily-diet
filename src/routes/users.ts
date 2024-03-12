import { FastifyInstance } from 'fastify'
import z from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function usersRoutes(app: FastifyInstance) {
    //test route, should be deleted
    app.get('/', async () => {
        const users = await knex('users').select()
        return { users }
    })

    app.post('/', async (req, reply) => {
        const createUserRequestBody = z.object({
            email: z.string().email(),
            firstName: z.string(),
            lastName: z.string(),
        })
        const { email, firstName, lastName } = createUserRequestBody.parse(
            req.body
        )
        await knex('users').insert({
            id: randomUUID(),
            email,
            first_name: firstName,
            last_name: lastName,
        })

        return reply.status(201).send()
    })
}

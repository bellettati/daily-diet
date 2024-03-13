import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { knex } from '../database'

export async function validateUserMeal(
    req: FastifyRequest,
    reply: FastifyReply
) {
    const { sessionId } = req.cookies
    const requestParams = z.object({
        id: z.string(),
    })
    const { id } = requestParams.parse(req.params)
    const user = await knex('users').where('session_id', sessionId).first()
    const meal = await knex('meals').where('id', id).first()
    if (!user || !meal) {
        return reply.status(404).send({ error: 'Not Found' })
    }

    if (meal.user_id !== user.id) {
        return reply.status(401).send({ error: 'Unauthorized' })
    }
}

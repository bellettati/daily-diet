import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'

export async function validateSessionId(
    req: FastifyRequest,
    reply: FastifyReply
) {
    const { sessionId } = req.cookies
    if (!sessionId) {
        reply.status(401).send({ error: 'Unauthorized' })
    }

    const user = await knex('users').where('session_id', sessionId).first()
    if (!user) {
        reply.status(401).send({ error: 'Invalid session_id' })
    }
}

import { FastifyInstance } from 'fastify'
import z from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { getBestMealSequence } from '../helpers/get-best-meal-sequence'
import { validateSessionId } from '../middlewares/validate-session-id'

export async function usersRoutes(app: FastifyInstance) {
    app.get('/', async () => {
        const users = await knex('users').select()
        return { users }
    })

    app.get(
        '/:id/metrics',
        {
            preHandler: validateSessionId,
        },
        async (req) => {
            const requestParams = z.object({ id: z.string().uuid() })
            const { id } = requestParams.parse(req.params)
            const registeredMeals = await knex('meals')
                .where('user_id', id)
                .select()
            const mealsInDiet = registeredMeals.filter(
                (meal) => meal.inside_diet
            ).length
            const sequenceMealsInDiet = getBestMealSequence(registeredMeals)

            return {
                registeredMeals: registeredMeals.length,
                mealsInDiet,
                sequenceMealsInDiet,
            }
        }
    )

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

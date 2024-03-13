import { FastifyInstance } from 'fastify'
import { validateSessionId } from '../middlewares/validate-session-id'
import { knex } from '../database'
import z from 'zod'
import { randomUUID } from 'node:crypto'
import { buildUTCDate } from '../helpers/build-utc-date'
import { getDateHourDifference } from '../helpers/get-date-hour-difference'

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
        const lastMeal = (
            await knex('meals').where('user_id', user!.id).select()
        ).pop()
        const currentDate = buildUTCDate().toISOString()
        let mealIsInsideDiet = false
        if (lastMeal) {
            const hourDifferenceBetweenMeals = getDateHourDifference(
                currentDate,
                lastMeal!.meal_date
            )
            mealIsInsideDiet = hourDifferenceBetweenMeals >= 3 ? true : false
        } else {
            mealIsInsideDiet = true
        }

        await knex('meals').insert({
            id: randomUUID(),
            name,
            description,
            meal_date: currentDate,
            inside_diet: mealIsInsideDiet, // TODO: add diet logic
            user_id: user!.id,
        })

        return reply.status(201).send()
    })
}

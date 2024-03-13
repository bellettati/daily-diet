import { FastifyInstance } from 'fastify'
import { validateSessionId } from '../middlewares/validate-session-id'
import { knex } from '../database'
import z from 'zod'
import { randomUUID } from 'node:crypto'
import { buildUTCDate } from '../helpers/build-utc-date'
import { getDateHourDifference } from '../helpers/get-date-hour-difference'
import { validateUserMeal } from '../middlewares/validate-user-meal'

export async function mealsRoutes(app: FastifyInstance) {
    app.addHook('preHandler', validateSessionId)

    app.get('/', async (req) => {
        const { sessionId } = req.cookies

        const user = await knex('users').where('session_id', sessionId).first()
        const meals = await knex('meals').where('user_id', user!.id).select()
        return { meals }
    })

    app.get(
        '/:id',
        {
            preHandler: validateUserMeal,
        },
        async (req) => {
            const requestParams = z.object({
                id: z.string().uuid(),
            })
            const { id } = requestParams.parse(req.params)
            const meal = await knex('meals').where('id', id).first()
            return { meal }
        }
    )

    app.post('/', async (req, reply) => {
        const createMealBody = z.object({
            name: z.string(),
            description: z.string(),
            date: z.string(),
        })
        const { name, description, date } = createMealBody.parse(req.body)
        const { sessionId } = req.cookies
        const user = await knex('users').where('session_id', sessionId).first()
        const lastMeal = (
            await knex('meals').where('user_id', user!.id).select()
        ).pop()
        const currentDate = buildUTCDate(date).toISOString()
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

    app.put(
        '/:id',
        {
            preHandler: validateUserMeal,
        },
        async (req, reply) => {
            const requestParams = z.object({ id: z.string() })
            const { id } = requestParams.parse(req.params)

            const requestBody = z.object({
                name: z.string().optional(),
                description: z.string().optional(),
                date: z.string().optional(),
                inDiet: z.boolean().optional(),
            })
            const { name, description, date, inDiet } = requestBody.parse(
                req.body
            )
            await knex('meals')
                .where('id', id)
                .update({
                    name: name ?? undefined,
                    description: description ?? undefined,
                    meal_date: date
                        ? buildUTCDate(date).toISOString()
                        : undefined,
                    inside_diet: inDiet ?? undefined,
                })

            return reply.status(204).send()
        }
    )

    app.delete(
        '/:id',
        {
            preHandler: validateUserMeal,
        },
        async (req, reply) => {
            const requestParams = z.object({
                id: z.string().uuid(),
            })
            const { id } = requestParams.parse(req.params)
            await knex('meals').where('id', id).del()
            return reply.status(204).send()
        }
    )
}

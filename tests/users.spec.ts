import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('users routes', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    beforeEach(async () => {
        execSync('npx knex migrate:rollback --all')
        execSync('npx knex migrate:latest')
    })

    it('should create user', async () => {
        await request(app.server)
            .post('/users')
            .send({
                email: 'test@email.com',
                firstName: 'John',
                lastName: 'Doe',
            })
            .expect(201)
    })

    it('should get users metrics', async () => {
        await request(app.server).get('/users').set('Cookie', [])

        const createUserResponse = await request(app.server)
            .post('/users')
            .send({
                email: 'test@email.com',
                firstName: 'John',
                lastName: 'Doe',
            })
        const cookies = createUserResponse.get('Set-Cookie')
        const { body: createUserBody } = await request(app.server).get('/users')
        const user = createUserBody.users[0]

        await request(app.server).post('/meals').set('Cookie', cookies).send({
            name: 'Breakfast',
            description: 'eggs and bread',
            date: '13-MAR-2024 13:43:07',
        })
        await request(app.server).post('/meals').set('Cookie', cookies).send({
            name: 'Breakfast',
            description: 'eggs and bread',
            date: '13-MAR-2024 13:43:07',
        })
        await request(app.server).post('/meals').set('Cookie', cookies).send({
            name: 'Breakfast',
            description: 'eggs and bread',
            date: '13-MAR-2024 13:43:07',
        })

        const { body: getMetricsBody } = await request(app.server)
            .get(`/users/${user.id}/metrics`)
            .set('Cookie', cookies)
            .expect(200)

        expect(getMetricsBody).toEqual(
            expect.objectContaining({
                registeredMeals: 3,
                mealsInDiet: 1,
                sequenceMealsInDiet: 1,
            })
        )
    })
})

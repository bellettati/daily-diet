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

    it('should create meal', async () => {
        const createUserResponse = await request(app.server)
            .post('/users')
            .send({
                email: 'test@email.com',
                firstName: 'John',
                lastName: 'Doe',
            })
        const cookies = createUserResponse.get('Set-Cookie')
        await request(app.server)
            .post('/meals')
            .set('Cookie', cookies)
            .send({
                name: 'Breakfast',
                description: 'eggs and bread',
                date: '13-MAR-2024 13:43:07',
            })
            .expect(201)
    })

    it('should list all meals', async () => {
        const createUserResponse = await request(app.server)
            .post('/users')
            .send({
                email: 'test@email.com',
                firstName: 'John',
                lastName: 'Doe',
            })
        const cookies = createUserResponse.get('Set-Cookie')
        await request(app.server)
            .post('/meals')
            .set('Cookie', cookies)
            .send({
                name: 'Breakfast',
                description: 'eggs and bread',
                date: '13-MAR-2024 13:43:07',
            })
            .expect(201)
        const { body: listAllMealsBody } = await request(app.server)
            .get('/meals')
            .set('Cookie', cookies)

        expect(listAllMealsBody.meals).toEqual([
            expect.objectContaining({
                name: 'Breakfast',
                description: 'eggs and bread',
            }),
        ])
    })

    it('should get specific meal', async () => {
        const createUserResponse = await request(app.server)
            .post('/users')
            .send({
                email: 'test@email.com',
                firstName: 'John',
                lastName: 'Doe',
            })
        const cookies = createUserResponse.get('Set-Cookie')
        await request(app.server).post('/meals').set('Cookie', cookies).send({
            name: 'Breakfast',
            description: 'eggs and bread',
            date: '13-MAR-2024 13:43:07',
        })
        const { body: listAllMealsBody } = await request(app.server)
            .get('/meals')
            .set('Cookie', cookies)
        const { body: getSpecificMealBody } = await request(app.server)
            .get(`/meals/${listAllMealsBody.meals[0].id}`)
            .set('Cookie', cookies)

        expect(getSpecificMealBody.meal).toEqual(
            expect.objectContaining({
                name: 'Breakfast',
                description: 'eggs and bread',
            })
        )
    })

    it('should update meal', async () => {
        const createUserResponse = await request(app.server)
            .post('/users')
            .send({
                email: 'test@email.com',
                firstName: 'John',
                lastName: 'Doe',
            })
        const cookies = createUserResponse.get('Set-Cookie')
        await request(app.server).post('/meals').set('Cookie', cookies).send({
            name: 'Breakfast',
            description: 'eggs and bread',
            date: '13-MAR-2024 13:43:07',
        })
        const { body: listAllMealsBody } = await request(app.server)
            .get('/meals')
            .set('Cookie', cookies)

        await request(app.server)
            .put(`/meals/${listAllMealsBody.meals[0].id}`)
            .set('Cookie', cookies)
            .send({
                name: 'Lunch',
                description: 'rice and chicken',
                date: '15-MAR-2024 13:43:07',
                inDiet: true,
            })
            .expect(204)
    })
})

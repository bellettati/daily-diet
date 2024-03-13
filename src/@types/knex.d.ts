import { Knex } from 'knex'

declare module 'knex/types/tables' {
    export interface Tables {
        users: {
            id: string
            email: string
            first_name: string
            last_name: string
            session_id: string
            created_at: string
        }
        meals: {
            id: string
            name: string
            description: string
            meal_date: string
            inside_diet: boolean
            user_id: string
            created_at: string
        }
    }
}

import { Knex } from 'knex'

declare module 'knex/types/tables' {
    export interface Tables {
        users: {
            id: string
            email: string
            first_name: string
            last_name: string
            created_at: string
        }
    }
}

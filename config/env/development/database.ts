export default ({ env }) => ({
    connection: {
        client: 'postgres',
        connection: {
            host: env('DATABASE_HOST'),
            port: env.int('DATABASE_PORT'),
            database: env('DATABASE_NAME'),
            user: env('DATABASE_USERNAME'),
            password: env('DATABASE_PASSWORD')
        },
        acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    }
});
const throwEnvError = (varName: string) => {
  throw new Error(`Env variable "${varName}" is not set.`)
}

if (!process.env.PORT) {
  throwEnvError('PORT')
}

if (!process.env.DATABASE_URL) {
  throwEnvError('DATABASE_URL')
}

if (!process.env.JWT_SECRET) {
  throwEnvError('JWT_SECRET')
}

export const PORT = process.env.PORT as string
export const DATABASE_URL = process.env.DATABASE_URL as string
export const JWT_SECRET = process.env.JWT_SECRET as string

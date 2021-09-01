if (process.env.NODE_ENV === 'production') {
  require('module-alias/register')
}

import { PORT } from '@/config/env'
import express from 'express'
import type { ErrorRequestHandler } from 'express'
import cors from 'cors'

import { StatusCodes } from 'http-status-codes'
import apiRoutes from '@/api-routes'
import { isPrismaError, buildPrismaError } from '@/common/prisma-error-handler'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', apiRoutes)
app.get('/health', (req, res) => {
  res.send()
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err)
  if (isPrismaError(err)) {
    const prismaError = buildPrismaError(err)
    res.status(prismaError.status).json(prismaError)
  } else {
    if (err.title) {
      res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    } else {
      if (err.message && String(err.message).includes('RelationViolation')) {
        const status = err.status || StatusCodes.UNPROCESSABLE_ENTITY
        return res.status(status).json({
          status,
          title: 'Existem dados que utilizam este registro.',
        })
      }
      const status = StatusCodes.INTERNAL_SERVER_ERROR
      res.status(status).json({ status, title: 'Ocorreu um erro desconhecido no servidor.' })
    }
  }
}

app.use(errorHandler)

app.listen(PORT, async () => {
  console.log(`⚡️[server]: Server is running at port ${PORT}`)
})

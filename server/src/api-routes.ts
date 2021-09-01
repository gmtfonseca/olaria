import express, { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import { StatusCodes } from 'http-status-codes'

import passportJwtStrategy from '@/config/passport-jwt-strategy'
import testRoute from '@/modules/test/route'
import fishRoute from '@/modules/fish/route'
import pondRoute from '@/modules/pond/route'
import movementRoute from '@/modules/movement/route'
import inventoryRoute from '@/modules/inventory/route'
import transferRoute from '@/modules/transfer/route'
import sessionRoute from '@/modules/session/route'

const router = express.Router()

router.use('/sessions', sessionRoute)

passport.use(passportJwtStrategy)

const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false, failWithError: true }, (error, user, info) => {
    const detail = 'Faça seu login para continuar.'
    if (info?.name === 'TokenExpiredError') {
      return next({ status: StatusCodes.UNAUTHORIZED, title: 'JWT expirou', detail })
    }

    if (info?.name === 'JsonWebTokenError') {
      return next({ status: StatusCodes.UNAUTHORIZED, title: 'JWT inválido', detail })
    }

    if (info?.name === 'Error' || error || !user) {
      return next({ status: StatusCodes.UNAUTHORIZED, title: 'Não autorizado', detail })
    }

    req.user = user
    next()
  })(req, res, next)
}

if (process.env.NODE_ENV === 'test') {
  router.use('/test', testRoute)
}
router.use('/fishes', jwtAuth, fishRoute)
router.use('/ponds', jwtAuth, pondRoute)
router.use('/movements', jwtAuth, movementRoute)
router.use('/inventories', jwtAuth, inventoryRoute)
router.use('/transfers', jwtAuth, transferRoute)

export default router

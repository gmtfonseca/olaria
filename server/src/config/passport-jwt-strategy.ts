import prisma from '@/lib/prisma-client'

import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from 'passport-jwt'
import { JWT_SECRET } from '@/config/env'

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
}

const jwtStrategy = new JwtStrategy(options, async (payload, done: VerifiedCallback) => {
  try {
    const user = await prisma.user.findFirst({ where: { id: payload.id, inactive: false } })
    if (user) {
      done(null, { id: user.id, name: user.name })
    } else {
      done(null, false)
    }
  } catch (e) {
    done(e, false)
  }
})

export default jwtStrategy

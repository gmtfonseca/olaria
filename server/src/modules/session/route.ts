import express from 'express'
import asyncHandler from 'express-async-handler'

import sessionController from '@/modules/session/controller'
import { methodNotAllowed } from '@/common/http-error-handler'

const router = express.Router()

router.put('/', asyncHandler(sessionController.put))

router.all('/', methodNotAllowed)

export default router

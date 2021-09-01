import express from 'express'
import asyncHandler from 'express-async-handler'

import testController from '@/modules/test/controller'
import { methodNotAllowed } from '@/common/http-error-handler'

const router = express.Router()

router.put('/seed', asyncHandler(testController.put))

router.all('/', methodNotAllowed)

export default router

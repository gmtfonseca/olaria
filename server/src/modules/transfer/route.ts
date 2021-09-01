import express from 'express'
import asyncHandler from 'express-async-handler'

import transferController from '@/modules/transfer/controller'
import { methodNotAllowed } from '@/common/http-error-handler'

const router = express.Router()

router.post('/', asyncHandler(transferController.create))

router.all('/', methodNotAllowed)

export default router

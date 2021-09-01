import express from 'express'
import asyncHandler from 'express-async-handler'

import fishController from '@/modules/fish/controller'
import { methodNotAllowed } from '@/common/http-error-handler'

const router = express.Router()

router.get('/', asyncHandler(fishController.list))
router.get('/:fishId', asyncHandler(fishController.detail))
router.post('/', asyncHandler(fishController.create))
router.patch('/:fishId', asyncHandler(fishController.update))
router.delete('/:fishId', asyncHandler(fishController.delete))

router.all('/', methodNotAllowed)
router.all('/:fishId', methodNotAllowed)

export default router

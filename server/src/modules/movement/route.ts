import express from 'express'
import asyncHandler from 'express-async-handler'

import movementController from '@/modules/movement/controller'
import { methodNotAllowed } from '@/common/http-error-handler'

const router = express.Router()

router.get('/:movementId', asyncHandler(movementController.detail))
router.get('/', asyncHandler(movementController.list))
router.post('/', asyncHandler(movementController.create))
router.patch('/:movementId', asyncHandler(movementController.update))
router.delete('/:movementId', asyncHandler(movementController.delete))

router.all('/', methodNotAllowed)
router.all('/:movementId', methodNotAllowed)

export default router

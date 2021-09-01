import express from 'express'
import asyncHandler from 'express-async-handler'

import pondController from '@/modules/pond/controller'
import { methodNotAllowed } from '@/common/http-error-handler'

const router = express.Router()

router.get('/', asyncHandler(pondController.list))
router.get('/:pondId', asyncHandler(pondController.detail))
router.post('/', asyncHandler(pondController.create))
router.patch('/:pondId', asyncHandler(pondController.update))
router.delete('/:pondId', asyncHandler(pondController.delete))

router.all('/', methodNotAllowed)
router.all('/:pondId', methodNotAllowed)

export default router

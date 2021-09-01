import express from 'express'
import asyncHandler from 'express-async-handler'

import inventoryController from '@/modules/inventory/controller'
import { methodNotAllowed } from '@/common/http-error-handler'

const router = express.Router()

router.get('/', asyncHandler(inventoryController.list))
router.get('/summary/ponds', asyncHandler(inventoryController.listPondsSummary))
router.get('/summary/ponds/:pondId', asyncHandler(inventoryController.detailPondSummary))
router.get('/summary/fishes', asyncHandler(inventoryController.listFishesSummary))
router.get('/summary/fishes/:fishId', asyncHandler(inventoryController.detailFishSummary))
router.put('/drain/:pondId', asyncHandler(inventoryController.drainPond))
router.get('/:inventoryId', asyncHandler(inventoryController.detail))

router.all('/', methodNotAllowed)
router.all('/:inventoryId', methodNotAllowed)

export default router

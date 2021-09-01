import { MovementPopulated } from '@/modules/movement/types'
import { Movement } from '@prisma/client'

export function unpopulate(movementPopulated: MovementPopulated): Movement {
  const { fish, pond, ...data } = movementPopulated

  return {
    ...data,
    fishId: fish.id,
    pondId: pond.id,
  }
}

export function isPopulated(
  movement: Omit<Movement, 'id'> | Omit<MovementPopulated, 'id'>,
): movement is MovementPopulated {
  return (movement as MovementPopulated).fish !== undefined
}

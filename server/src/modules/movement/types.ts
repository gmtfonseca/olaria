import { Fish, Pond, Movement } from '@prisma/client'

export interface MovementPopulated extends Movement {
  fish: Fish
  pond: Pond
}

export function isPopulated(
  movement: Omit<Movement, 'id'> | Omit<MovementPopulated, 'id'>,
): movement is MovementPopulated {
  return (movement as MovementPopulated).fish !== undefined
}

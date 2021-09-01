import {
  Movement,
  MovementPopulatedJSON,
  MovementJSON,
  MovementPopulated,
} from '@/data/movement/types'

export default {
  fromJSON(json: MovementJSON): Movement {
    return {
      ...json,
      datetime: new Date(json.datetime),
    }
  },
  fromPopulatedJSON(json: MovementPopulatedJSON): MovementPopulated {
    return {
      ...json,
      datetime: new Date(json.datetime),
    }
  },
}

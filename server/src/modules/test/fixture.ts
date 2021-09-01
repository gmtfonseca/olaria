const user = {
  name: 'john',
  password: 'doe123',
}

const ponds = [
  { name: '01 (800)' },
  { name: '02 (1000)' },
  { name: '03 (1120)' },
  { name: '05 (800)' },
  { name: '06 (650)' },
]

const fishes = [
  { name: 'CASCUDO P' },
  { name: 'CAUDA ESCURO' },
  { name: 'CAUDA MATRIZ' },
  { name: 'CAUDA P' },
  { name: 'CAUDA PP' },
]

const movements = [
  {
    datetime: new Date('2021-08-13 11:12:10'),
    action: 'IN',
    quantity: 100,
    notes: 'Aproximado',
    pondId: '01 (800)',
    fishId: 'CASCUDO P',
  },
  {
    datetime: new Date('2021-08-24 11:12:10'),
    action: 'OUT',
    quantity: 50,
    notes: '',
    pondId: '01 (800)',
    fishId: 'CASCUDO P',
  },
  {
    datetime: new Date('2021-09-13 11:12:10'),
    action: 'IN',
    quantity: 200,
    notes: '',
    pondId: '02 (1000)',
    fishId: 'CAUDA P',
  },
  {
    datetime: new Date('2021-09-20 11:12:10'),
    action: 'IN',
    quantity: 150,
    notes: 'Aproximado',
    pondId: '06 (650)',
    fishId: 'CAUDA PP',
  },
]

export default {
  user,
  ponds,
  fishes,
  movements,
}

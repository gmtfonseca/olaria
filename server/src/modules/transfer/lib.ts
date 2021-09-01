import { Transfer, TransferPopulated } from '@/modules/transfer/types'

export function unpopulate(transferPopulated: TransferPopulated): Transfer {
  const { fish, pondOrigin, pondDest, ...data } = transferPopulated

  return {
    ...data,
    fishId: fish.id,
    pondOriginId: pondOrigin.id,
    pondDestId: pondDest.id,
  }
}

export function isPopulated(transfer: Transfer | TransferPopulated): transfer is TransferPopulated {
  return (transfer as TransferPopulated).fish !== undefined
}

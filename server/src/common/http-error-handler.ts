import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

export function methodNotAllowed(req: Request, res: Response, next: NextFunction): void {
  const responseError = {
    status: StatusCodes.METHOD_NOT_ALLOWED,
    title: `O método ${req.method} não é permitido para a rota ${req.originalUrl}.`,
  }
  next(responseError)
}

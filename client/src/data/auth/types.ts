export interface User {
  id: number
  name: string
}

export interface UserLogData {
  createdBy?: User
  modifiedBy?: User
}

export interface AuthTokenDecoded {
  id: number
  name: string
  iat?: number
  expiresIn?: string
}

export interface AuthSession {
  user: User
  iat?: number
  expiresIn?: string
}

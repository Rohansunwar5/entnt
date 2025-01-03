declare namespace Express {
  export interface Request {
    user: {
      _id: string,
      role: string,
    },
    access_token: string | null,
  }
}

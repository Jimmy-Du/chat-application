import { Response, Request, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const extractJWT = (req: Request, res: Response, next: NextFunction) => {
  // retrieve the token that appears after "Bearer " in the authorization header
  let token = req.headers.authorization?.split(' ')[1]

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY!, (error, decoded) => {
      if (error) {
        return res.status(404).send({error: "Unauthorized"})
      }

      res.locals.jwt = decoded
      next()
    })
  }
  else {
    return res.status(401).send({error: "Unauthorized"})
  }
}

export default extractJWT
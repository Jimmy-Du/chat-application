import express, { Application, Request, Response, NextFunction } from 'express'
const router: Application = express()
import bcrypt from 'bcryptjs'
import User from '../models/user'
import jwt from 'jsonwebtoken'
import extractJWT from '../middleware/extractJWT'
import validateUser from '../validation/userValidation'



// Route:       Post /users/register
// Description: Creates a new user
// Access:      Public
router.post('/users/register', async (req: Request, res: Response, next: NextFunction) => {
  const newUser = new User({email: req.body.email, password: req.body.password, username: req.body.username})

  try {
    let existingUser = await User.findOne({email: req.body.email})

    // if the email is already in use, an error is thrown
    if (existingUser) {
      return res.status(400).send({email: 'Email already in use.'})
    }

    const userErrors = validateUser(req.body.email, req.body.username, req.body.password)

    // if the userErrors object is not empty, the userErrors object is sent back with the errors
    if (Object.keys(userErrors).length !== 0) {
      return res.status(400).send(userErrors)
    }

    let newUsername = ""
  
    // loop that adds 4 or 5 digits to the end of the username to make it unique for easier searching for users
    do {
      newUsername = ""
      newUsername = newUser.username + "#" + Math.floor(Math.random() * (99999 - 1000 + 1) + 1000)
      existingUser = await User.find({username: newUsername})
    } while (existingUser.length !== 0)

    newUser.username = newUsername

    await newUser.save()
    res.status(201).send({message: 'Registered'})
  }
  catch (e: unknown) {
    let errorMessage: String = ""
    
    if (e instanceof Error) {
      errorMessage = e.message
    }
    
    res.status(400).send({error: errorMessage})
  }
})



// Route:       Post /users/login
// Description: Login a user
// Access:      Public
router.post('/users/login', async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email
  const password = req.body.password

  try {
    const user = await User.findOne({email})

    // if there is no user with the specified email, an error is sent back
    if (!user) {
      return res.status(400).send({error: 'Incorrect email or password'})
    }

    const isMatch = await bcrypt.compare(password, user.password)

    // if the email and password matches an existing user, a login token is sent back
    if (isMatch) {
      let token = await jwt.sign({id: user._id, username: user.username}, process.env.SECRET_KEY!, {expiresIn: 3600})
      res.send({token: 'Bearer ' + token})
    }
    // else, an error response is sent back to the user
    else {
      res.status(400).send({error: 'Incorrect email or password'})
    }
  }
  catch (e) {
    let errorMessage: String = ""
    
    if (e instanceof Error) {
      errorMessage = e.message
    }
    
    res.status(400).send({error: errorMessage})
  }
})



// Route:       Post /users/search
// Description: Search for users containing the string specified
// Access:      Public
router.post('/users/search', extractJWT, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // finds users that have a username that contain the search term sent to the route 
    // and aren't the user that made the request
    const searchedUsers = await User.find({
      username: {
        $regex: `${req.body.search}`, 
        $options: 'i'
      }, 
      _id: {
        $ne: res.locals.jwt.id
      }})

    res.send(searchedUsers)
  }
  catch (e) {
    let errorMessage: String = ""
    
    if (e instanceof Error) {
      errorMessage = e.message
    }
    
    res.status(400).send({error: errorMessage})
  }
})



export default router
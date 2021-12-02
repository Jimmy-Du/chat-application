import express, { Application, Request, Response, NextFunction } from 'express'
const router: Application = express()
import extractJWT from '../middleware/extractJWT'
import Conversation from '../models/conversation'



// Route:       Post /conversations/create
// Description: Creates a new conversation
// Access:      Private
router.post('/conversations', extractJWT, async (req: Request, res: Response, next: NextFunction) => {
  const newConversation = new Conversation({members: [res.locals.jwt.id, req.body.recipientId]})

  try {
    await newConversation.save()

    res.status(201).send({message: "Conversation Created"})
  }
  catch (e) {
    let errorMessage: String = ""
    
    if (e instanceof Error) {
      errorMessage = e.message
    }
    
    res.status(400).send({error: errorMessage})
  }
})



// Route:       GET /conversations
// Description: Gets all conversations of a user
// Access:      Private
router.get('/conversations', extractJWT, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conversations = await Conversation.find({members: {$in: [res.locals.jwt.id]}})
                                            .populate('members', '-password')
                                            .exec()

    res.send(conversations)
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
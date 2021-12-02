import express, { Application, Request, Response, NextFunction } from 'express'
const router: Application = express()
import extractJWT from '../middleware/extractJWT'
import Message from '../models/message'
import Conversation from '../models/conversation'



// Route:       Post /messages/send
// Description: Sends a message to another user
// Access:      Private
router.post('/messages', extractJWT, async (req: Request, res: Response, next: NextFunction) => {
  const newMessage = new Message({
    sender: res.locals.jwt.id, 
    conversationId: req.body.conversationId, 
    content: req.body.content
  })

  try {
    await newMessage.save()

    res.status(201).send(await newMessage.populate('sender', '-password'))
  }
  catch (e) {
    let errorMessage: String = ""
    
    if (e instanceof Error) {
      errorMessage = e.message
    }
    
    res.status(400).send({error: errorMessage})
  }
})



// Route:       Get /messages
// Description: Gets messages from conversation
// Access:      Private
router.get('/messages/:id', extractJWT, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conversation = await Conversation.find({
      _id: req.params.id,
      members: {$in: [res.locals.jwt.id]}
    })

    // if no conversations were found, a 404 error is sent back
    if (conversation.length === 0) {
      res.status(404).send({error: "Conversation not found"})
    }
    // else, the the messages are retrieved and sent back
    else {
      const messages = await Message.find({conversationId: req.params.id}).populate('sender', '-password').exec()
  
      res.send(messages)
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



export default router
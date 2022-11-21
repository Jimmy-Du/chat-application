import express from 'express'
import cors from 'cors'
import userRoute from './routers/user'
import messageRoute from './routers/message'
import conversationRoute from './routers/conversation'
require('./db/mongoose')

const app: express.Application = express()

// Setup express options
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(cors())

// Setup routes
app.use(userRoute)
app.use(messageRoute)
app.use(conversationRoute)

app.listen(process.env.PORT || 5000)

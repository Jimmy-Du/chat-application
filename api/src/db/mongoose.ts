import mongoose, { ConnectOptions } from 'mongoose'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGO_URI!, {
  useNewUrlParser: true,
  useUnifiedTopology: true
} as ConnectOptions)

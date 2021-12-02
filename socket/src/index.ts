import { Server } from "socket.io"

interface IUser {
  userId: string,
  socketId: string
}

let users = [] as Array<IUser>

const io = new Server(Number(process.env.PORT), {
  cors: {
    origin: process.env.ORIGIN_URL
  }
})



// Function:    addUser()
// Description: adds the user id and their socket id to the list of users
// Parameters:  userId: the id of the user being added
//              socketId: the id of the socket the user is using
// Return:      N/A
const addUser = (userId: string, socketId: string): void => {
  // if the user being added is not currently in the list of users,
  // they are added to the list with their socket id
  if (!users.find(user => user.userId === userId)) {
    users.push({ userId, socketId})
  }
}



// Function:    removeUser()
// Description: adds the user id and their socket id to the list of users
// Parameters:  userId: the id of the user being added
//              socketId: the id of the socket the user is using
// Return:      N/A
const removeUser = (socketId: string): void => {
  users = users.filter(user => user.socketId !== socketId)
}



// Function:    getUser()
// Description: finds the specified user with the user id passed in
// Parameters:  userId: the user id of the user to be retrieved
// Return:      the user with the matching id passed in, if the user does not
//              exist, will return undefined instead
const getUser = (userId: string): IUser | void => {
  return users.find(user => user.userId === userId)
}



io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id)
  })

  socket.on('newConversation', (recieverId) => {
    const user = getUser(recieverId)

    // if the user is currently connected to the server, they are
    // sent a notification that a new conversation has been created with them
    if (user) {
      socket.to(user.socketId).emit('newConversation')
    }
  })

  socket.on('sendMessage', ({recieverId, senderUsername, conversationId, message}) => {
    const user = getUser(recieverId)

    // if the user is currently connected to the server, they are sent the message
    if (user) {
      socket.to(user.socketId).emit('newMessage', {senderUsername, conversationId, message})
    }
  })

  socket.on('disconnect', () => {
    removeUser(socket.id)
  })
})

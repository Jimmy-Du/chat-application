export interface IMember {
  _id: string,
  email: string,
  username: string
}

export interface IConversation {
  _id: string,
  members: Array<IMember>
}

export interface IUser {
  _id: string,
  email: string,
  username: string,
  password: string
}

export interface IMessage {
  _id: string,
  sender: IMember,
  content: string,
  conversationId: string,
}

export interface IToken {
  id: string,
  username: string,
  iat: Number,
  exp: Number
}

export interface ISelectedConversation {
  conversationId: string,
  talkingToId: string,
  talkingToUsername: string
}


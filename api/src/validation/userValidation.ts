import validator from 'validator'



interface IUserErrors {
  email?: string,
  username?: string,
  password?: string
}



// Function:    validateUser()
// Description: takes in the fields required to create a user and 
//              verifies that they are valid values
// Parameters:  email: the email of the user to be validated
//              username: the username of the user to be validated
//              password: the password of the user to be validated
// Return:      an object containing the errors of the user fields
const validateUser = (email: string, username: string, password: string): IUserErrors => {
  let error = {} as IUserErrors

  // if the email passed in is not an email, an email error is created
  if (!validator.isEmail(email)) {
    error.email = 'Email is invalid.'
  }

  // if the username passed in is not between 3 - 16 characters, an username error is created
  if (username.length > 16 || username.length < 3) {
    error.username = 'Username must be within 3 - 16 characters.'
  }

  // if the password passed in is not at least 7 characters, an password error is created
  if (password.length < 7) {
    error.password = 'Password must be a minimum of 7 characters.'
  }

  return error
}



export default validateUser
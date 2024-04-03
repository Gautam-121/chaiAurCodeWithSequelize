import { EMAIL_REGEX , PASSWORD_REGEX } from "../constant.js"

export const isValidEmail = email => EMAIL_REGEX.test(email)

export const isValidPassword = password => PASSWORD_REGEX.test(password)

export const isValidUsernameLength = username => (username.length > 4 && username.length < 20)
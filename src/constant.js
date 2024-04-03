export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]]).{8,20}$/

export const cookieOptions = {
    httpOnly: true,
    secure: true
}

export const frontendUrlResetPassword = "http://localhost:5173/resetPassword" 
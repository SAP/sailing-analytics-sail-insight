export const ApiBodyKeys = {
  Username: 'username',
  Email: 'email',
  FullName: 'fullName',
  Company: 'company',
  Nationality: 'nationality',
}

export const mapResToUser = (data: any) => {
  if (!data || typeof data.username !== 'string' || data.username.trim().length === 0) {
    throw new Error('Invalid user response: missing username')
  }
  return {
    username: data.username,
    fullName: data.fullName,
    email: data.email,
    company: data.company,
  } as User
}

export const mapUserToRes = (user: User) => ({
  [ApiBodyKeys.Username]: user.username,
  [ApiBodyKeys.Company]: user.company,
  [ApiBodyKeys.FullName]: user.fullName,
  [ApiBodyKeys.Email]: user.email,
  // ignore imageData here
})


export default interface User {
  username?: string
  company?: string
  fullName?: string
  email?: string
  nationality?: string
}

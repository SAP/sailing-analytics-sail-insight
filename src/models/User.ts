export const ApiBodyKeys = {
  Username: 'username',
  Email: 'email',
  FullName: 'fullName',
  Company: 'company',
  Nationality: 'nationality',
}

export const mapResToUser = (data: any) => data && ({
  username: data.username,
  fullName: data.fullName,
  email: data.email,
  company: data.company,
} as User)

export const mapUserToRes = (user: User) => ({
  [ApiBodyKeys.Username]: user.username,
  [ApiBodyKeys.Company]: user.company,
  [ApiBodyKeys.FullName]: user.fullName,
  [ApiBodyKeys.Email]: user.email,
})


export default interface User {
  username?: string
  company?: string
  fullName?: string
  email?: string
  nationality?: string
}

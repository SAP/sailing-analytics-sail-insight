export const ApiBodyKeys = {
  Name: 'name',
  Nationality: 'nationality',
  Email: 'email',
}

export const mapResToBoat = (map: any) => map && ({
  name: map[ApiBodyKeys.Name],
  nationality: map[ApiBodyKeys.Nationality],
  email: map[ApiBodyKeys.Email],
} as User)


export default interface User {
  name?: string,
  nationality?: string
  email?: string
}


import Session from 'models/Session'


export const generateNewSession = (/*add params*/) => {
  // TODO: implement
  return new Session(
    'myTracking',
    '123',
    'TEST123',
    'Sail Team No.1',
    'public',
  )
}

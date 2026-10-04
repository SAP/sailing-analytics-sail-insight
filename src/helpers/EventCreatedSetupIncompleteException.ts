// Thrown when the server already created the event but a follow-up step failed.
class EventCreatedSetupIncompleteException extends Error {
  public static NAME = 'EventCreatedSetupIncompleteException'

  public baseTypeName: string = EventCreatedSetupIncompleteException.NAME
  public status?: number
  public url?: string
  public method?: string
  public data?: any

  constructor(public cause?: any) {
    super(cause && cause.message ? cause.message : 'event setup incomplete')
    this.name = EventCreatedSetupIncompleteException.NAME
    // keep the technical details of the underlying failure for the error details view
    if (cause) {
      this.status = cause.status
      this.url = cause.url
      this.method = cause.method
      this.data = cause.data
    }
  }
}

export default EventCreatedSetupIncompleteException

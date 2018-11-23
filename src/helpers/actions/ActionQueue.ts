import { head, isEmpty } from 'lodash'


interface ActionQueueItem {
  action: any
  isUsingPreviousResult: boolean
  ignoreException: boolean
}

const isQueueItem = (p: any): p is ActionQueueItem =>
  p.hasOwnProperty('isUsingPreviousResult') && p.hasOwnProperty('action') && p.hasOwnProperty('ignoreException')

export default class ActionQueue {

  public static create(dispatch: (action: any) => void, actions: any[]) {
    const newQueue = new ActionQueue(dispatch)
    actions.forEach(action => newQueue.add(action))
    return newQueue
  }

  public static createItem = (action: any, options?: {isUsingPreviousResult?: boolean, ignoreException?: boolean}) => ({
    action,
    isUsingPreviousResult: options ? options.isUsingPreviousResult : false,
    ignoreException: options ? options.ignoreException : false,
  } as ActionQueueItem)

  public static createItemUsingPreviousResult = (action: any) => ActionQueue.createItem(
    action,
    { isUsingPreviousResult: true },
  )

  protected queue: ActionQueueItem[] = []

  constructor(protected dispatch: (action: any) => void) {
    this.dispatch = dispatch
  }

  public add(action: any | ActionQueueItem) {
    this.queue.push(isQueueItem(action) ? action : { action, isUsingPreviousResult: false, ignoreException: false })
  }

  public async execute() {
    let nextItem: ActionQueueItem | undefined = head(this.queue)
    let nextAction = nextItem && nextItem.action
    while (nextAction) {
      let result
      if (nextItem && nextItem.ignoreException) {
        try { result = await this.dispatch(nextAction) } catch (err) {}
      } else {
        result = await this.dispatch(nextAction)
      }
      this.queue.shift()
      nextItem = this.prepareNextItem(head(this.queue), result)
      nextAction = nextItem && nextItem.action
    }
  }

  public isEmpty() {
    return isEmpty(this.queue)
  }

  protected prepareNextItem = (nextItem?: ActionQueueItem, result?: any) => {
    if (!nextItem) {
      return nextItem
    }
    if (nextItem.isUsingPreviousResult) {
      nextItem.action = nextItem && nextItem.action(result)
      nextItem.isUsingPreviousResult = false
    }
    return nextItem
  }
}

import { head, isEmpty } from 'lodash'


interface ActionQueueItem {
  action: any
  isUsingPreviousResult: boolean
}

const isQueueItem = (p: any): p is ActionQueueItem =>
  p.hasOwnProperty('isUsingPreviousResult') && p.hasOwnProperty('action')

export default class ActionQueue {

  public static create(dispatch: (action: any) => void, actions: any[]) {
    const newQueue = new ActionQueue(dispatch)
    actions.forEach(action => newQueue.add(action))
    return newQueue
  }

  public static createItem(action: any, isUsingPreviousResult?: boolean) {
    return {
      action,
      isUsingPreviousResult,
    } as ActionQueueItem
  }

  public static createItemUsingPreviousResult = (action: any) => ActionQueue.createItem(action, true)

  protected queue: ActionQueueItem[] = []

  constructor(protected dispatch: (action: any) => void) {
    this.dispatch = dispatch
  }

  public add(action: any | ActionQueueItem) {
    this.queue.push(isQueueItem(action) ? action : { action, isUsingPreviousResult: false })
  }

  public async execute() {
    const firstItem = head(this.queue)
    let nextAction = firstItem && firstItem.action
    while (nextAction) {
      const result = await this.dispatch(nextAction)
      this.queue.shift()
      const nextItem = this.prepareNextItem(head(this.queue), result)
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

import { EventFilter } from 'models/EventFilter'
import { areArchivedSessionsShown, getFilteredSessionList, hasArchivedSessions } from '../session'

const sessions: any[] = [
  { eventId: 'a', isArchived: false },
  { eventId: 'b', isArchived: true },
]

const filter = (filters: EventFilter[]) =>
  (getFilteredSessionList(false) as any).resultFunc(sessions, filters).map((s: any) => s.eventId)

describe('archived sessions', () => {
  test('are hidden by default and shown with the Archived filter', () => {
    expect(filter([EventFilter.All])).toEqual(['a'])
    expect(filter([EventFilter.All, EventFilter.Archived])).toEqual(['a', 'b'])
  })

  test('hasArchivedSessions only when an archived session exists', () => {
    expect((hasArchivedSessions as any).resultFunc(sessions)).toBe(true)
    expect((hasArchivedSessions as any).resultFunc([sessions[0]])).toBe(false)
  })

  test('areArchivedSessionsShown follows the active filters', () => {
    expect((areArchivedSessionsShown as any).resultFunc([EventFilter.All])).toBe(false)
    expect((areArchivedSessionsShown as any).resultFunc([EventFilter.All, EventFilter.Archived])).toBe(true)
  })
})

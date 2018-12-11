import * as CheckInService from '../CheckInService'

declare var test: any
declare var expect: any

// tslint:disable-next-line
const testUrl = 'https://d-labs.sapsailing.com/tracking/checkin?event_id=750d5773-77f9-4e8d-a704-9231b3ed435f&leaderboard_name=Regatta+Dorian&competitor_id=cf86ae7a-bb32-481e-94bc-246d3699a11b'
const publicInviteLink = 'https://sailinsight20-app.sapsailing.com/publicInvite?regatta_name=dk-session-regatta-18-12-06--1&secret=5OY3T2677YIV6HIF1NY8'

const branchTestUrl = ''

test('extractCheckInData', () => {
  const checkInData: any = CheckInService.extractData(testUrl)

  const {
    serverUrl,
    eventId,
    isTraining,
    leaderboardName,
    boatId,
    competitorId,
    markId,
  } = checkInData

  expect(boatId || competitorId || markId).toBeDefined()
  expect(competitorId).toBe('cf86ae7a-bb32-481e-94bc-246d3699a11b')
  expect(eventId).toBe('750d5773-77f9-4e8d-a704-9231b3ed435f')
  expect(serverUrl).toBe('https://d-labs.sapsailing.com')
  expect(isTraining).toBe(false)
  expect(leaderboardName).toBe('Regatta Dorian')
})

test('extractCheckInDataFromBranchIOLink', () => {
})

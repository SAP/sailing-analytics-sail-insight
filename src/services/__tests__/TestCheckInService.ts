import * as CheckInService from '../CheckInService'

declare var test: any
declare var expect: any

// tslint:disable-next-line
const testUrl = 'https://d-labs.sapsailing.com/tracking/checkin?event_id=750d5773-77f9-4e8d-a704-9231b3ed435f&leaderboard_name=Regatta+Dorian&competitor_id=cf86ae7a-bb32-481e-94bc-246d3699a11b'
const publicInviteLink = 'https://sailinsight30-app.sapsailing.com/publicInvite?regatta_name=dk-session-regatta-18-12-06--1&secret=5OY3T2677YIV6HIF1NY8'

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

test('extractCheckInDataFromBranchIOLink', () => {
  const branchUrl =
    `https://sailinsight30-app.sapsailing.com/invite?checkinUrl=${encodeURIComponent(testUrl)}`
  const checkInData: any = CheckInService.extractData(branchUrl)

  expect(checkInData).not.toBeNull()
  expect(checkInData.serverUrl).toBe('https://d-labs.sapsailing.com')
  expect(checkInData.leaderboardName).toBe('Regatta Dorian')
})

test('extractCheckInDataFromPublicInviteLink', () => {
  const withServer = `${publicInviteLink}&server=${encodeURIComponent('https://d-labs.sapsailing.com')}`
  const checkInData: any = CheckInService.extractData(withServer)

  expect(checkInData).not.toBeNull()
  expect(checkInData.serverUrl).toBe('https://d-labs.sapsailing.com')
  expect(checkInData.regattaName).toBe('dk-session-regatta-18-12-06--1')
  expect(checkInData.secret).toBe('5OY3T2677YIV6HIF1NY8')

  // on the branch domain without an explicit server there is no target host
  expect(CheckInService.extractData(publicInviteLink)).toBeNull()
})

test('extractCheckInDataRejectsNonInvitationContent', () => {
  // arbitrary QR code contents must not turn into check-ins
  expect(CheckInService.extractData('hello world')).toBeNull()
  expect(CheckInService.extractData('WIFI:S:MyNetwork;T:WPA;P:secret;;')).toBeNull()
  expect(CheckInService.extractData('https://example.com/some/page?utm_source=qr')).toBeNull()
  expect(CheckInService.extractData('https://example.com')).toBeNull()
  // invitation params without a real server must not pass either
  expect(CheckInService.extractData('/tracking/checkin?leaderboard_name=Foo')).toBeNull()
})

import CheckInService from '../CheckInService'


const testUrl = 'https://d-labs.sapsailing.com/tracking/checkin?event_id=750d5773-77f9-4e8d-a704-9231b3ed435f&leaderboard_name=Regatta+Dorian&competitor_id=cf86ae7a-bb32-481e-94bc-246d3699a11b'


test('extractCheckInData', () => {
  const checkInData = CheckInService.extractData(testUrl)

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

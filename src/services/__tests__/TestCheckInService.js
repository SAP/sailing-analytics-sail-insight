
import CheckInService from '../CheckInService'


const testUrl = 'https://d-labs.sapsailing.com/tracking/checkin?event_id=750d5773-77f9-4e8d-…ard_name=Regatta+Dorian&competitor_id=cf86ae7a-bb32-481e-94bc-246d3699a11b'


test('extractCheckInData', () => {
  CheckInService.extractData(testUrl)
})

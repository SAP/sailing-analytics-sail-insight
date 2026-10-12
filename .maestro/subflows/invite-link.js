// Builds the invitation link of the run account's event EVENT_NAME, i.e. what
// the organizer's QR code encodes, with the app's URL scheme so the dev app
// opens it directly. Result: output.inviteLink.
var base = E2E_BACKEND_URL
var login = http.post(base + '/security/api/restsecurity/access_token', {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'username=' + encodeURIComponent(E2E_USERNAME) + '&password=' + encodeURIComponent(E2E_PASSWORD),
})
var token = json(login.body).access_token
var events = json(http.get(base + '/sailingserver/api/v1/trackedevents?includeArchived=true', {
  headers: { Authorization: 'Bearer ' + token },
}).body).trackedEvents
var event = events.filter(function (e) { return e.leaderboardName === EVENT_NAME })[0]
if (!event) throw new Error('Event not found: ' + EVENT_NAME)
var checkinUrl = base + '/tracking/checkin?event_id=' + encodeURIComponent(event.eventId) +
  '&leaderboard_name=' + encodeURIComponent(event.leaderboardName) +
  '&secret=' + encodeURIComponent(event.regattaSecret)
output.inviteLink = 'orgsailyachtresearchsailinsight://open?checkinUrl=' + encodeURIComponent(checkinUrl)

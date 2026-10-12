// Reads the discard rule of leaderboard EVENT_NAME from the server, e.g. "2"
// (discard the worst race once 2 races are sailed) or "" (no discards).
var base = E2E_BACKEND_URL
var token = json(http.post(base + '/security/api/restsecurity/access_token', {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'username=' + encodeURIComponent(E2E_USERNAME) + '&password=' + encodeURIComponent(E2E_PASSWORD),
}).body).access_token
var board = json(http.get(base + '/sailingserver/api/v2/leaderboards/' + encodeURIComponent(EVENT_NAME), {
  headers: { Authorization: 'Bearer ' + token },
}).body)
output.discards = (board.discardIndexResultsStartingWithHowManyRaces || []).join(',')

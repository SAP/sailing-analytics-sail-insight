#!/usr/bin/env node
// Provisions the disposable E2E backend so that freshly registered users may
// create events, like on the production servers. A fresh sailing-analytics
// container only grants `sailing_viewer` to everybody; organizer flows
// (Create Event → Define Races → Define Course) need SERVER:CREATE_OBJECT.
//
// Grants it through a role associated "for all users" with the server's
// user group, using the container's built-in admin account (fresh database).
// Idempotent and self-verifying: exits non-zero unless the grant is in place.
//
// REST contract: SAP/sailing-analytics java/com.sap.sse.security/.../jaxrs/api
// (RoleResource, UserGroupResource). Note `forAll` must be the STRING "true".

const ROLE_NAME = 'e2e_event_creator'
const PERMISSION = 'SERVER:CREATE_OBJECT'

async function provision({ baseUrl, serverName, adminUser, adminPassword, fetch = globalThis.fetch, log = () => {} }) {
  const api = `${baseUrl.replace(/\/$/, '')}/security/api/restsecurity`
  const call = async (method, path, { token, form, json } = {}) => {
    const headers = {}
    let body
    if (token) headers.Authorization = `Bearer ${token}`
    if (form) { headers['Content-Type'] = 'application/x-www-form-urlencoded'; body = new URLSearchParams(form).toString() }
    if (json) { headers['Content-Type'] = 'application/json'; body = JSON.stringify(json) }
    const response = await fetch(`${api}/${path}`, { method, headers, body })
    const text = await response.text()
    if (!response.ok) throw new Error(`${method} ${path} failed: HTTP ${response.status} ${text.slice(0, 300)}`)
    return text ? JSON.parse(text) : undefined
  }

  const { access_token: token } = await call('POST', 'access_token', { form: { username: adminUser, password: adminPassword } })
  if (!token) throw new Error('No admin access token returned')

  const groupName = `${serverName}-server`
  const findGrant = async () => {
    const group = await call('GET', `usergroup?groupName=${encodeURIComponent(groupName)}`, { token })
    const role = (group.roles || []).find((r) => r.roleName === ROLE_NAME && String(r.forAll) === 'true')
    return { group, role }
  }

  let { group, role } = await findGrant()
  if (!role) {
    log(`Granting ${PERMISSION} to all users via role ${ROLE_NAME} on group ${groupName}`)
    const created = await call('POST', 'role', { token, form: { roleName: ROLE_NAME } })
    await call('PUT', `role/${created.roleId}`, { token, json: { roleName: ROLE_NAME, permissions: [PERMISSION] } })
    await call('PUT', `usergroup/${group.groupId}/role/${created.roleId}`, { token, json: { forAll: 'true' } })
    ;({ role } = await findGrant())
    if (!role) throw new Error(`Role ${ROLE_NAME} is not associated for all users with ${groupName}`)
  }
  const definition = await call('GET', `role/${role.roleId}`, { token })
  if (!(definition.permissions || []).includes(PERMISSION)) {
    throw new Error(`Role ${ROLE_NAME} lacks ${PERMISSION}: ${JSON.stringify(definition.permissions)}`)
  }
  log(`Backend provisioned: all users have ${PERMISSION} (role ${ROLE_NAME})`)
  return { groupId: group.groupId, roleId: role.roleId }
}

module.exports = { provision, ROLE_NAME, PERMISSION }

if (require.main === module) {
  provision({
    baseUrl: process.env.E2E_BACKEND_URL || 'http://127.0.0.1:8888',
    serverName: process.env.E2E_BACKEND_SERVER_NAME || 'sail-insight-e2e',
    // Built-in account of a freshly initialized, disposable E2E database.
    adminUser: process.env.E2E_BACKEND_ADMIN_USER || 'admin',
    adminPassword: process.env.E2E_BACKEND_ADMIN_PASSWORD || 'admin',
    log: (message) => console.log(`[e2e] ${message}`),
  }).catch((error) => {
    console.error(`[e2e] ERROR: backend provisioning failed: ${error.message}`)
    process.exit(1)
  })
}

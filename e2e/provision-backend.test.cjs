// Backend provisioning against an in-memory fake of the security REST API.
const assert = require('node:assert/strict')
const { test } = require('node:test')
const { provision, ROLE_NAME, PERMISSION } = require('./provision-backend.cjs')

function fakeServer({ forAllAsBoolean = false } = {}) {
  const state = { roles: {}, group: { groupId: 'g1', groupName: 'srv-server', roles: [] }, calls: [] }
  const reply = (status, body) => ({ ok: status < 300, status, text: async () => (body === undefined ? '' : JSON.stringify(body)) })
  const fetch = async (url, { method, headers, body }) => {
    const path = url.replace(/^.*\/restsecurity\//, '')
    state.calls.push(`${method} ${path}`)
    if (path !== 'access_token' && headers.Authorization !== 'Bearer t0k') return reply(401)
    if (method === 'POST' && path === 'access_token') {
      const form = new URLSearchParams(body)
      return form.get('username') === 'admin' && form.get('password') === 'admin' ? reply(200, { access_token: 't0k' }) : reply(401)
    }
    if (method === 'GET' && path.startsWith('usergroup?groupName=')) return reply(200, state.group)
    if (method === 'POST' && path === 'role') {
      const roleId = `r${Object.keys(state.roles).length + 1}`
      state.roles[roleId] = { roleId, roleName: new URLSearchParams(body).get('roleName'), permissions: [] }
      return reply(201, state.roles[roleId])
    }
    let m
    if ((m = path.match(/^role\/(\w+)$/))) {
      if (method === 'GET') return reply(200, state.roles[m[1]])
      if (method === 'PUT') { Object.assign(state.roles[m[1]], JSON.parse(body)); return reply(200) }
    }
    if (method === 'PUT' && (m = path.match(/^usergroup\/g1\/role\/(\w+)$/))) {
      // Mirrors the server: (String) json.get("forAll") — a JSON boolean is a 500.
      const { forAll } = JSON.parse(body)
      if (typeof forAll !== 'string') return reply(500, 'ClassCastException')
      state.group.roles.push({ roleId: m[1], roleName: state.roles[m[1]].roleName, forAll: forAll === 'true' })
      return reply(200)
    }
    return reply(404)
  }
  return { state, fetch }
}

const options = (fetch) => ({ baseUrl: 'http://127.0.0.1:8888', serverName: 'srv', adminUser: 'admin', adminPassword: 'admin', fetch })

test('fresh server: creates the role, grants it to all users and verifies it', async () => {
  const server = fakeServer()
  await provision(options(server.fetch))
  assert.deepEqual(server.state.group.roles.map((r) => [r.roleName, r.forAll]), [[ROLE_NAME, true]])
  assert.deepEqual(server.state.roles.r1.permissions, [PERMISSION])
})

test('already provisioned server: no new role is created', async () => {
  const server = fakeServer()
  await provision(options(server.fetch))
  server.state.calls.length = 0
  await provision(options(server.fetch))
  assert.ok(!server.state.calls.includes('POST role'), server.state.calls.join('\n'))
})

test('fails loudly when the grant cannot be verified', async () => {
  const server = fakeServer()
  await provision(options(server.fetch))
  server.state.roles.r1.permissions = []
  await assert.rejects(provision(options(server.fetch)), /lacks SERVER:CREATE_OBJECT/)
})

test('fails loudly on wrong admin credentials', async () => {
  const server = fakeServer()
  await assert.rejects(provision({ ...options(server.fetch), adminPassword: 'nope' }), /access_token failed: HTTP 401/)
})

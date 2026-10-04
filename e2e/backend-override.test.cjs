// Run without an emulator, backend, Metro server, or build:
// node --test e2e/backend-override.test.cjs
const assert = require('node:assert/strict')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const babel = require('@babel/core')

const root = path.resolve(__dirname, '..')
const filename = path.join(root, 'src/api/config.ts')
const defaultUrl = 'https://default.example.test'
const savedUrl = 'https://saved.example.test'

// Exercise the real project Babel config as well as the real exported resolver.
// The VM intentionally has no `process`, as a mobile bundle must not need it.
function loadResolver(backendUrl, { dev = true, setting = savedUrl } = {}) {
  const previous = process.env.E2E_BACKEND_URL
  let code
  try {
    if (backendUrl === undefined) delete process.env.E2E_BACKEND_URL
    else process.env.E2E_BACKEND_URL = backendUrl
    ;({ code } = babel.transformFileSync(filename, {
      cwd: root,
      root,
      envName: dev ? 'development' : 'production',
      caller: { name: 'e2e-backend-override-test', supportsStaticESM: false },
    }))
  } finally {
    if (previous === undefined) delete process.env.E2E_BACKEND_URL
    else process.env.E2E_BACKEND_URL = previous
  }

  assert.ok(!code.includes('process.env.E2E_BACKEND_URL'), 'Babel must inline the override')
  let storeReads = 0
  const state = {}
  const exports = {}
  vm.runInNewContext(code, {
    exports,
    __DEV__: dev,
    require(id) {
      if (id.includes('/environment/init')) return { DEFAULT_SERVER_URL: defaultUrl }
      if (id.includes('/selectors/settings')) return {
        getServerUrlSetting(actualState) {
          assert.equal(actualState, state)
          return setting
        },
      }
      if (id.endsWith('/store')) return {
        getStore() {
          storeReads++
          return { getState: () => state }
        },
      }
      if (id.endsWith('/environment')) return {}
      if (['lodash', 'query-string', 'string-format'].includes(id)) return {}
      if (id.startsWith('@babel/runtime/')) return require(id)
      throw new Error(`Unexpected dependency: ${id}`)
    },
  }, { filename })
  return { getApiServerUrl: exports.getApiServerUrl, storeReads: () => storeReads }
}

for (const backendUrl of [
  'http://127.0.0.1:8888',
  'http://localhost:8888',
  'http://10.0.2.2:8888',
  'http://127.0.0.1',
]) {
  test(`development accepts loopback override ${backendUrl} before saved settings`, () => {
    const resolver = loadResolver(backendUrl)
    assert.equal(resolver.getApiServerUrl(), backendUrl)
    assert.equal(resolver.storeReads(), 0)
  })
}

test('trailing slashes are removed before API suffixes are appended', () => {
  assert.equal(loadResolver('http://127.0.0.1:8888///').getApiServerUrl(), 'http://127.0.0.1:8888')
})

for (const backendUrl of [
  'https://127.0.0.1:8888',
  'http://192.168.1.5:8888',
  'http://example.com:8888',
  'http://localhost.example.com:8888',
  'http://127.0.0.1.evil.test:8888',
  'http://user:password@localhost:8888',
  'http://localhost:8888/api',
  'http://localhost:8888?query=yes',
  'http://localhost:8888#fragment',
  'http://localhost:not-a-port',
  ' http://localhost:8888',
]) {
  test(`development rejects non-loopback/non-root HTTP override ${backendUrl}`, () => {
    assert.throws(() => loadResolver(backendUrl).getApiServerUrl(), /must point to a loopback HTTP server/)
  })
}

for (const backendUrl of [undefined, '']) {
  test(`development falls back to saved URL with ${JSON.stringify(backendUrl)} env`, () => {
    const resolver = loadResolver(backendUrl)
    assert.equal(resolver.getApiServerUrl(), savedUrl)
    assert.equal(resolver.storeReads(), 1)
  })
  test(`development falls back to default URL with ${JSON.stringify(backendUrl)} env and no setting`, () => {
    assert.equal(loadResolver(backendUrl, { setting: '' }).getApiServerUrl(), defaultUrl)
    assert.equal(loadResolver(backendUrl, { setting: null }).getApiServerUrl(), defaultUrl)
  })
}

for (const backendUrl of ['http://127.0.0.1:8888', 'https://untrusted.example.test', undefined]) {
  test(`production ignores override ${JSON.stringify(backendUrl)} without validating or throwing`, () => {
    assert.equal(loadResolver(backendUrl, { dev: false }).getApiServerUrl(), savedUrl)
    assert.equal(loadResolver(backendUrl, { dev: false, setting: null }).getApiServerUrl(), defaultUrl)
  })
}

test('Babel inlining is scoped and Reanimated remains last', () => {
  const config = require('../babel.config.js')
  const plugin = config.plugins.find(entry => Array.isArray(entry) && entry[0] === 'transform-inline-environment-variables')
  assert.deepEqual(plugin[1], { include: ['E2E_BACKEND_URL'] })
  assert.equal(config.plugins.at(-1), 'react-native-reanimated/plugin')
  const { code } = babel.transformSync('module.exports = process.env.UNRELATED_E2E_TEST_VALUE', {
    cwd: root,
    root,
    filename,
  })
  assert.ok(code.includes('process.env.UNRELATED_E2E_TEST_VALUE'))
})

// Regression checks for the native selectors used by the same auth smoke flow.
function loadComponent(relativePath, dependencies) {
  const componentFilename = path.join(root, relativePath)
  const { code } = babel.transformFileSync(componentFilename, {
    cwd: root,
    root,
    caller: { name: 'e2e-selector-test', supportsStaticESM: false },
  })
  const exports = {}
  vm.runInNewContext(code, {
    exports,
    require(id) {
      if (id === 'react' || id.startsWith('react/') || id === 'lodash' || id.startsWith('@babel/runtime/')) return require(id)
      if (id === 'react-native') return {
        TouchableOpacity: 'TouchableOpacity',
        TouchableWithoutFeedback: 'TouchableWithoutFeedback',
        TextInput: 'NativeTextInput',
        View: 'View',
        Image: 'Image',
      }
      const resolved = id.startsWith('.') ? path.resolve(path.dirname(componentFilename), id) : id
      for (const [suffix, value] of Object.entries(dependencies)) {
        if (resolved.endsWith(suffix)) return value
      }
      throw new Error(`Unexpected component dependency: ${id}`)
    },
  }, { filename: componentFilename })
  return exports.default
}

function findElement(element, type) {
  if (!element || typeof element !== 'object') return undefined
  if (element.type === type) return element
  const children = element.props && element.props.children
  for (const child of Array.isArray(children) ? children : [children]) {
    const match = findElement(child, type)
    if (match) return match
  }
}

test('TextButton forwards testID through BaseButton to native TouchableOpacity', () => {
  const BaseButton = loadComponent('src/components/base/BaseButton/index.tsx', {
    '/components/ActivityIndicator': 'ActivityIndicator',
    '/styles': {},
  })
  const TextButton = loadComponent('src/components/TextButton/index.tsx', {
    '/components/base/BaseButton': BaseButton,
    '/components/TextScalable': 'Text',
  })
  const element = new TextButton({ testID: 'e2e-login-submit', children: 'Log in' }).render()
  assert.equal(element.type, 'TouchableOpacity')
  assert.equal(element.props.testID, 'e2e-login-submit')
})

test('redux Field custom props and both input wrappers retain native testID', () => {
  const TextInput = loadComponent('src/components/TextInput/index.tsx', {
    'react-native-masked-text': { TextInputMask: 'MaskedInput' },
    '/assets/Images': {},
    '/components/Text': 'Text',
    '/styles/colors': {},
    '/styles/commons': { form: {} },
    '/helpers/color': { addOpacity: () => 'white' },
  })
  const FormTextInput = loadComponent('src/components/form/FormTextInput/index.tsx', {
    '/components/TextInput': TextInput,
  })
  const createFieldProps = require('redux-form/lib/createFieldProps').default
  const structure = require('redux-form/lib/structure/plain').default
  const { input, meta, custom } = createFieldProps(structure, 'username', {
    testID: 'e2e-register-username', value: '',
  })
  const wrapped = new FormTextInput({ input, meta, ...custom }).render()
  assert.equal(wrapped.props.testID, 'e2e-register-username')
  const native = findElement(new TextInput(wrapped.props).render(), 'NativeTextInput')
  assert.equal(native.props.testID, 'e2e-register-username')
  const loginNative = findElement(new TextInput({ testID: 'e2e-login-username', value: '' }).render(), 'NativeTextInput')
  assert.equal(loginNative.props.testID, 'e2e-login-username')
})

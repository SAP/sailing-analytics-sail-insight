const path = require('path')
const babel = require('@babel/core')

const root = path.resolve(__dirname, '..')
const backendUrl = process.env.E2E_BACKEND_URL
if (!backendUrl) {
  throw new Error('E2E_BACKEND_URL is required')
}

const filename = path.join(root, 'src', 'api', 'config.ts')
const result = babel.transformFileSync(filename, {
  cwd: root,
  root: root,
  envName: 'development',
  ast: false,
  sourceMaps: false,
})

const code = result && result.code ? result.code : ''
if (!code.includes(JSON.stringify(backendUrl))) {
  throw new Error('Babel did not inline E2E_BACKEND_URL into src/api/config.ts. Check babel.config.js / transform-inline-environment-variables.')
}
if (code.includes('process.env.E2E_BACKEND_URL')) {
  throw new Error('Babel left process.env.E2E_BACKEND_URL unresolved in the mobile bundle.')
}
console.log(`[e2e] Verified Babel inlines E2E_BACKEND_URL=${backendUrl}`)

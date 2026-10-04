/**
 * NEW FEATURE "technical error details": `src/components/ErrorDetails`.
 * Contract: default export component with prop `details?: string`.
 *   - renders nothing (toJSON() === null) when details is empty/undefined
 *   - collapsed by default: the details text is not rendered
 *   - a pressable toggle with testID "e2e-error-details-toggle" ("Show details")
 *     reveals the details text; pressing again hides it
 */
import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'

declare var test: any
declare var expect: any

const loadComponent = () => {
  let mod: any
  try {
    mod = require('components/ErrorDetails')
  } catch (e) {
    mod = undefined
  }
  expect(mod && mod.default).toBeDefined()
  return mod.default
}

const DETAILS = 'ApiException: Internal error\nStatus: 500\nPOST https://example.com/api'

const render = (element: any) => {
  let renderer: any
  act(() => { renderer = TestRenderer.create(element) })
  return renderer
}

test('renders nothing without details', () => {
  const ErrorDetails = loadComponent()
  expect(render(<ErrorDetails details="" />).toJSON()).toBeNull()
  expect(render(<ErrorDetails />).toJSON()).toBeNull()
})

test('is collapsed by default and expands/collapses via the toggle', () => {
  const ErrorDetails = loadComponent()
  const renderer = render(<ErrorDetails details={DETAILS} />)
  expect(JSON.stringify(renderer.toJSON())).not.toContain('Status: 500')

  const toggle = renderer.root.findAll((n: any) => n.props.testID === 'e2e-error-details-toggle' && n.props.onPress)[0]
  expect(toggle).toBeDefined()

  act(() => { toggle.props.onPress() })
  expect(JSON.stringify(renderer.toJSON())).toContain('Status: 500')

  act(() => { toggle.props.onPress() })
  expect(JSON.stringify(renderer.toJSON())).not.toContain('Status: 500')
})

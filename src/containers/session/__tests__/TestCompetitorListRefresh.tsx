/**
 * Desired behavior of `competitorListRefreshHandler` (containers/session/common):
 * when fetching the regatta competitors fails, `setCompetitorListStale(false)`
 * is still called (the list leaves the "stale"/loading state) instead of the
 * screen showing an endless loader.
 */
import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'

declare var test: any
declare var expect: any

jest.mock('@react-navigation/native', () => {
  const { useEffect } = require('react')
  return {
    useFocusEffect: (effect: any) => useEffect(() => effect(), [effect]),
    useNavigationState: jest.fn(),
    useNavigation: jest.fn(() => ({})),
    useIsFocused: jest.fn(() => true),
  }
})

// eslint-disable-next-line import/first
import { competitorListRefreshHandler } from '../common'

const flush = async () => { for (let i = 0; i < 10; i++) { await Promise.resolve() } }

// User impact: the organizer's SessionDetail competitor section shows a spinner forever.
test('a failed competitor fetch still clears the stale flag', async () => {
  jest.useFakeTimers()

  const props = {
    session: { leaderboardName: 'lb', regattaName: 'r' },
    fetchRegattaCompetitors: jest.fn(() => Promise.reject(new TypeError('Network request failed'))),
    setCompetitorListStale: jest.fn(),
  }

  let renderer: any
  await act(async () => {
    renderer = TestRenderer.create(competitorListRefreshHandler.fold(props))
    await flush()
  })

  expect(props.fetchRegattaCompetitors).toHaveBeenCalledWith('r', 'lb')
  expect(props.setCompetitorListStale).toHaveBeenCalledWith(false)

  act(() => { renderer.unmount() })
  jest.useRealTimers()
})

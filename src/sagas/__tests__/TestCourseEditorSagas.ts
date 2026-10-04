/**
 * Specification tests for the course editor sagas (src/sagas/CourseSaga.ts).
 *
 * These describe the DESIRED behaviour for verified bugs and are expected to
 * fail until the saga is fixed. The whole saga is driven through its root
 * watcher (`watchCourses`) with real actions, so the tests do not depend on
 * internal function names. Selectors are replaced by thin fakes reading from a
 * plain `fake` state object, and the data API is a jest mock.
 *
 * Contracts assumed by these tests (to be added by the fix):
 *  - i18n key `error_course_saved_following_races_failed` (en.json): shown via
 *    Snackbar after the primary race course was saved but copying it to one or
 *    more following races failed (create failed or their course couldn't be
 *    fetched). It replaces the plain `text_course_saved` message in that case.
 *  - Every other failure below only needs *some* Snackbar.show call (wording is
 *    left to the implementer), plus the stated absence of API calls/crashes.
 */
import { runSaga, stdChannel } from 'redux-saga'
import Snackbar from 'react-native-snackbar'
import I18n from 'i18n'
import watchCourses from '../CourseSaga'
import {
  selectCourse,
  toggleSameStartFinish,
  navigateBackFromCourseCreation,
  updateMarkPosition,
} from 'actions/courses'

declare var describe: any
declare var test: any
declare var expect: any
declare var beforeEach: any
declare var afterEach: any

// ---------------------------------------------------------------------------
// Fakes
// ---------------------------------------------------------------------------

const mockApi: any = {
  requestCourse: jest.fn(),
  createCourse: jest.fn(),
  requestMark: jest.fn(),
  requestTrackingDevices: jest.fn(),
  startDeviceMapping: jest.fn(),
  updateMarkPropertyPositioning: jest.fn(),
  sendMarkGpsFix: jest.fn(),
  requestMarkProperties: jest.fn(),
  createMarkProperties: jest.fn(),
}

jest.mock('api', () => ({ dataApi: () => mockApi }))

jest.mock('selectors/auth', () => ({
  ...jest.requireActual('selectors/auth'),
  isLoggedIn: (s: any) => s.fake.loggedIn,
}))
jest.mock('selectors/settings', () => ({
  ...jest.requireActual('selectors/settings'),
  getServerUrlSetting: () => 'https://server.test',
}))
jest.mock('selectors/network', () => ({
  ...jest.requireActual('selectors/network'),
  isNetworkConnected: (s: any) => s.fake.connected,
}))
jest.mock('selectors/inventory', () => ({
  ...jest.requireActual('selectors/inventory'),
  getMarkPropertiesOrMarkForCourseByName: (name: string) => (s: any) => s.fake.inventoryByName[name],
}))
jest.mock('selectors/course', () => ({
  ...jest.requireActual('selectors/course'),
  getCourseById: (id: string) => (s: any) => s.fake.courses[id],
  getEditedCourse: (s: any) => s.fake.editedCourse,
  hasSameStartFinish: (s: any) => s.fake.sameStartFinish,
  hasEditedCourseChanged: (s: any) => s.fake.courseChanged,
  getSelectedMarkConfiguration: (s: any) => s.fake.selectedMarkConfiguration,
  getMarkConfigurationById: (id: string) => (s: any) => s.fake.markConfigurations[id] || {},
}))
jest.mock('selectors/event', () => ({
  ...jest.requireActual('selectors/event'),
  getSelectedEventInfo: (s: any) => s.fake.raceInfo,
  getSelectedRaceInfo: (s: any) => s.fake.raceInfo,
}))
jest.mock('selectors/regatta', () => ({
  ...jest.requireActual('selectors/regatta'),
  getRegattaPlannedRaces: () => (s: any) => s.fake.plannedRaces,
}))

const flush = async (times = 10) => {
  for (let i = 0; i < times; i++) {
    await new Promise(resolve => setTimeout(resolve, 0))
  }
}

let fake: any
let dispatched: any[]
let sagaErrors: any[]
let channel: any
let task: any

const types = () => dispatched.map(a => a.type)
const snackbarTexts = () => Snackbar.show.mock.calls.map((c: any[]) => c[0] && c[0].text)

const startSagas = () => {
  channel = stdChannel()
  task = runSaga({
    channel,
    dispatch: (action: any) => { dispatched.push(action); channel.put(action) },
    getState: () => ({ fake }),
    onError: (e: any) => { sagaErrors.push(e) },
  }, watchCourses)
}

const dispatch = (action: any) => {
  dispatched.push(action)
  channel.put(action)
}

const RACE_INFO = {
  serverUrl: 'https://server.test',
  regattaName: 'Regatta',
  raceColumnName: 'R1',
  fleet: 'Default',
  leaderboardName: 'Regatta',
  secret: 'secret',
}

beforeEach(() => {
  I18n.locale = 'en'
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  jest.spyOn(console, 'log').mockImplementation(() => {})
  Object.keys(mockApi).forEach(k => mockApi[k].mockReset())
  Snackbar.show.mockClear()
  dispatched = []
  sagaErrors = []
  fake = {
    loggedIn: false,
    connected: true,
    inventoryByName: {},
    courses: {},
    editedCourse: undefined,
    sameStartFinish: false,
    courseChanged: true,
    selectedMarkConfiguration: undefined,
    markConfigurations: {},
    raceInfo: RACE_INFO,
    plannedRaces: [],
  }
  startSagas()
})

afterEach(() => {
  task && task.isRunning() && task.cancel()
  jest.restoreAllMocks()
})

const navigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
})

// Actions that change the edited course's waypoints/mark configurations.
const WAYPOINT_MUTATIONS = [
  'REPLACE_WAYPOINT_MARK_CONFIGURATION',
  'CHANGE_WAYPOINT_TO_NEW_LINE',
  'CHANGE_WAYPOINT_MARK_CONFIGURATION_TO_NEW',
  'ASSIGN_MARK_OR_MARK_PROPERTIES_TO_MARK_CONFIGURATION',
]

// "Waypoints unchanged" = either nothing was mutated, or the saga restored the
// original edited course with a final EDIT_COURSE.
const expectEditedCourseUnchanged = (original: any) => {
  const mutated = dispatched.some(a => WAYPOINT_MUTATIONS.includes(a.type))
  if (!mutated) return
  const lastEdit = [...dispatched].reverse().find(a => a.type === 'EDIT_COURSE')
  expect(lastEdit && lastEdit.payload).toEqual(original)
  const lastEditIndex = dispatched.lastIndexOf(lastEdit)
  expect(dispatched.slice(lastEditIndex + 1).filter(a => WAYPOINT_MUTATIONS.includes(a.type))).toEqual([])
}

// ---------------------------------------------------------------------------
// Bug 1: missing default mark properties
// ---------------------------------------------------------------------------

describe('course editor with missing default mark properties (inventory empty or failed to load)', () => {
  // User impact: opening a race without a course left the editor on
  // "Loading course..." forever because the saga crashed before clearing the
  // loading flag.
  test('initialising a new course clears the loading state, shows an error and does not crash', async () => {
    fake.courses['Regatta - R1'] = { waypoints: [], markConfigurations: [] }
    mockApi.requestCourse.mockResolvedValue({ waypoints: [], markConfigurations: [] })

    dispatch(selectCourse({ race: 'R1', navigation: navigation() }))
    await flush()

    expect(sagaErrors).toEqual([])
    const loading = dispatched.filter(a => a.type === 'UPDATE_COURSE_LOADING')
    expect(loading.length).toBeGreaterThan(0)
    expect(loading[loading.length - 1].payload).toBe(false)
    expect(Snackbar.show).toHaveBeenCalled()
  })

  const startFinishCourse = {
    markConfigurations: [{ id: 'pin' }, { id: 'boat' }, { id: 'wind' }],
    waypoints: [
      { id: 'w-start', passingInstruction: 'Line', markConfigurationIds: ['pin', 'boat'] },
      { id: 'w-wind', passingInstruction: 'Port', markConfigurationIds: ['wind'] },
      { id: 'w-finish', passingInstruction: 'Line', markConfigurationIds: ['pin', 'boat'] },
    ],
  }
  const separateCourse = {
    markConfigurations: [{ id: 'sp' }, { id: 'sb' }, { id: 'wind' }, { id: 'fp' }, { id: 'fb' }],
    waypoints: [
      { id: 'w-start', passingInstruction: 'Line', markConfigurationIds: ['sp', 'sb'] },
      { id: 'w-wind', passingInstruction: 'Port', markConfigurationIds: ['wind'] },
      { id: 'w-finish', passingInstruction: 'Line', markConfigurationIds: ['fp', 'fb'] },
    ],
  }

  // User impact: tapping "Start and finish are the same" crashed the saga and
  // left the course with a half-rewired finish line.
  test('toggling to separate start/finish does not crash, leaves the waypoints unchanged and shows an error', async () => {
    fake.editedCourse = startFinishCourse
    fake.sameStartFinish = true

    dispatch(toggleSameStartFinish())
    await flush()

    expect(sagaErrors).toEqual([])
    expectEditedCourseUnchanged(startFinishCourse)
    expect(Snackbar.show).toHaveBeenCalled()
  })

  test('toggling to same start/finish does not crash, leaves the waypoints unchanged and shows an error', async () => {
    fake.editedCourse = separateCourse
    fake.sameStartFinish = false

    dispatch(toggleSameStartFinish())
    await flush()

    expect(sagaErrors).toEqual([])
    expectEditedCourseUnchanged(separateCourse)
    expect(Snackbar.show).toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// Bug 4 + 5: course save
// ---------------------------------------------------------------------------

const editedCourse = {
  markConfigurations: [{ id: 'mc1', markPropertiesId: 'mp1' }],
  waypoints: [{ id: 'w1', passingInstruction: 'Port', markConfigurationIds: ['mc1'] }],
}
const savedPrimaryCourse = {
  markConfigurations: [{ id: 'mc1', markPropertiesId: 'mp1', trackingDevices: [] }],
  waypoints: [{ passingInstruction: 'Port', markConfigurationIds: ['mc1'] }],
}
const emptyFollowingCourse = {
  markConfigurations: [{ id: 'n1', markPropertiesId: 'mp1' }],
  waypoints: [],
}

const createCourseCallsFor = (race: string) =>
  mockApi.createCourse.mock.calls.filter((c: any[]) => c[1] === race)

const PARTIAL_FAILURE_KEY = 'error_course_saved_following_races_failed'

describe('saving a course that propagates to following races', () => {
  beforeEach(() => {
    fake.editedCourse = editedCourse
    fake.courses['Regatta - R1'] = { markConfigurations: [], waypoints: [] }
    fake.plannedRaces = ['R1', 'R2']
  })

  // User impact: the user was told "Course successfully saved" although the
  // following races silently kept their old/no course.
  test('reports a partial failure instead of plain success when creating a following race course fails', async () => {
    mockApi.requestCourse.mockResolvedValue(emptyFollowingCourse)
    mockApi.createCourse.mockImplementation((regatta: string, race: string) =>
      race === 'R1' ? Promise.resolve(savedPrimaryCourse) : Promise.reject(new Error('500')))
    const nav = navigation()

    dispatch(navigateBackFromCourseCreation({ navigation: nav }))
    await flush()

    expect(sagaErrors).toEqual([])
    expect(createCourseCallsFor('R2').length).toBe(1)
    const texts = snackbarTexts()
    expect(texts).not.toContain(I18n.t('text_course_saved'))
    expect(texts[texts.length - 1]).toBe(I18n.t(PARTIAL_FAILURE_KEY))
  })

  // User impact: the saga crashed after the editor had already closed, so the
  // user got no feedback at all (neither success nor the failed propagation).
  test.each([
    ['the request fails', () => Promise.reject(new Error('timeout'))],
    ['the server returns an empty body', () => Promise.resolve('')],
  ])('does not crash and reports the partial failure when fetching a following race course fails (%s)', async (_: string, followingCourseResponse: any) => {
    mockApi.requestCourse.mockImplementation(followingCourseResponse)
    mockApi.createCourse.mockResolvedValue(savedPrimaryCourse)
    const nav = navigation()

    dispatch(navigateBackFromCourseCreation({ navigation: nav }))
    await flush()

    expect(sagaErrors).toEqual([])
    expect(createCourseCallsFor('R1').length).toBe(1)
    expect(nav.goBack).toHaveBeenCalled()
    const texts = snackbarTexts()
    expect(texts[texts.length - 1]).toBe(I18n.t(PARTIAL_FAILURE_KEY))
  })
})

describe('double save', () => {
  // User impact: Android hardware Back -> "Save" dispatched the save twice; the
  // takeLatest cancel does not abort the in-flight POST, so the course was
  // created twice on the server.
  test('two save requests in quick succession create the course only once', async () => {
    fake.editedCourse = editedCourse
    fake.courses['Regatta - R1'] = { markConfigurations: [], waypoints: [] }
    fake.plannedRaces = ['R1']
    let resolveCreate: any
    mockApi.createCourse.mockImplementation(() => new Promise(resolve => { resolveCreate = resolve }))
    const nav = navigation()

    dispatch(navigateBackFromCourseCreation({ navigation: nav }))
    dispatch(navigateBackFromCourseCreation({ navigation: nav }))
    await flush()
    resolveCreate && resolveCreate(savedPrimaryCourse)
    await flush()

    expect(createCourseCallsFor('R1').length).toBe(1)
  })
})

// ---------------------------------------------------------------------------
// Bug 6: mark position update with invalid coordinates
// ---------------------------------------------------------------------------

describe('updating a mark position', () => {
  beforeEach(() => {
    fake.markConfigurations.mc1 = { id: 'mc1', markId: 'mark-1', markPropertiesId: 'mp1' }
  })

  // User impact: "Ping position" before a GPS fix was available sent
  // latitude/longitude = null to the server, moving the mark to nowhere.
  test.each([
    ['null', { latitude: null, longitude: null }],
    ['undefined', { latitude: undefined, longitude: undefined }],
    ['NaN', { latitude: NaN, longitude: 8.1 }],
    ['partially null', { latitude: 54.1, longitude: null }],
  ])('never sends %s coordinates to the server and shows an error', async (_: string, location: any) => {
    dispatch(updateMarkPosition({ markConfigurationId: 'mc1', location }))
    await flush()

    expect(mockApi.updateMarkPropertyPositioning).not.toHaveBeenCalled()
    expect(mockApi.sendMarkGpsFix).not.toHaveBeenCalled()
    expect(Snackbar.show).toHaveBeenCalled()
  })

  test('still sends valid coordinates (guard against over-blocking)', async () => {
    mockApi.updateMarkPropertyPositioning.mockResolvedValue({})
    mockApi.sendMarkGpsFix.mockResolvedValue({})
    dispatch(updateMarkPosition({ markConfigurationId: 'mc1', location: { latitude: 54.1, longitude: 10.2 } }))
    await flush()

    expect(mockApi.updateMarkPropertyPositioning).toHaveBeenCalled()
    expect(mockApi.sendMarkGpsFix).toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// Bug 8: binding this device as a mark tracker
// ---------------------------------------------------------------------------

describe('binding this device as tracker of a mark', () => {
  beforeEach(() => {
    fake.markConfigurations.mc1 = { id: 'mc1', markId: 'mark-1', markPropertiesId: 'mp1' }
    mockApi.updateMarkPropertyPositioning.mockResolvedValue({})
    mockApi.requestMark.mockResolvedValue({ entities: {} })
  })

  // User impact: a flaky lookup of existing bindings was treated as "not
  // bound", creating a duplicate device mapping on the server.
  test('does not create a new device mapping when looking up existing bindings fails', async () => {
    mockApi.requestTrackingDevices.mockRejectedValue(new Error('timeout'))
    mockApi.startDeviceMapping.mockResolvedValue({})

    dispatch(updateMarkPosition({ markConfigurationId: 'mc1', bindToThisDevice: true }))
    await flush()

    expect(mockApi.startDeviceMapping).not.toHaveBeenCalled()
    expect(Snackbar.show).toHaveBeenCalled()
  })

  // User impact: the user believed the phone was tracking the mark while the
  // binding had actually failed (only a console.warn was emitted).
  test('shows an error when starting the device mapping fails', async () => {
    mockApi.requestTrackingDevices.mockResolvedValue({ marks: [] })
    mockApi.startDeviceMapping.mockRejectedValue(new Error('500'))

    dispatch(updateMarkPosition({ markConfigurationId: 'mc1', bindToThisDevice: true }))
    await flush()

    expect(mockApi.startDeviceMapping).toHaveBeenCalled()
    expect(Snackbar.show).toHaveBeenCalled()
  })

  test('shows an error when binding the mark properties to this device fails', async () => {
    fake.markConfigurations.mc1 = { id: 'mc1', markPropertiesId: 'mp1' }
    mockApi.updateMarkPropertyPositioning.mockRejectedValue(new Error('500'))

    dispatch(updateMarkPosition({ markConfigurationId: 'mc1', bindToThisDevice: true }))
    await flush()

    expect(Snackbar.show).toHaveBeenCalled()
  })
})

describe('binding this device as tracker of a mark (regression guard)', () => {
  test('creates the device mapping when the lookup succeeds and this device is not bound yet', async () => {
    fake.markConfigurations.mc1 = { id: 'mc1', markId: 'mark-1', markPropertiesId: 'mp1' }
    mockApi.updateMarkPropertyPositioning.mockResolvedValue({})
    mockApi.requestMark.mockResolvedValue({ entities: {} })
    mockApi.requestTrackingDevices.mockResolvedValue({ marks: [] })
    mockApi.startDeviceMapping.mockResolvedValue({})

    dispatch(updateMarkPosition({ markConfigurationId: 'mc1', bindToThisDevice: true }))
    await flush()

    expect(mockApi.startDeviceMapping).toHaveBeenCalledTimes(1)
  })
})

import { mapMarkConfigurationsToEditedCourse } from '../course'

declare var test: any
declare var expect: any

const configuration = (id: string, name: string, shortName: string) => ({
  id,
  effectiveProperties: { name, shortName }
})

test('course editor ignores mark configurations from another race that are not in the edited course', () => {
  const editedCourse = {
    markConfigurations: [configuration('edited-start', 'Start Pin', 'SP')]
  }
  const eventCourses = [{
    markConfigurations: [
      configuration('race-start', 'Start Pin', 'SP'),
      configuration('other-race-only', 'Gate Mark 1', 'GM1')
    ]
  }]

  expect(mapMarkConfigurationsToEditedCourse(eventCourses, editedCourse)).toEqual({
    'edited-start': 'edited-start',
    'race-start': 'edited-start'
  })
})

test('course editor ignores legacy/incomplete mark configurations instead of crashing', () => {
  const editedCourse = {
    markConfigurations: [configuration('edited-start', 'Start Pin', 'SP')]
  }
  const eventCourses = [{
    markConfigurations: [
      { id: 'missing-properties' },
      { id: 'missing-short-name', effectiveProperties: { name: 'Gate Mark 1' } }
    ]
  }, null]

  expect(() => mapMarkConfigurationsToEditedCourse(eventCourses, editedCourse)).not.toThrow()
  expect(mapMarkConfigurationsToEditedCourse(eventCourses, editedCourse)).toEqual({
    'edited-start': 'edited-start'
  })
})

test('course editor can mount before an edited course is loaded', () => {
  const eventCourses = [{
    markConfigurations: [configuration('race-start', 'Start Pin', 'SP')]
  }]

  expect(() => mapMarkConfigurationsToEditedCourse(eventCourses, { markConfigurations: [] })).not.toThrow()
  expect(mapMarkConfigurationsToEditedCourse(eventCourses, { markConfigurations: [] })).toEqual({})
})

import {
  forOwn,
  get,
  head,
  includes,
  isFunction,
  isNumber,
  isObject,
  keys,
  omitBy,
} from 'lodash'

/**
 *
 * @param {*} entityValue
 * @param {*} filter function or object with properties
 * @param {*} isIncludeFilter should elements which satisfy the filter be included or excluded
 * @param {*} keepIds ids of objects which should be included regardless of filter result
 */
const getFilteredEntity = (entityValue: any, filter: any, isIncludeFilter = false, keepIds: any) => {
  const remaining: any = {}
  if (filter && entityValue) {
    forOwn(entityValue, (inspectedValue, inspectedKey) => {
      let filterStatisfied = true

      if (isFunction(filter)) {
        filterStatisfied = filter(inspectedValue)
      } else if (isObject(filter)) {
        forOwn(filter, (filterPropValue, filterPropKey) => {
          filterStatisfied = inspectedValue[filterPropKey] === filterPropValue && filterStatisfied
        })
      }

      if (
        (filterStatisfied && isIncludeFilter)
          || (!filterStatisfied && !isIncludeFilter)
          || includes(keepIds, inspectedKey)
      ) {
        remaining[inspectedKey] = inspectedValue
      }
    })
  }
  return remaining
}

export const filterEntityByIds = (entityValue: any, ids = [], includeIds = false) => {
  const remaining: any = {}
  if (!entityValue) {
    return remaining
  }

  const idIsNumber = isNumber(head(ids))

  forOwn(entityValue, (inspectedValue, inspectedKey) => {
    const key = idIsNumber ? parseInt(inspectedKey, 10) : inspectedKey
    const isFilterSatisfied = includes(ids, key)
    if ((isFilterSatisfied && includeIds) || (!isFilterSatisfied && !includeIds)) {
      remaining[key] = inspectedValue
    }
  })
  return remaining
}

export const pickEntityElementsBy = (entity: any, filter: any, excludeIdsFromFilter: any) =>
  getFilteredEntity(entity, filter, true, excludeIdsFromFilter)

export const omitEntityElementsBy = (entity: any, filter: any, excludeIdsFromFilter: any) =>
  getFilteredEntity(entity, filter, false, excludeIdsFromFilter)

export const getDirtyFieldsOnly = (data: any, initialData: any) => {
  if (!data || !initialData) {
    return data
  }
  const result = omitBy(data, (value, key) => value === get(initialData, key))
  return keys(result).length > 0 ? result : null
}

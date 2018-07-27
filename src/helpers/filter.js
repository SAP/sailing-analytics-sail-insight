import {
  isObject,
  get,
  forOwn,
  includes,
  isFunction,
  isNumber,
  head,
  omitBy,
  keys,
} from 'lodash'

/**
 *
 * @param {*} entityValue
 * @param {*} filter function or object with properties
 * @param {*} isIncludeFilter should elements which satisfy the filter be included or excluded
 * @param {*} keepIds ids of objects which should be included regardless of filter result
 */
const getFilteredEntity = (entityValue, filter, isIncludeFilter = false, keepIds) => {
  const remaining = {}
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

export const filterEntityByIds = (entityValue, ids = [], includeIds = false) => {
  const remaining = {}
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


export const pickEntityElementsBy = (entity, filter, excludeIdsFromFilter) => getFilteredEntity(entity, filter, true, excludeIdsFromFilter)

export const omitEntityElementsBy = (entity, filter, excludeIdsFromFilter) => getFilteredEntity(entity, filter, false, excludeIdsFromFilter)

export const getDirtyFieldsOnly = (data, initialData) => {
  if (!data || !initialData) {
    return data
  }
  const result = omitBy(data, (value, key) => value === get(initialData, key))
  return keys(result).length > 0 ? result : null
}

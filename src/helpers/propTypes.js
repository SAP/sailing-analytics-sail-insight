import PropTypes from 'prop-types'

export const stylesheetPropType = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.object,
  PropTypes.array,
])

export const imageSourcePropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.shape({}),
])

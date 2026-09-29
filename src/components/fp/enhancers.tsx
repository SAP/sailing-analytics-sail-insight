import React from 'react'

type AnyComponent = React.ComponentType<any>
type Enhancer = (BaseComponent: AnyComponent) => AnyComponent

const identityEnhancer: Enhancer = BaseComponent => BaseComponent

const getDisplayName = (Component: AnyComponent) =>
  Component.displayName || Component.name || 'Component'

/**
 * Small React-native HOC helpers used by the legacy functional-component layer.
 *
 * These intentionally cover only the Recompose helpers the app actually uses.
 * They use normal React components and JSX, so they do not depend on the
 * They avoid the legacy React factory API removed in React 19.
 */
export const branch = (
  test: (props: any) => boolean,
  leftEnhancer: Enhancer,
  rightEnhancer: Enhancer = identityEnhancer,
): Enhancer => BaseComponent => {
  const LeftComponent = leftEnhancer(BaseComponent)
  const RightComponent = rightEnhancer(BaseComponent)

  const Branch = (props: any) =>
    test(props)
      ? <LeftComponent {...props} />
      : <RightComponent {...props} />

  Branch.displayName = `branch(${getDisplayName(BaseComponent)})`
  return Branch
}

export const mapProps = (
  propsMapper: (props: any) => any,
): Enhancer => BaseComponent => {
  const MapProps = (props: any) => <BaseComponent {...propsMapper(props)} />
  MapProps.displayName = `mapProps(${getDisplayName(BaseComponent)})`
  return MapProps
}

export const withHandlers = (
  handlers: Record<string, (props: any) => (...args: any[]) => any> |
    ((props: any) => Record<string, (props: any) => (...args: any[]) => any>),
): Enhancer => BaseComponent => {
  class WithHandlers extends React.Component<any> {
    handlers: Record<string, (...args: any[]) => any>

    constructor(props: any) {
      super(props)
      const handlerCreators = typeof handlers === 'function' ? handlers(props) : handlers
      this.handlers = Object.keys(handlerCreators).reduce((result, name) => {
        result[name] = (...args: any[]) => handlerCreators[name](this.props)(...args)
        return result
      }, {} as Record<string, (...args: any[]) => any>)
    }

    render() {
      return <BaseComponent {...this.props} {...this.handlers} />
    }
  }

  WithHandlers.displayName = `withHandlers(${getDisplayName(BaseComponent)})`
  return WithHandlers
}

export const withState = (
  stateName: string,
  stateUpdaterName: string,
  initialState: any,
): Enhancer => BaseComponent => {
  class WithState extends React.Component<any, { value: any }> {
    constructor(props: any) {
      super(props)
      this.state = {
        value: typeof initialState === 'function' ? initialState(props) : initialState,
      }
    }

    updateStateValue = (valueOrUpdater: any, callback?: () => void) => {
      this.setState(
        previousState => ({
          value: typeof valueOrUpdater === 'function'
            ? valueOrUpdater(previousState.value)
            : valueOrUpdater,
        }),
        callback,
      )
    }

    render() {
      const stateProps = {
        [stateName]: this.state.value,
        [stateUpdaterName]: this.updateStateValue,
      }
      return <BaseComponent {...this.props} {...stateProps} />
    }
  }

  WithState.displayName = `withState(${getDisplayName(BaseComponent)})`
  return WithState
}

export const withStateHandlers = (
  initialState: Record<string, any> | null | ((props: any) => Record<string, any> | null),
  stateUpdaters: Record<string, (state: any, props: any) => (...args: any[]) => any>,
): Enhancer => BaseComponent => {
  class WithStateHandlers extends React.Component<any, Record<string, any>> {
    stateUpdaters: Record<string, (...args: any[]) => void>

    constructor(props: any) {
      super(props)
      const resolvedInitialState = typeof initialState === 'function'
        ? initialState(props)
        : initialState
      this.state = resolvedInitialState || {}

      this.stateUpdaters = Object.keys(stateUpdaters).reduce((result, name) => {
        result[name] = (...args: any[]) => {
          this.setState((state, currentProps) => {
            const updater = stateUpdaters[name](state, currentProps)
            return updater(...args)
          })
        }
        return result
      }, {} as Record<string, (...args: any[]) => void>)
    }

    render() {
      return <BaseComponent {...this.props} {...this.state} {...this.stateUpdaters} />
    }
  }

  WithStateHandlers.displayName = `withStateHandlers(${getDisplayName(BaseComponent)})`
  return WithStateHandlers
}

/**
 * Lifecycle call sites in this app use class-style `this.props` and sometimes
 * attach unsubscribe handles to `this`. Keep that behavior with a tiny local
 * class wrapper instead of translating every screen at once.
 */
export const lifecycle = (spec: Record<string, any>): Enhancer => BaseComponent => {
  class Lifecycle extends React.Component<any> {
    render() {
      return <BaseComponent {...this.props} />
    }
  }

  Object.keys(spec).forEach(name => {
    if (name !== 'render') {
      ;(Lifecycle.prototype as any)[name] = spec[name]
    }
  })

  Lifecycle.displayName = `lifecycle(${getDisplayName(BaseComponent)})`
  return Lifecycle
}

import Logger from './Logger'

/**
 * Uncaught JS errors and (in release builds) unhandled promise rejections end up
 * in the local diagnostics log. Existing handlers (React Native, Crashlytics) keep running.
 */
export const installGlobalErrorLogging = () => {
  const errorUtils = (global as any).ErrorUtils
  if (errorUtils && errorUtils.getGlobalHandler && errorUtils.setGlobalHandler) {
    const previous = errorUtils.getGlobalHandler()
    errorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
      Logger.error(isFatal ? 'Uncaught fatal JS error:' : 'Uncaught JS error:', error)
      if (previous) previous(error, isFatal)
    })
  }

  // In development React Native's own tracker shows rejections in LogBox; do not replace it.
  const hermes = (global as any).HermesInternal
  if (!__DEV__ && hermes && hermes.enablePromiseRejectionTracker) {
    hermes.enablePromiseRejectionTracker({
      allRejections: true,
      onUnhandled: (_id: number, rejection: any) => Logger.warn('Unhandled promise rejection:', rejection),
    })
  }
}

import React from 'react'

export const AuthContext = React.createContext({isLoading: true, isLoggedIn: false})
export const SessionsContext = React.createContext({forTracking: false})
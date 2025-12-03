import { useEffect, useState } from 'react'
import _ from 'lodash'
import { permissionGroupNames, userRoles } from '@shared'

// thanks: https://medium.com/javascript-in-plain-english/state-management-with-react-hooks-no-redux-or-context-api-8b3035ceecf8

let state = {
  sidebarWidth: 250, // computed in App.js
  appInitialized: false,
  user: null, // not logged in
  isAdmin: false, // computed, for convenience
  isCityUser: false,
  isReviewer: false,
  isPublicUser: false,
  users: [],
  usersInitialized: false,
  // eReviewHub specific
  applications: [],
  forms: [],
  reviews: [],
}
let listeners = []

export const setGlobalState = update => {
  if (_.isFunction(update)) {
    state = { ...state, ...update(state) }
  } else {
    state = { ...state, ...update }
  }

  const { user, users, usersInitialized } = state
  const computedState = {
    globalInitDone: _.every([usersInitialized]),
    isAdmin: (permissionGroupNames && user?.permissions?.includes(permissionGroupNames.admin)) || (userRoles && user?.role === userRoles.admin),
    isCityUser: userRoles && user?.role === userRoles.cityUser,
    isReviewer: userRoles && user?.role === userRoles.reviewer,
    isPublicUser: userRoles && user?.role === userRoles.public,
    enabledUsers: users?.filter(u => u.enabled),
  }

  state = {
    ...state,
    ...computedState,
  }

  listeners.forEach(listener => listener(state))
  window.jde_state = state
}

export const useGlobalState = () => {
  // export const useGlobalState = (conditionalWatchKeys = []) => {
  // useEffect(() => {
  //   _.forEach(conditionalWatchKeys, watchKey => {
  //     let watcher = conditionalWatchers[watchKey]
  //     let { isWatching, watcherFn } = watcher
  //     if (!isWatching) {
  //       watcher.isWatching = true
  //       listenerRemove = watcherFn(data => {
  //         setGlobalState({ [watchKey]: data, [`${watchKey}Initialized`]: true })
  //       })
  //     }
  //   })
  // }, [conditionalWatchKeys])
  const newListener = useState()[1]
  useEffect(() => {
    listeners.push(newListener)
    return () => {
      listeners = listeners.filter(listener => listener !== newListener)
    }
  }, [newListener])

  return state
}

export const getState = () => state

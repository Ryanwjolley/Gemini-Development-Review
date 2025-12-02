import axios from 'axios'
import _ from 'lodash'

axios.defaults.baseURL = import.meta.env.VITE_API_URL_OVERRIDE || import.meta.env.VITE_API_URL
let auth = null
export const setApiAuth = a => {
  auth = a
}
const api = async function (url, params, axiosConfig) {
  try {
    const { currentUser } = auth
    let config
    if (currentUser) {
      // signed in
      const token = await currentUser.getIdToken()
      config = _.merge({}, axiosConfig, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }
    const { data, status } = await axios.post(url, params, config)

    if (status !== 200) {
      throw new Error('error with request')
    }

    return data
  } catch (err) {
    let errorMessage =
      axiosConfig?.responseType === 'blob'
        ? (await err.response?.data?.text()) || err.message
        : _.get(err, 'response.data', err.message)
    console.error(
      `There was an error calling ${url} with these params`,
      err,
      params,
      errorMessage
    )

    if (!_.isString(errorMessage)) {
      errorMessage = JSON.stringify(errorMessage)
    }

    const error = new Error(errorMessage)
    error.status = err?.response?.status
    error.data = err?.response?.data
    throw error
  }
}

export default api

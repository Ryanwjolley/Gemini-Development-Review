import { toast as reactToast } from 'react-toastify'

const toast = {
  ...reactToast,

  success: (msg, options) => reactToast.success(msg, { ...options }),

  error: (msg, options) =>
    reactToast.error(msg, {
      autoClose: false,
      ...options,
    }),
}

export default toast

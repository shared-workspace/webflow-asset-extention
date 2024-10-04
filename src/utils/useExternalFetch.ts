
const isDev = process.env.NODE_ENV === 'development'
// Create a custom fetch instance
export const useExternalFetch = $fetch.create({
  ...(!isDev ? {
    baseURL: "https://3000-sharedworks-webflowasse-r8pcyskepul.ws-us116.gitpod.io",
    headers: {
      'Access-Control-Allow-Origin': "*",
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  } : {}),
  // Define the onRequest interceptor to add headers
  async onRequest({ options }) {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('localid')
      options.headers = options.headers || {}
      if (token) {
        (options.headers as any)['Authorization'] = `Bearer ${token}`
      }
      if (userId) {
        (options.headers as any)['user-id'] = userId
      }
    }
  },
  // Define the onRequestError interceptor
  onRequestError(error) {
    console.error('Request error:', error)
  },
  // Define the onResponse interceptor
  onResponse({ response }) {
    // Do something with the response data
  },
  // Define the onResponseError interceptor
  onResponseError(error) {
    console.error('Response error:', error)
  }
})

export default defineNuxtPlugin((nuxtApp) => {
  const api = $fetch.create({
    baseURL: 'https://automatic-happiness-94x9qv7qrw73p69g-3000.app.github.dev',
    headers: {
      'Access-Control-Allow-Origin': "*",
      'Access-Control-Allow-Headers': "*",
      'Access-Control-Allow-Methods': "*",
    },
    onRequest({ request, options, error }) {
      const token = localStorage.getItem('token')
      console.log('token', token)
      if (token) {
        const headers = options.headers || {};
        if (Array.isArray(headers)) {
          headers.push(['authorization', `Bearer ${token}`])
        }
        else if (headers instanceof Headers) {
          headers.set('authorization', `Bearer ${token}`)
        }
        else {
          (headers as any)["authorization"] = `Bearer ${token}`
        }
        options.headers = headers
      }
    },
    async onResponseError({ error, response }) {
      throw createError({
        message: error?.message || "An error occurred",
        statusCode: error?.name === "UnauthorizedError" ? 401 : 500,
        name: error?.name || "Error"
      })
    }
  })

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api
    }
  }
})

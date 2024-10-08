export default defineNuxtPlugin(() => {
  const session = useCookie("session")
  const api = $fetch.create({
    baseURL: 'https://3000-sharedworks-webflowasse-po1abmzkdzh.ws-us116.gitpod.io',
    headers: {
      'Access-Control-Allow-Origin': "*",
      'Access-Control-Allow-Headers': "*",
      'Access-Control-Allow-Methods': "*",
    },
    onRequest({ request, options, error }) {
      const token = localStorage.getItem('token')
      console.log('token', token)
      if (token) {
        const headers = options.headers ??= {} as Headers;
        if (Array.isArray(headers)) {
          headers.push(['authorization', `Bearer ${token}`])
        } else if (headers instanceof Headers) {
          headers.set('authorization', `Bearer ${token}`)
        } else {
          (headers as any)["authorization"] = `Bearer ${token}`
        }
      }
    },
  })
  return {
    provide: {
      api
    }
  }
})
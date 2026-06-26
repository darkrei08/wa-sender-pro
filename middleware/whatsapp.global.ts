export default defineNuxtRouteMiddleware((to) => {
  const waStore = useWhatsappStore()

  // Rotte protette che richiedono almeno un dispositivo connesso
  const protectedRoutes = ['/contacts', '/campaigns', '/chat', '/templates']

  // Se la rotta corrente inizia con una di quelle protette
  const isProtected = protectedRoutes.some(route => to.path.startsWith(route))

  if (isProtected && !waStore.connected) {
    // Aggiungi un parametro per far capire alla pagina devices perché siamo qui
    return navigateTo('/devices?blocked=true')
  }
})

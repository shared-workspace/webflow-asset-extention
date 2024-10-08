const ONE_DAY = 60 * 60 * 24 * 1000;

interface Session {
    token?: string;
}

const session = useCookie<Session>('session', { default() {
    return { token: '' }
}, expires: new Date(Date.now() + ONE_DAY) });
const isAuth = computed(() => !!session.value?.token);
export function useSession() {
    return {
        isAuth,
        session,
        createSession(newSession: Session) { session.value = newSession, refreshCookie("session") },
    }
}
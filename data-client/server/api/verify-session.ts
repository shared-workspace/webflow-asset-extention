import { deserialize, unsign } from "~~/utils/cookie";

export default defineEventHandler(async (event) => {
    const headers = getHeaders(event);
    const authorization = headers.authorization || headers.Authorization;
    if (!authorization) return { authorized: false };
    const token = authorization?.replace("Bearer ", "");
    if (!token) return { authorized: false };
    const config = useRuntimeConfig();
    const value = unsign(token, config.cookieSecret);
    const { expires } = deserialize(value) as { expires?: string; };
    if (!expires || parseInt(expires) < Date.now()) return { authorized: false };
    return { authorized: true };
});
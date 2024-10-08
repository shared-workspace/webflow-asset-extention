import { serialize, sign } from "~~/utils/cookie";

interface Body {
  password?: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<Body>(event);
  const password = body.password;
  if (!password) {
    throw createError({
      name: "Unauthorized",
      status: 400,
      message: "Password is required",
    })
  }
  if (password !== process.env.PASSWORD) {
    throw createError({
      name: "Unauthorized",
      status: 401,
      message: "Invalid password",
    })
  }
  const config = useRuntimeConfig();
  const expires = new Date(Date.now() + parseInt(config.cookieExpires)).getTime().toString();
  const value = serialize({ expires })
  const signedSession = sign(value, config.cookieSecret);
  return signedSession;
});
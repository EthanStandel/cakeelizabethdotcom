export const OAUTH_PROVIDER = "github";
export const OAUTH_STATE_COOKIE = "cms_oauth_state";
export const OAUTH_CALLBACK_PATH = "/api/callback";

const OAUTH_STATE_COOKIE_PATH = "/api";
const OAUTH_STATE_MAX_AGE_SECONDS = 600;

export const readOAuthClient = () => ({
  clientId: process.env.GITHUB_OAUTH_CLIENT_ID?.trim() || undefined,
  clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET?.trim() || undefined,
});

const FORWARDED_PROTO_HEADER = "X-Forwarded-Proto";

// The server sees plain HTTP behind a TLS-terminating proxy, so the scheme the browser used is read from the proxy's header.
export const getOAuthRedirectUri = (request: Request) => {
  const url = new URL(OAUTH_CALLBACK_PATH, request.url);
  const forwardedProto = request.headers
    .get(FORWARDED_PROTO_HEADER)
    ?.split(",")[0]
    .trim();
  if (forwardedProto) url.protocol = forwardedProto;
  return url.href;
};

export const serializeStateCookie = (state: string) =>
  `${OAUTH_STATE_COOKIE}=${state}; Path=${OAUTH_STATE_COOKIE_PATH}; Max-Age=${OAUTH_STATE_MAX_AGE_SECONDS}; HttpOnly; Secure; SameSite=Lax`;

export const clearedStateCookie = `${OAUTH_STATE_COOKIE}=; Path=${OAUTH_STATE_COOKIE_PATH}; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;

export const readCookie = (request: Request, name: string) =>
  request.headers
    .get("Cookie")
    ?.split(";")
    .map((pair) => pair.trim().split("="))
    .find(([key]) => key === name)?.[1];

type OAuthResult =
  | { status: "success"; token: string }
  | { status: "error"; message: string };

const toScriptLiteral = (value: string) =>
  JSON.stringify(value).replaceAll("<", "\\u003c");

const toDecapMessage = (result: OAuthResult) =>
  result.status === "success"
    ? `authorization:${OAUTH_PROVIDER}:success:${JSON.stringify({ token: result.token, provider: OAUTH_PROVIDER })}`
    : `authorization:${OAUTH_PROVIDER}:error:${JSON.stringify({ message: result.message })}`;

// The popup answers only its own origin, which is the admin's, so a page elsewhere that opened it never receives the token.
export const renderOAuthPage = (result: OAuthResult, headers: HeadersInit = {}) =>
  new Response(
    `<!doctype html><html><head><meta charset="utf-8"></head><body><script>
const message = ${toScriptLiteral(toDecapMessage(result))};
const origin = window.location.origin;
window.addEventListener("message", (event) => {
  if (event.origin !== origin) return;
  window.opener?.postMessage(message, event.origin);
});
window.opener?.postMessage(${toScriptLiteral(`authorizing:${OAUTH_PROVIDER}`)}, origin);
</script></body></html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        ...headers,
      },
    },
  );

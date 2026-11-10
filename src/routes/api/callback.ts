import type { APIEvent } from "@solidjs/start/server";
import {
  OAUTH_STATE_COOKIE,
  clearedStateCookie,
  getOAuthRedirectUri,
  readCookie,
  readOAuthClient,
  renderOAuthPage,
} from "~/lib/githubOAuth";

const ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";

interface AccessTokenResponse {
  access_token?: string;
  error_description?: string;
}

const fail = (message: string) =>
  renderOAuthPage(
    { status: "error", message },
    { "Set-Cookie": clearedStateCookie },
  );

const exchangeCode = async (request: Request, code: string) => {
  const { clientId, clientSecret } = readOAuthClient();
  if (!clientId || !clientSecret) {
    return { error_description: "GitHub OAuth client is not configured" };
  }
  const response = await fetch(ACCESS_TOKEN_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: getOAuthRedirectUri(request),
    }),
  });
  return (await response
    .json()
    .catch(() => ({}))) as AccessTokenResponse;
};

export const GET = async ({ request }: APIEvent) => {
  const params = new URL(request.url).searchParams;
  const state = params.get("state");
  if (!state || state !== readCookie(request, OAUTH_STATE_COOKIE)) {
    return fail("Login state did not match; try again");
  }
  const error = params.get("error");
  if (error) return fail(params.get("error_description") ?? error);
  const code = params.get("code");
  if (!code) return fail("GitHub returned no code");
  const { access_token, error_description } = await exchangeCode(request, code);
  if (!access_token) {
    return fail(error_description ?? "GitHub returned no access token");
  }
  return renderOAuthPage(
    { status: "success", token: access_token },
    { "Set-Cookie": clearedStateCookie },
  );
};

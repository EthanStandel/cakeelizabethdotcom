import type { APIEvent } from "@solidjs/start/server";
import {
  getOAuthRedirectUri,
  readOAuthClient,
  renderOAuthPage,
  serializeStateCookie,
} from "~/lib/githubOAuth";

const AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const ALLOWED_SCOPES = new Set(["repo", "public_repo"]);
const DEFAULT_SCOPE = "repo";
const FOUND = 302;

export const GET = ({ request }: APIEvent) => {
  const { clientId } = readOAuthClient();
  if (!clientId) {
    return renderOAuthPage({
      status: "error",
      message: "GITHUB_OAUTH_CLIENT_ID is not set",
    });
  }
  const requestedScope = new URL(request.url).searchParams.get("scope") ?? "";
  const state = crypto.randomUUID();
  const authorizeUrl = new URL(AUTHORIZE_URL);
  authorizeUrl.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getOAuthRedirectUri(request),
    scope: ALLOWED_SCOPES.has(requestedScope) ? requestedScope : DEFAULT_SCOPE,
    state,
  }).toString();
  return new Response(null, {
    status: FOUND,
    headers: {
      Location: authorizeUrl.href,
      "Set-Cookie": serializeStateCookie(state),
      "Cache-Control": "no-store",
    },
  });
};

const ROOT_PATH = "/";
const ADMIN_PATH_PREFIX = "/admin/";

// Paths under the admin are left as they are, because the admin's own server and route rules answer them.
export const normalizePath = (pathname: string) => {
  if (pathname.startsWith(ADMIN_PATH_PREFIX)) return pathname;
  return pathname.replace(/\/{2,}/g, "/").replace(/\/$/, "") || ROOT_PATH;
};

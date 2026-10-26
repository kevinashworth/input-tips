// The app can be served from the site root or a subpath (for example GitHub
// Pages project sites). The <base> tag in index.html sets that prefix; the
// deploy workflow rewrites it when needed. Strip the trailing slash so paths
// can be joined consistently.
export const BASE = new URL(".", document.baseURI).pathname.replace(/\/$/, "");

export const withBase = (path) => `${BASE}${path}`;

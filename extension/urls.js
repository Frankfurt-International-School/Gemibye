/**
 * urls.js
 * Intercepts Google Search URLs to prevent access to the AI Search mode.
 * Checks for the "udm=50" query parameter (AI mode) and redirects the user
 * to the standard "Web" search mode ("udm=14") if detected.
 */
function redirectUDM() {
  // Only look for `udm=50` on Google search urls
  const googleSearchRegex =
    /^https?:\/\/(?:[a-z0-9-]+\.)*google\.[a-z]{2,3}(?:\.[a-z]{2})?\/.*search.*/i;
  if (!googleSearchRegex.test(window.location.href)) return undefined;

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("udm") === "50") {
    // Attempt to send the user back to their previous page
    window.history.back();

    // Fallback: If no history is available, redirect to standard web search (udm=14)
    setTimeout(() => {
      urlParams.set("udm", "14");
      const newUrl =
        window.location.origin +
        window.location.pathname +
        "?" +
        urlParams.toString() +
        window.location.hash;
      window.location.replace(newUrl);
    }, 50);
  }
}

redirectUDM();

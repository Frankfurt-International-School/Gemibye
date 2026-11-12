/**
 * elements.js
 * Find all <a> tags in the DOM to locate and remove any links pointing to the AI Search mode (udm=50).
 * MutationObserver ensures dynamically loaded content is also sanitized.
 */

/**
 * Iterates through all anchor tags within a specified root element and processes them.
 * @param {HTMLElement|Document} searchRoot - The DOM node to scan for links.
 */
function removeAILinks(searchRoot) {
  const pageLinks = Array.from(searchRoot.getElementsByTagName("a"));

  for (const element of pageLinks) {
    processNode(element);
  }
}

/**
 * Sanitize a specific node. If it is an anchor tag linking to the AI search
 * mode (udm=50) it removes the closest list item wrapper from the DOM, which
 * is the container element in standard search.
 *
 * If the anchor tag does not have a wrapper element, remove just the anchor tag.
 *
 * @param {HTMLElement} node - The DOM node to evaluate.
 * @returns {boolean} True if the node was a valid anchor that was processed (or bypassed), false otherwise.
 */
function processNode(node) {
  if (node.tagName.toLowerCase() !== "a" || !node.href) return false;

  try {
    const url = new URL(node.href);
    if (url.searchParams.get("udm") !== "50") return false;

    const wrapper = node.closest('[role="listitem"]') || node;
    wrapper.remove();
  } catch {
    return false;
  }

  return true;
}

/**
 * Initializes the script by cleaning the initial page load and setting up
 * a MutationObserver to watch for newly dynamically loaded content.
 */
function removeElements() {
  const googleSearchRegex =
    /^https?:\/\/(?:[a-z0-9-]+\.)*google\.[a-z]{2,3}(?:\.[a-z]{2})?\/.*search.*/i;
  if (googleSearchRegex.test(window.location.href)) {
    removeAILinks(document);
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (!processNode(node)) {
            removeAILinks(node);
          }
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

removeElements();

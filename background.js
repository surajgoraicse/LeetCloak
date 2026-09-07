/**
 * LeetCloak - Background Service Worker
 * Ensures the Side Panel only opens on LeetCode pages
 */

const LEETCODE_HOSTS = ['leetcode.com', 'leetcode.cn'];

function isLeetCodeUrl(url) {
  if (!url) return false;
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return LEETCODE_HOSTS.some((host) => hostname === host || hostname.endsWith('.' + host));
  } catch {
    return false;
  }
}

// Configure side panel behavior: opens automatically when clicking the action icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((err) => console.warn('[LeetCloak] setPanelBehavior error:', err));

/**
 * Updates side panel availability and icon state for a given tab
 */
async function updateTabState(tabId, url) {
  if (!tabId) return;

  const isLeetCode = isLeetCodeUrl(url);

  try {
    if (isLeetCode) {
      // Enable side panel specifically for this LeetCode tab
      await chrome.sidePanel.setOptions({
        tabId,
        path: 'sidepanel/sidepanel.html',
        enabled: true,
      });
      chrome.action.enable(tabId);
      chrome.action.setTitle({
        tabId,
        title: 'Open LeetCloak Side Panel',
      });
    } else {
      // Disable side panel on all non-LeetCode tabs
      await chrome.sidePanel.setOptions({
        tabId,
        enabled: false,
      });
      chrome.action.disable(tabId);
      chrome.action.setTitle({
        tabId,
        title: 'LeetCloak (Only active on LeetCode)',
      });
    }
  } catch (err) {
    // Safe to ignore if tab is closed or restricted
  }
}

// Listen for tab navigation & URL updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url || changeInfo.status === 'complete') {
    updateTabState(tabId, tab.url || changeInfo.url);
  }
});

// Listen for tab switching
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab && tab.url) {
      updateTabState(activeInfo.tabId, tab.url);
    }
  } catch {
    // Ignore if tab cannot be fetched
  }
});

// Initialize all currently open tabs when the extension loads or updates
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch(() => {});

  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id) {
        updateTabState(tab.id, tab.url);
      }
    });
  });
});

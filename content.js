/**
 * LeetCloak - LeetCode Difficulty & Solved Badge Remover Content Script
 * Manifest V3 compatible
 */

(function () {
  'use strict';

  // Default configuration
  const defaultSettings = {
    active: true,
    mode: 'hidden', // 'hidden' | 'blur' | 'mask'
    hideProblemset: true,
    hideProblem: true,
    hideSimilar: true,
    hideSolved: true,
  };

  let currentSettings = { ...defaultSettings };

  // Set default active state on root immediately to prevent FOUC
  document.documentElement.setAttribute('data-lc-diff-active', 'true');
  document.documentElement.setAttribute('data-lc-diff-mode', 'hidden');
  document.documentElement.setAttribute('data-lc-hide-problemset', 'true');
  document.documentElement.setAttribute('data-lc-hide-problem', 'true');
  document.documentElement.setAttribute('data-lc-hide-similar', 'true');
  document.documentElement.setAttribute('data-lc-hide-solved', 'true');

  // Load saved settings from Chrome storage
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(defaultSettings, (items) => {
      if (chrome.runtime.lastError) {
        console.warn('[LeetCloak] Storage read error:', chrome.runtime.lastError);
        return;
      }
      currentSettings = { ...defaultSettings, ...items };
      applySettingsToDOM(currentSettings);
      scanDOM();
    });

    // Listen for real-time settings updates from popup
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== 'sync') return;
      for (const [key, change] of Object.entries(changes)) {
        currentSettings[key] = change.newValue;
      }
      applySettingsToDOM(currentSettings);
      scanDOM();
    });

    // Support direct runtime messages from popup for instantaneous preview
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message && message.type === 'LC_UPDATE_SETTINGS') {
        currentSettings = { ...currentSettings, ...message.settings };
        applySettingsToDOM(currentSettings);
        scanDOM();
        sendResponse({ success: true });
      }
    });
  }

  function applySettingsToDOM(settings) {
    const root = document.documentElement;
    root.setAttribute('data-lc-diff-active', settings.active ? 'true' : 'false');
    root.setAttribute('data-lc-diff-mode', settings.mode || 'hidden');
    root.setAttribute('data-lc-hide-problemset', settings.hideProblemset ? 'true' : 'false');
    root.setAttribute('data-lc-hide-problem', settings.hideProblem ? 'true' : 'false');
    root.setAttribute('data-lc-hide-similar', settings.hideSimilar ? 'true' : 'false');
    root.setAttribute('data-lc-hide-solved', settings.hideSolved ? 'true' : 'false');
  }

  // Target difficulty keywords
  const DIFFICULTY_WORDS = new Set(['easy', 'medium', 'hard']);

  function isDifficultyText(text) {
    if (!text) return false;
    return DIFFICULTY_WORDS.has(text.trim().toLowerCase());
  }

  /**
   * Prevents modifying code editors, syntax blocks, or inputs
   */
  function isInsideExcludedZone(el) {
    if (!el || !el.closest) return false;
    return !!el.closest('pre, code, .monaco-editor, input, textarea, [contenteditable="true"]');
  }

  /**
   * Tags an element with data attributes for CSS targeting
   */
  function tagElement(el, area) {
    if (!el || isInsideExcludedZone(el)) return;
    if (el.getAttribute('data-lc-difficulty') !== 'true' || el.getAttribute('data-lc-area') !== area) {
      el.setAttribute('data-lc-difficulty', 'true');
      el.setAttribute('data-lc-area', area);
    }
  }

  /**
   * Scans the DOM for difficulty and solved status badges
   */
  function scanDOM() {
    if (!currentSettings.active) return;

    const path = location.pathname;
    const isProblemsetPage = path.includes('/problemset') ||
                             path.includes('/problem-list') ||
                             path.startsWith('/tag/') ||
                             path === '/';

    // =========================================================================
    // 1. DIFFICULTY BADGES
    // =========================================================================

    // Modern LeetCode Problemset Elements (<p class="... text-sd-(easy|medium|hard) ...">)
    const sdBadges = document.querySelectorAll(
      'p[class*="text-sd-easy"], p[class*="text-sd-medium"], p[class*="text-sd-hard"], ' +
      'span[class*="text-sd-easy"], span[class*="text-sd-medium"], span[class*="text-sd-hard"], ' +
      'div[class*="text-sd-easy"], div[class*="text-sd-medium"], div[class*="text-sd-hard"]'
    );
    sdBadges.forEach((el) => {
      if (isInsideExcludedZone(el)) return;
      const text = el.textContent ? el.textContent.trim() : '';
      if (isDifficultyText(text)) {
        const area = (isProblemsetPage || el.closest('[class*="h-[44px]"]') || el.closest('[role="row"]')) ? 'problemset' : 'header';
        tagElement(el, area);
      }
    });

    // Problem Description Header Pill & Classic LeetCode selectors
    const classicBadges = document.querySelectorAll(
      '[class*="text-difficulty-"], [class*="text-olive"], [class*="text-yellow"], [class*="text-pink"], .diff-easy, .diff-medium, .diff-hard'
    );
    classicBadges.forEach((el) => {
      if (isInsideExcludedZone(el)) return;
      const text = el.textContent ? el.textContent.trim() : '';
      if (isDifficultyText(text)) {
        if (el.closest('[data-track-load="description_similar_questions"]') || el.closest('.similar-questions')) {
          tagElement(el, 'similar');
        } else if (isProblemsetPage || el.closest('[class*="h-[44px]"]') || el.closest('[role="row"]')) {
          tagElement(el, 'problemset');
        } else {
          tagElement(el, 'header');
        }
      }
    });

    // Modern LeetCode Problemset Row Scanning
    const rowContainers = document.querySelectorAll('div[class*="h-[44px]"]');
    rowContainers.forEach((row) => {
      const pTags = row.querySelectorAll('p');
      pTags.forEach((p) => {
        if (isInsideExcludedZone(p)) return;
        const text = p.textContent ? p.textContent.trim() : '';
        if (isDifficultyText(text)) {
          tagElement(p, 'problemset');
        }
      });
    });

    // Fallback: Leaf nodes whose exact content is "Easy", "Medium", or "Hard"
    const leaves = document.querySelectorAll('p, span, div.rounded-full, span.rounded-full, div.rounded-md');
    leaves.forEach((el) => {
      if (isInsideExcludedZone(el)) return;
      if (el.children.length === 0) {
        const text = el.textContent ? el.textContent.trim() : '';
        if (isDifficultyText(text)) {
          if (el.closest('[data-track-load="description_similar_questions"]') || el.closest('.similar-questions')) {
            tagElement(el, 'similar');
          } else if (isProblemsetPage || el.closest('[class*="h-[44px]"]') || el.closest('[role="row"]')) {
            tagElement(el, 'problemset');
          } else {
            tagElement(el, 'header');
          }
        }
      }
    });

    // =========================================================================
    // 2. SOLVED STATUS & CHECKMARK ICONS
    // =========================================================================

    // Problem Page: 'Solved' banner next to question title
    // Example: <div class="flex flex-none items-center gap-1 py-1.5 ... text-text-secondary">Solved<svg ... text-message-success ...></div>
    const solvedCandidates = document.querySelectorAll('div.flex-none, div[class*="text-text-secondary"]');
    solvedCandidates.forEach((el) => {
      if (isInsideExcludedZone(el)) return;
      if (el.textContent && el.textContent.includes('Solved') && el.querySelector('svg[class*="text-message-success"]')) {
        el.setAttribute('data-lc-solved', 'problem');
      }
    });

    // Also catch any container having svg.text-message-success and Solved text
    const successSvgs = document.querySelectorAll('svg[class*="text-message-success"]');
    successSvgs.forEach((svg) => {
      const parent = svg.closest('div.flex');
      if (parent && !isInsideExcludedZone(parent) && parent.textContent && parent.textContent.includes('Solved')) {
        parent.setAttribute('data-lc-solved', 'problem');
      }
    });

    // Problemset Page: Checkmark icons in the first column of the row
    // Example: <div class="flex h-[44px] ..."> ... <div class="... text-sd-success"><svg ... fa-check ...>
    const checkmarkIcons = document.querySelectorAll(
      'div[class*="h-[44px]"] div[class*="text-sd-success"], ' +
      'div[class*="h-[44px]"] svg[class*="fa-check"], ' +
      'div[role="row"] svg[class*="fa-check"]'
    );
    checkmarkIcons.forEach((icon) => {
      if (isInsideExcludedZone(icon)) return;
      // Tag the container or icon
      const container = icon.closest('div[class*="text-sd-success"]') || icon;
      container.setAttribute('data-lc-solved', 'problemset');
    });
  }

  // Throttle scanner using requestAnimationFrame
  let scheduled = false;
  function scheduleScan() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(() => {
        scanDOM();
        scheduled = false;
      });
    }
  }

  // Observe DOM additions and attribute changes
  const observer = new MutationObserver(() => {
    scheduleScan();
  });

  function initObserver() {
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });
      scanDOM();
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true,
        });
        scanDOM();
      });
    }
  }

  initObserver();

  // Watch for SPA URL changes
  let lastUrl = location.href;
  const urlCheckInterval = setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      scheduleScan();
    }
  }, 300);

  // Clean up on unload
  window.addEventListener('unload', () => {
    clearInterval(urlCheckInterval);
    observer.disconnect();
  });
})();

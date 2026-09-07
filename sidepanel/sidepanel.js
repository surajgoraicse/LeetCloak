/**
 * LeetCloak - Side Panel Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const masterToggle = document.getElementById('masterToggle');
  const statusBadge = document.getElementById('statusBadge');
  const mainSettings = document.getElementById('mainSettings');
  const modeRadios = document.querySelectorAll('input[name="displayMode"]');
  const optProblemset = document.getElementById('optProblemset');
  const optProblem = document.getElementById('optProblem');
  const optSimilar = document.getElementById('optSimilar');
  const optSolved = document.getElementById('optSolved');

  const defaultSettings = {
    active: true,
    mode: 'hidden',
    hideProblemset: true,
    hideProblem: true,
    hideSimilar: true,
    hideSolved: true,
  };

  // Load saved settings
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(defaultSettings, (items) => {
      applyToUI(items);
    });

    // Listen for storage changes if updated elsewhere
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== 'sync') return;
      const updated = {};
      for (const [key, change] of Object.entries(changes)) {
        updated[key] = change.newValue;
      }
      applyToUI(updated);
    });
  } else {
    applyToUI(defaultSettings);
  }

  function applyToUI(settings) {
    if (settings.active !== undefined) {
      masterToggle.checked = settings.active !== false;
      updateStatusBadge(masterToggle.checked);
    }

    if (settings.mode !== undefined) {
      const mode = settings.mode || 'hidden';
      const activeRadio = document.querySelector(`input[name="displayMode"][value="${mode}"]`);
      if (activeRadio) {
        activeRadio.checked = true;
      }
    }

    if (settings.hideProblemset !== undefined) {
      optProblemset.checked = settings.hideProblemset !== false;
    }
    if (settings.hideProblem !== undefined) {
      optProblem.checked = settings.hideProblem !== false;
    }
    if (settings.hideSimilar !== undefined) {
      optSimilar.checked = settings.hideSimilar !== false;
    }
    if (settings.hideSolved !== undefined) {
      optSolved.checked = settings.hideSolved !== false;
    }
  }

  function updateStatusBadge(isActive) {
    if (isActive) {
      statusBadge.textContent = 'Active';
      statusBadge.classList.remove('disabled');
      mainSettings.classList.remove('disabled');
    } else {
      statusBadge.textContent = 'Disabled';
      statusBadge.classList.add('disabled');
      mainSettings.classList.add('disabled');
    }
  }

  function getCurrentSettingsFromUI() {
    let selectedMode = 'hidden';
    const checkedRadio = document.querySelector('input[name="displayMode"]:checked');
    if (checkedRadio) {
      selectedMode = checkedRadio.value;
    }

    return {
      active: masterToggle.checked,
      mode: selectedMode,
      hideProblemset: optProblemset.checked,
      hideProblem: optProblem.checked,
      hideSimilar: optSimilar.checked,
      hideSolved: optSolved.checked,
    };
  }

  function saveAndNotify() {
    const settings = getCurrentSettingsFromUI();
    updateStatusBadge(settings.active);

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set(settings, () => {
        // Broadcast to all active LeetCode tabs
        chrome.tabs.query({ url: ['*://*.leetcode.com/*', '*://leetcode.com/*', '*://*.leetcode.cn/*'] }, (tabs) => {
          if (tabs && tabs.length > 0) {
            tabs.forEach((tab) => {
              chrome.tabs.sendMessage(tab.id, {
                type: 'LC_UPDATE_SETTINGS',
                settings: settings,
              }).catch(() => {
                // Ignore if tab not ready
              });
            });
          }
        });
      });
    }
  }

  // Event Listeners
  masterToggle.addEventListener('change', saveAndNotify);

  modeRadios.forEach((radio) => {
    radio.addEventListener('change', saveAndNotify);
  });

  optProblemset.addEventListener('change', saveAndNotify);
  optProblem.addEventListener('change', saveAndNotify);
  optSimilar.addEventListener('change', saveAndNotify);
  optSolved.addEventListener('change', saveAndNotify);
});

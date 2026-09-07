/**
 * LeetCloak - Popup Controller
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
  } else {
    applyToUI(defaultSettings);
  }

  function applyToUI(settings) {
    masterToggle.checked = settings.active !== false;
    updateStatusBadge(masterToggle.checked);

    const mode = settings.mode || 'hidden';
    const activeRadio = document.querySelector(`input[name="displayMode"][value="${mode}"]`);
    if (activeRadio) {
      activeRadio.checked = true;
    }

    optProblemset.checked = settings.hideProblemset !== false;
    optProblem.checked = settings.hideProblem !== false;
    optSimilar.checked = settings.hideSimilar !== false;
    optSolved.checked = settings.hideSolved !== false;
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
                // Ignore errors if tab doesn't have content script
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

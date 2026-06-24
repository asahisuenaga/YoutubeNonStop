console.log(`[YouTube NonStop v${chrome.runtime.getManifest().version}]`);

const s = document.createElement('script');
s.src = chrome.runtime.getURL('autoconfirm.js');
s.onload = function () { this.remove(); };
(document.head || document.documentElement).appendChild(s);

const CHECK_INTERVAL_MS = 1000;

function isVisible(element) {
  return element && element.offsetParent !== null && !element.disabled;
}

function clickDialogConfirmButton(root) {
  if (!root) return false;

  const buttons = Array.from(root.querySelectorAll('button')).filter(isVisible);
  if (buttons.length) {
    buttons[0].click();
    console.log('[YouTube NonStop] clicked visible dialog button');
    return true;
  }

  const confirmButton = root.querySelector('#confirm-button');
  if (isVisible(confirmButton)) {
    confirmButton.click();
    console.log('[YouTube NonStop] clicked confirm button fallback');
    return true;
  }

  return false;
}

function clickContinueWatchingPrompt() {
  const unavailableRoot = document.querySelector('ytd-watch-flexy[player-unavailable]');
  if (unavailableRoot && clickDialogConfirmButton(unavailableRoot)) {
    return true;
  }

  const confirmDialog = document.querySelector('yt-confirm-dialog-renderer');
  if (confirmDialog && clickDialogConfirmButton(confirmDialog)) {
    return true;
  }

  const button = document.querySelector('#confirm-button');
  if (isVisible(button)) {
    button.click();
    console.log('[YouTube NonStop] clicked fallback confirm button');
    return true;
  }

  return false;
}

const observer = new MutationObserver(() => clickContinueWatchingPrompt());
observer.observe(document.body, { childList: true, subtree: true });
setInterval(clickContinueWatchingPrompt, CHECK_INTERVAL_MS);
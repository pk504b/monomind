import { PomodoroState } from "./lib/types";

function updateBadge() {
  chrome.storage.local.get(["pomodoroState"], (res) => {
    const s = res.pomodoroState as PomodoroState;
    if (!s || !s.isActive || !s.endTime) {
      chrome.action.setBadgeText({ text: "" });
      return;
    }

    const remainingSeconds = Math.max(
      0,
      Math.ceil((s.endTime - Date.now()) / 1000),
    );
    const mins = Math.ceil(remainingSeconds / 60);

    // Show "1m" even if 10 seconds left, standard for many extensions
    chrome.action.setBadgeText({ text: `${mins}m` });
    chrome.action.setBadgeBackgroundColor({
      color: s.mode === "focus" ? "#BA4949" : "#38858A",
    });
  });
}

// Update frequently when active
setInterval(updateBadge, 1000);

// Update immediately on state changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.pomodoroState) {
    updateBadge();
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({});
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pomodoro-end") {
    // Optionally: chrome.notifications.create(...)
    updateBadge();
  }
});

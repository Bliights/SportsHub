interface UserPreferences {
  username: string;
  email: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  theme: string;
  fontSize: string;
  language: string;
  dataSharing: boolean;
  adTracking: boolean;
  twoFactorAuth: boolean;
  password: string;
}

const saveButton = document.getElementById('save-button') as HTMLButtonElement;
const usernameInput = document.getElementById('username') as HTMLInputElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const emailNotificationsInput = document.getElementById('email-notifications') as HTMLInputElement;
const smsNotificationsInput = document.getElementById('sms-notifications') as HTMLInputElement;
const pushNotificationsInput = document.getElementById('push-notifications') as HTMLInputElement;
const themeSelect = document.getElementById('theme') as HTMLSelectElement;
const fontSizeSelect = document.getElementById('font-size') as HTMLSelectElement;
const languageSelect = document.getElementById('language') as HTMLSelectElement;
const dataSharingInput = document.getElementById('data-sharing') as HTMLInputElement;
const adTrackingInput = document.getElementById('ad-tracking') as HTMLInputElement;
const twoFactorInput = document.getElementById('two-factor') as HTMLInputElement;
const passwordInput = document.getElementById('password') as HTMLInputElement;

function getUserPreferences(): UserPreferences {
  return {
    username: usernameInput.value,
    email: emailInput.value,
    emailNotifications: emailNotificationsInput.checked,
    smsNotifications: smsNotificationsInput.checked,
    pushNotifications: pushNotificationsInput.checked,
    theme: themeSelect.value,
    fontSize: fontSizeSelect.value,
    language: languageSelect.value,
    dataSharing: dataSharingInput.checked,
    adTracking: adTrackingInput.checked,
    twoFactorAuth: twoFactorInput.checked,
    password: passwordInput.value
  };
}

function savePreferences(preferences: UserPreferences): void {
  localStorage.setItem('userPreferences', JSON.stringify(preferences));
  alert('Preferences saved successfully!');
}

function loadPreferences(): void {
  const savedPreferences = localStorage.getItem('userPreferences');
  if (savedPreferences) {
    const preferences: UserPreferences = JSON.parse(savedPreferences);
    usernameInput.value = preferences.username;
    emailInput.value = preferences.email;
    emailNotificationsInput.checked = preferences.emailNotifications;
    smsNotificationsInput.checked = preferences.smsNotifications;
    pushNotificationsInput.checked = preferences.pushNotifications;
    themeSelect.value = preferences.theme;
    fontSizeSelect.value = preferences.fontSize;
    languageSelect.value = preferences.language;
    dataSharingInput.checked = preferences.dataSharing;
    adTrackingInput.checked = preferences.adTracking;
    twoFactorInput.checked = preferences.twoFactorAuth;
    passwordInput.value = preferences.password;
  }
}

saveButton.addEventListener('click', () => {
  const preferences = getUserPreferences();
  savePreferences(preferences);
});

// Load preferences on page load
window.addEventListener('DOMContentLoaded', loadPreferences);

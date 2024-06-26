export const APP_ID = 'webkit';

export const APP_THEME_PREFIX = 'webkit_';

export const APP_ROOT_ELEMENT_ID = `${APP_ID}-root`;

export const HOST = `${window.location.protocol}//${window.location.host}`;

// The backend url can be changed from "webasyst" to anything.
// Look to getSettingsScript helper in the webkitViewHelper class how it adds settings to the window.webkit object.
// @ts-ignore
export const WA_BACKEND_URL = window.webkitBackendUrls.backendUrl;
// @ts-ignore
export const WA_APP_URL = window.webkitBackendUrls.backendApiUrl;
// @ts-ignore
export const WA_APP_PATH = window.webkitBackendUrls.backendAppStaticUrl;
export const WA_APP_FULL_URL = `${HOST}${WA_APP_URL}`;

export const WA_THEME_MODE_LS_KEY = 'wa_theme_user_mode';
export const WA_THEME_MODE_CHANGE_EVENT_NAME = 'wa-theme-change';

export const HELP_LINKS = {
  VENDOR_URL: 'https://elegantux.com',
  TELEGRAM_CHANNEL: 'https://t.me/webasyst_webkit',
  TELEGRAM_SUPPORT: 'https://t.me/webasyst_webkit_support',
  HELP_EMAIL: 'webasyst@elegantux.com',
};

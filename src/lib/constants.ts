export const APP_ID = 'webkit';

export const APP_ROOT_ELEMENT_ID = `${APP_ID}-root`;

export const HOST = `${window.location.protocol}//${window.location.host}`;

// The backend url can be changed from "webasyst" to anything.
// Look to getSettingsScript helper in the webkitViewHelper class how it adds settings to the window.webkit object.
// @ts-ignore
export const WA_APP_URL = window.webkit.backendApiUrl;
// @ts-ignore
export const WA_APP_PATH = window.webkit.backendAppStaticUrl;

export const EDITOR_COMMANDS = {
  UPDATE_STYLE_MANAGER_PROPERTY: 'update-property',
  UPDATE_TRAIT_MANAGER_PROPERTY: 'update-property',
  UPDATE_TRAIT_MANAGER_PROPERTY_LIST: 'trait-manager:update-property-list',
  TOGGLE_RULE_MANAGER_SIDEBAR: 'rule-manager:toggle-sidebar',
};

export const TRAIT_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  TEXTAREA: 'textarea',
  CHECKBOX: 'checkbox',
  SELECT: 'select',
  BUTTON: 'button',
  CSS_RULE_MANAGER_BUTTON: 'css_rule_manager_button',
  BUTTON_GROUP: 'button_group',
  COLOR: 'color',
  ICON: 'icon',
  IMAGE: 'image',
  CODE_EDITOR: 'code_editor',
  KEY_VALUE: 'key_value',
  CHILD_SELECTOR: 'child_selector',
};

export const DEVICE_TYPE = {
  DESKTOP: 'desktop',
  TABLET: 'tablet',
  MOBILE_PORTRAIT: 'mobilePortrait',
  MOBILE_LANDSCAPE: 'mobileLandscape',
};

export const DEVICE_TYPE_NAME = {
  [DEVICE_TYPE.DESKTOP]: 'Desktop',
  [DEVICE_TYPE.TABLET]: 'Tablet',
  [DEVICE_TYPE.MOBILE_PORTRAIT]: 'Mobile Portrait',
  [DEVICE_TYPE.MOBILE_LANDSCAPE]: 'Mobile Landscape',
};

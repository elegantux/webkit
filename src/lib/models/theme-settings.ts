export type ThemeSettingsStyleLink = { link: string; location: string; attributes: string };
export type ThemeSettingsScriptLink = { link: string; location: string; attributes: string };
export type ThemeSettingsFontLink = { name: string; link: string; location: string; attributes: string };

export interface ThemeSettings {
  id: string;
  style_links: string;
  script_links: string;
  font_links: string;
  custom_head_html: string;
  create_datetime: string;
  update_datetime: string;
}

export type UpdateThemeSettingsPayload = Omit<ThemeSettings, 'id' | 'create_datetime' | 'update_datetime'>;

import { WaPlugin } from '@lib/models/wa-plugin';
import { ThemeSettingsFontLink, ThemeSettingsScriptLink, ThemeSettingsStyleLink } from '@lib/models/theme-settings';

export enum TEMPLATE_SNIPPET_TYPES {
  ELEMENT = 'element',
  COMPONENT = 'component',
  PAGE = 'page',
}

export interface TemplateSnippet {
  categories: string[];
  type: TEMPLATE_SNIPPET_TYPES;
  tags: string[];
  title: string;
  description: string;
  cover_url: string;
  front_content: string;
  front_styles: string;
  front_scripts: string;
  style_links: ThemeSettingsStyleLink[];
  script_links: ThemeSettingsScriptLink[];
  font_links: ThemeSettingsFontLink[];
}

export interface TemplateSnippetListResponse extends WaPlugin {
  snippet_list: TemplateSnippet[];
}

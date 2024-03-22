import { ThemeSettingsScriptLink, ThemeSettingsStyleLink } from '@lib/models/theme-settings';
import { WaPlugin } from '@lib/models/wa-plugin';

export interface TemplateSnippet {
  categories: string[];
  tags: string[];
  title: string;
  description: string;
  cover_url: string;
  front_content: string;
  front_styles: string;
  front_scripts: string;
  style_links: ThemeSettingsStyleLink[];
  script_links: ThemeSettingsScriptLink[];
}

export interface TemplateSnippetListResponse extends WaPlugin {
  snippet_list: TemplateSnippet[];
}

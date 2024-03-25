import { SearchParams } from '@lib/models/response.ts';

export enum TEMPLATE_PROJECT_TEMPLATE_TYPES {
  DEFAULT = 'default',
  LOOP = 'loop',
  INFO_PAGE = 'info_page',
}

export interface TemplateProject {
  wtp_id: string;
  wtp_project_id: string;
  wtp_page_id: string;
  wtp_status: string; // 0 | 1
  wtp_template_type: TEMPLATE_PROJECT_TEMPLATE_TYPES;
  wtp_template_location: string;
}

export interface Template extends TemplateProject {
  id: number;
  name: string;
  cover_url: string;
  front_content: string;
  front_styles: string;
  front_scripts: string;
  editor_components: string; // JSON
  editor_assets: string; // JSON
  editor_styles: string; // JSON
  component_types: string;
  create_datetime: string;
  update_datetime: string;
}

export type CreateTemplatePayload = Omit<TemplateProject, 'wtp_id'> & {
  name: Template['name'];
};

export type UpdateTemplatePayload = {
  name?: Template['name'];
  cover_url?: Template['cover_url'];
  front_content?: Template['front_content'];
  front_styles?: Template['front_styles'];
  front_scripts?: Template['front_scripts'];
  editor_components?: Template['editor_components'];
  editor_assets?: Template['editor_assets'];
  editor_styles?: Template['editor_styles'];
  component_types?: Template['component_types'];
  wtp_id?: Template['wtp_id'];
  wtp_status?: Template['wtp_status'];
};

export type TemplateRequestParams = SearchParams & {
  template_type?: TEMPLATE_PROJECT_TEMPLATE_TYPES;
};

import { SearchParams } from '@lib/models/response';

export enum TEMPLATE_PROJECT_TEMPLATE_TYPES {
  DEFAULT = 'default',
  LOOP = 'loop',
  INFO_PAGE = 'info_page',
}

export enum TEMPLATE_PROJECT_TEMPLATE_LOCATIONS {
  // Site
  SITE_HEADER = 'site_header',
  SITE_FOOTER = 'site_footer',
  SITE_HOME = 'site_home',
  SITE_PAGE = 'site_page',
  SITE_ERROR = 'site_error',
  // Blog
  BLOG_HEADER = 'blog_header',
  BLOG_FOOTER = 'blog_footer',
  BLOG_PAGE = 'blog_page',
  BLOG_POST = 'blog_post',
  BLOG_ARCHIVE = 'blog_archive',
  BLOG_SEARCH = 'blog_search',
  BLOG_EMPTY = 'blog_empty',
  BLOG_ERROR = 'blog_error',
  // Shop
  SHOP_HEADER = 'shop_header',
  SHOP_FOOTER = 'shop_footer',
  SHOP_PAGE = 'shop_page',
  SHOP_HOME = 'shop_home',
  SHOP_CATEGORY = 'shop_category',
  SHOP_SEARCH = 'shop_search',
  SHOP_EMPTY = 'shop_empty',
  SHOP_PRODUCT = 'shop_product',
  SHOP_ORDER = 'shop_order',
  SHOP_ORDER_SUCCESS = 'shop_order_success',
  SHOP_ORDER_ERROR = 'shop_order_error',
  SHOP_ERROR = 'shop_error',
}

export interface TemplateProject {
  wtp_id: string;
  wtp_project_id: string;
  wtp_page_id?: string;
  wtp_status: string; // 0 | 1
  wtp_template_type: TEMPLATE_PROJECT_TEMPLATE_TYPES;
  wtp_template_location: string | null;
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

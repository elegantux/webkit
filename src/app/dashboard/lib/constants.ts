import i18next from 'i18next';

import { TEMPLATE_PROJECT_TEMPLATE_LOCATIONS, Template } from '@lib/models/template';
import { PROJECT_APP_IDS, Project } from '@lib/models/project';

export const TEMPLATE_LOCATION_NAME_MAP: Record<string, string> = {
  // Site
  [TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.SITE_HEADER]: i18next.t('Header'),
  [TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.SITE_FOOTER]: i18next.t('Footer'),
  [TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.SITE_HOME]: i18next.t('Home Page'),
  [TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.SITE_PAGE]: i18next.t('Info Page'),
  [TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.SITE_ERROR]: i18next.t('Error Page'),
  // Blog
  [TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.BLOG_HEADER]: i18next.t('Header'),
  [TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.BLOG_FOOTER]: i18next.t('Footer'),
  [TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.BLOG_PAGE]: i18next.t('Info Page'),
  [TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.BLOG_POST]: i18next.t('Post'),
  [TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.BLOG_ARCHIVE]: i18next.t('Archive'),
  [TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.BLOG_SEARCH]: i18next.t('Search'),
  [TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.BLOG_EMPTY]: i18next.t('Empty Blog'),
  [TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.BLOG_ERROR]: i18next.t('Error Page'),
};

// TODO: Replace hardcoded locations with constant
export const PROJECT_TASKS: Record<
  PROJECT_APP_IDS,
  Array<{ title: string; check: (project: Project, templateList: Template[]) => boolean }>
> = {
  [PROJECT_APP_IDS.SITE]: [
    {
      title: i18next.t('Create Header'),
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'site_header'),
    },
    {
      title: i18next.t('Create Footer'),
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'site_footer'),
    },
    {
      title: i18next.t('Create Home Page'),
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.SITE_HOME),
    },
    {
      title: i18next.t('Create Info Page'),
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'site_page'),
    },
    {
      title: i18next.t('Create 404 Page'),
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'site_error'),
    },
  ],
  [PROJECT_APP_IDS.BLOG]: [
    {
      title: i18next.t('Create Header'),
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'blog_header'),
    },
    {
      title: i18next.t('Create Footer'),
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'blog_footer'),
    },
    {
      title: i18next.t('Create Info Page'),
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'blog_page'),
    },
    {
      title: i18next.t('Create Archive Page'),
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'blog_archive'),
    },
    {
      title: i18next.t('Create Search Page'),
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'blog_search'),
    },
    {
      title: i18next.t('Create Post Page'),
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'blog_post'),
    },
    {
      title: i18next.t('Create Empty Blog Page'),
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'blog_post'),
    },
    {
      title: i18next.t('Create 404 Page'),
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'blog_error'),
    },
  ],
  [PROJECT_APP_IDS.SHOP]: [
    {
      title: i18next.t('Create site header'),
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'shop_header'),
    },
  ],
};

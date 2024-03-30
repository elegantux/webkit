import { TEMPLATE_PROJECT_TEMPLATE_LOCATIONS, Template } from '@lib/models/template';
import { PROJECT_APP_IDS, Project } from '@lib/models/project';

export const TEMPLATE_LOCATION_NAME_MAP: Record<string, string> = {
  // Site
  [TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.SITE_HEADER]: 'Header',
  [TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.SITE_FOOTER]: 'Footer',
  [TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.SITE_PAGE]: 'Info Page',
  [TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.SITE_ERROR]: 'Error Page',
  // Blog
  [TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.BLOG_HEADER]: 'Header',
  [TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.BLOG_FOOTER]: 'Footer',
  [TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.BLOG_PAGE]: 'Info Page',
  [TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.BLOG_POST]: 'Post',
  [TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.BLOG_ARCHIVE]: 'Archive',
  [TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.BLOG_SEARCH]: 'Search',
  [TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.BLOG_EMPTY]: 'Empty Blog',
  [TEMPLATE_PROJECT_TEMPLATE_LOCATIONS.BLOG_ERROR]: 'Empty Error',
};

export const PROJECT_TASKS: Record<
  PROJECT_APP_IDS,
  Array<{ title: string; check: (project: Project, templateList: Template[]) => boolean }>
> = {
  [PROJECT_APP_IDS.SITE]: [
    {
      title: 'Create Header',
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'site_header'),
    },
    {
      title: 'Create Footer',
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'site_footer'),
    },
    {
      title: 'Create Info Page',
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'site_page'),
    },
    {
      title: 'Create 404 Page',
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'site_error'),
    },
  ],
  [PROJECT_APP_IDS.BLOG]: [
    {
      title: 'Create Header',
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'blog_header'),
    },
    {
      title: 'Create Footer',
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'blog_footer'),
    },
    {
      title: 'Create Info Page',
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'blog_page'),
    },
    {
      title: 'Create Archive Page',
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'blog_archive'),
    },
    {
      title: 'Create Search Page',
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'blog_search'),
    },
    {
      title: 'Create Post Page',
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'blog_post'),
    },
    {
      title: 'Create Empty Blog Page',
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'blog_post'),
    },
    {
      title: 'Create 404 Page',
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'blog_error'),
    },
  ],
  [PROJECT_APP_IDS.SHOP]: [
    {
      title: 'Create site header',
      check: (_project: Project, templateList: Template[]) =>
        !!templateList.find((temp) => temp.wtp_template_location === 'shop_header'),
    },
  ],
};

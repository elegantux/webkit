export enum PROJECT_APP_IDS {
  SITE = 'site',
  BLOG = 'blog',
  SHOP = 'shop',
}

type ProjectSettlement = {
  domain: string;
  settlement: string;
  theme: string;
};

export interface Project {
  id: string;
  name: string;
  app_id: PROJECT_APP_IDS;
  theme_id: string;
  theme_settings_id: string;
  preview_image_url: string;
  settlement: ProjectSettlement | null;
  create_datetime: string;
  update_datetime: string;
}

export type CreateProjectPayload = Pick<Project, 'name' | 'app_id' | 'theme_id'>;

export type UpdateProjectPayload = Pick<Project, 'name'>;

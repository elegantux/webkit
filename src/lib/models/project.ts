export interface Project {
  id: string;
  name: string;
  app_id: string;
  theme_id: string;
  theme_settings_id: string;
  preview_image_url: string;
  create_datetime: string;
  update_datetime: string;
}

export type CreateProjectPayload = Pick<Project, 'name' | 'app_id' | 'theme_id'>;

export type UpdateProjectPayload = Pick<Project, 'name'>;

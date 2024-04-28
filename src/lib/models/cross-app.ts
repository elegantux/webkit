import { PROJECT_APP_IDS } from '@lib/models/project';

export interface WebasystApp {
  app_id: string;
  icon: string;
  theme_id_list: string[];
  template_locations: string[];
}

export interface WebasystSettings {
  locale: string;
}

export interface SiteDomain {
  id: number;
  name: string;
  title: string;
  style: string;
  is_alias: boolean;
}

export interface CreateSettlementPayload {
  url: string;
  app: PROJECT_APP_IDS;
  name: string;
  theme: string;
  locale: string;
  private: boolean;
  domain_id: string;
}

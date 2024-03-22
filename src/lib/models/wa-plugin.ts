export interface WaPlugin {
  name: string;
  description: string;
  img: string;
  vendor: string;
  version: string;
  rights: string;
  handlers: Record<string, string>;
  id: string;
  app_id: string;
  build: number;
}

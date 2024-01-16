import { AddComponentTypeOptions, BlockProperties } from 'grapesjs';

import { Template } from '@lib/models/template';

export type PluginComponent = {
  type: string;
  definition: AddComponentTypeOptions;
};

export interface Plugin {
  id: string;
  blocks: BlockProperties[];
  components: PluginComponent[];
}

export interface PluginPayload {
  template: Template;
}

export interface PluginDependencies {
  styles: string[];
  scripts: string[];
}

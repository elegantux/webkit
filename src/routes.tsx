import { createRootRoute, createRoute } from '@tanstack/react-router';

import { Root } from './__root';
import { DashboardLayout } from '@app/dashboard/DashboardLayout';
import { Dashboard } from '@app/dashboard/Dashboard';
import { ProjectListPage } from '@app/dashboard/project/ProjectListPage';
import { ProjectPage } from '@app/dashboard/project/ProjectPage';
import { Editor } from '@app/editor/Editor';
import { SettingsPage } from '@app/dashboard/settings/SettingsPage';
import { MediaPage } from '@app/dashboard/media/MediaPage';
import { PluginsPage } from '@app/dashboard/marketplace/PluginsPage';
import { PageError } from '@ui/atomic/templates/PageError';
import { TEMPLATE_PROJECT_TEMPLATE_TYPES } from '@lib/models/template';

const rootRoute = createRootRoute({
  component: Root,
  errorComponent: PageError,
});

const dashboardLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: 'dashboard',
  component: DashboardLayout,
});

const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'app/editor/$templateId',
  component: Editor,
});

const dashboardRoute = createRoute({
  getParentRoute: () => dashboardLayout,
  path: 'app/dashboard',
  component: Dashboard,
});

const projectListRoute = createRoute({
  getParentRoute: () => dashboardLayout,
  path: 'app/dashboard/project-list',
  component: ProjectListPage,
});

const projectRoute = createRoute({
  getParentRoute: () => dashboardLayout,
  path: 'app/dashboard/project-list/$projectId',
  component: ProjectPage,
  validateSearch: (search: Record<string, any>): { templateType?: TEMPLATE_PROJECT_TEMPLATE_TYPES } => {
    return {
      templateType: search?.templateType,
    };
  },
});

const settingsRoute = createRoute({
  getParentRoute: () => dashboardLayout,
  path: 'app/dashboard/settings',
  component: SettingsPage,
});

const mediaRoute = createRoute({
  getParentRoute: () => dashboardLayout,
  path: 'app/dashboard/media',
  component: MediaPage,
});

const pluginsRoute = createRoute({
  getParentRoute: () => dashboardLayout,
  path: 'app/dashboard/plugins',
  component: PluginsPage,
});

const routeTree = rootRoute.addChildren([
  editorRoute,
  dashboardLayout.addChildren([
    dashboardRoute,
    projectListRoute,
    projectRoute,
    settingsRoute,
    mediaRoute,
    pluginsRoute,
  ]),
]);

export {
  routeTree,
  rootRoute,
  editorRoute,
  dashboardRoute,
  projectListRoute,
  projectRoute,
  settingsRoute,
  mediaRoute,
  pluginsRoute,
};

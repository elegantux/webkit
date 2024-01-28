import { createRootRoute, createRoute } from '@tanstack/react-router';

import { Root } from './__root';
import { DashboardLayout } from '@app/dashboard/DashboardLayout';
import { Dashboard } from '@app/dashboard/Dashboard';
import { ProjectListPage } from '@app/dashboard/project/ProjectListPage';
import { TemplateListPage } from '@app/dashboard/template/TemplateListPage';
import { Editor } from '@app/editor/Editor';

const rootRoute = createRootRoute({
  component: Root,
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
  component: TemplateListPage,
});

const routeTree = rootRoute.addChildren([
  editorRoute,
  dashboardLayout.addChildren([dashboardRoute, projectListRoute, projectRoute]),
]);

export { routeTree, rootRoute, editorRoute, dashboardRoute, projectListRoute, projectRoute };

import { createBrowserRouter } from 'react-router-dom';

import { Editor } from '@app/editor/Editor';
import { Root } from './__root';
import ErrorPage from './__error';
import { appUrl } from '@lib/utils';
import { Dashboard } from '@app/dashboard/Dashboard';
import { DashboardLayout } from '@app/dashboard/DashboardLayout';
import { ProjectListPage } from '@app/dashboard/project/ProjectListPage';
import { TemplateListPage } from '@app/dashboard/template/TemplateListPage';

const BASENAME = appUrl('/app');

export const router = createBrowserRouter(
  [
    {
      path: 'dashboard',
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '',
          element: (
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          ),
        },
        {
          path: 'project-list',
          children: [
            {
              path: '',
              element: (
                <DashboardLayout>
                  <ProjectListPage />
                </DashboardLayout>
              ),
            },
            {
              path: ':id',
              element: (
                <DashboardLayout>
                  <TemplateListPage />
                </DashboardLayout>
              ),
            },
          ],
        },
        {
          path: 'about',
          element: (
            <DashboardLayout>
              <h1>About page</h1>
            </DashboardLayout>
          ),
        },
        {
          path: 'contact',
          element: (
            <DashboardLayout>
              <h1>Contact page</h1>
            </DashboardLayout>
          ),
        },
      ],
    },
    {
      path: 'editor/:id',
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '',
          element: <Editor />,
        },
      ],
    },
  ],
  {
    basename: BASENAME,
  }
);

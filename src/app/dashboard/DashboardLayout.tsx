import { PropsWithChildren } from 'react';
import { Grid, GridItem } from '@chakra-ui/react';

import { DashboardSidebar } from '@app/dashboard/DashboardSidebar';

export function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <Grid
      templateAreas={`"sidebar content"`}
      gridTemplateColumns="256px 1fr"
      height="calc(100vh - 64px)"
    >
      <GridItem
        area="sidebar"
        height="full"
        bg="webasyst.backgroundColor"
      >
        <DashboardSidebar />
      </GridItem>
      <GridItem
        area="content"
        overflowY="auto"
      >
        {children}
      </GridItem>
    </Grid>
  );
}

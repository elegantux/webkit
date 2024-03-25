import { Suspense } from 'react';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import { Outlet } from '@tanstack/react-router';

import { DashboardSidebar } from '@app/dashboard/DashboardSidebar';
import { AppLoadingState } from '@ui/atomic/templates/AppLoadingState';

import Ornament35 from '@assets/decorations/ornament-35.svg?react';
import Ornament73 from '@assets/decorations/ornament-73.svg?react';

export function DashboardLayout() {
  return (
    <Grid
      templateAreas={`"sidebar content"`}
      gridTemplateColumns="256px 1fr"
      height="calc(100vh - 64px)"
      position="relative"
      zIndex="0"
    >
      <GridItem
        area="sidebar"
        height="full"
        bg="webasyst.backgroundColorBlank"
      >
        <DashboardSidebar />
      </GridItem>
      <GridItem
        area="content"
        overflowY="auto"
      >
        <Box
          position="absolute"
          bottom="42px"
          left="310px"
          zIndex={-1}
          color="grey.100"
          _dark={{ color: 'ebony.700' }}
        >
          <Ornament35 />
        </Box>
        <Box
          position="absolute"
          top="-42px"
          right="142px"
          zIndex={-1}
          opacity="0.25"
          color="grey.100"
          transform="rotate(30deg)"
          _dark={{ color: 'ebony.700' }}
        >
          <Ornament73 />
        </Box>
        <Suspense
          fallback={
            <AppLoadingState
              height="auto"
              mt="200px"
            />
          }
        >
          <Outlet />
        </Suspense>
      </GridItem>
    </Grid>
  );
}

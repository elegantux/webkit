import { useEffect } from 'react';
import { Outlet } from '@tanstack/react-router';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, useColorMode } from '@chakra-ui/react';

import { WA_THEME_MODE_CHANGE_EVENT_NAME } from '@lib/constants';
import { useProjectListValidity } from '@lib/state';

export function AppLayout() {
  const { setColorMode } = useColorMode();
  const { invalidProjects } = useProjectListValidity();

  const handleColorModeChange = () =>
    setColorMode(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    // Get Webasyst color mode on first load
    handleColorModeChange();
    // Subscribe for further color mode updates
    document.documentElement.addEventListener(WA_THEME_MODE_CHANGE_EVENT_NAME, handleColorModeChange);
    return () => document.documentElement.removeEventListener(WA_THEME_MODE_CHANGE_EVENT_NAME, handleColorModeChange);
  }, [handleColorModeChange]);

  return (
    <>
      {invalidProjects.length > 0 && (
        <>
          {invalidProjects.map((project) => (
            <Alert
              key={project.id}
              status="error"
              variant="solid"
              zIndex={1}
              position="fixed"
              bottom="0px"
              left="0px"
            >
              <AlertIcon />
              <Box>
                <AlertTitle>Theme folder not found!</AlertTitle>
                <AlertDescription>
                  Cannot find the theme folder for the project &quot;{project.name}&quot;!
                </AlertDescription>
              </Box>
            </Alert>
          ))}
        </>
      )}
      <Outlet />
    </>
  );
}

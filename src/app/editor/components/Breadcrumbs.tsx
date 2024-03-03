import React, { useEffect, useState } from 'react';
import { Component } from 'grapesjs';
import { Box } from '@chakra-ui/react';
import { FaAngleRight } from 'react-icons/fa6';

import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';

export function Breadcrumbs() {
  const [componentBreadcrumbs, setComponentBreadcrumbs] = useState<Component[]>([]);
  const editor = useEditorStore(EDITOR_STORE.EDITOR);

  const handleComponentChange = () => {
    const component = editor.getSelected();
    const parentComponents = component?.parents().reverse() ?? [];

    if (component) {
      parentComponents.push(component);
    }

    setComponentBreadcrumbs(parentComponents);
  };

  const handleBreadcrumbClick = (component: Component) => {
    editor.select(component);
  };

  useEffect(() => {
    editor.on('component:selected', handleComponentChange);
    editor.on('component:deselected', handleComponentChange);
    editor.on('component:drag:end', handleComponentChange);
    editor.on('undo', handleComponentChange);
    editor.on('redo', handleComponentChange);

    return () => {
      editor.off('component:selected', handleComponentChange);
      editor.off('component:deselected', handleComponentChange);
      editor.off('component:remove', handleComponentChange);
      editor.off('component:drag:end', handleComponentChange);
      editor.off('undo', handleComponentChange);
      editor.off('redo', handleComponentChange);
    };
  }, []);

  return (
    <>
      {componentBreadcrumbs.length === 0 && (
        <Box
          fontSize="12px"
          opacity={0.4}
        >
          No selection
        </Box>
      )}
      {componentBreadcrumbs.map((component, index) => (
        <React.Fragment key={component.getId()}>
          <Box
            fontSize="12px"
            whiteSpace="nowrap"
            {...(component.get('selectable')
              ? {
                  cursor: 'pointer',
                  _hover: { color: 'dodger.600' },
                  color: index === componentBreadcrumbs.length - 1 ? 'dodger.800' : 'inherit',
                  opacity: index === componentBreadcrumbs.length - 1 ? 1 : 0.8,
                  onClick:
                    index === componentBreadcrumbs.length - 1 ? undefined : () => handleBreadcrumbClick(component),
                }
              : {
                  opacity: 0.3,
                })}
          >
            {component.getName()}
          </Box>
          {index < componentBreadcrumbs.length - 1 && (
            <FaAngleRight
              style={{ flexShrink: 0 }}
              opacity={0.4}
              size={12}
            />
          )}
        </React.Fragment>
      ))}
    </>
  );
}

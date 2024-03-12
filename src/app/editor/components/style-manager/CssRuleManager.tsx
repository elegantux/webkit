import { useEffect, useState } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { Sector } from 'grapesjs';

import { EDITOR_STORE, useEditorStore, useRuleManagerStore } from '@app/editor/lib/store';

export function CssRuleManager() {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const cssRule = useRuleManagerStore((state) => state.cssRule);

  const [_sectorList, setSectorList] = useState<Sector[]>([]);
  // const setSectorList = useStyleManagerSectorsStore(EDITOR_STORE.SET_SECTOR_LIST);
  const styleManager = editor.StyleManager;
  // const cssRule = editor.Css.getRule(selector);
  const styles = cssRule?.get('style');
  const state = cssRule?.get('state');
  // const sectors = styleManager.getSectors({ visible: true });
  // console.log('RuleManager', cssRule);

  const onStyleChange = () => {
    setSectorList(styleManager.getSectors({ visible: true }));
    // editor.runCommand(EDITOR_COMMANDS.UPDATE_STYLE_MANAGER_PROPERTY);
    // const sec = styleManager.getSectors({ visible: true })?.filter((sector) => sector.id === 'typography');
    // console.log('styleManager.getSectors', sec);
    // setSectorList(sec ?? []);
  };

  useEffect(() => {
    onStyleChange();
  }, []);

  // useEffect(() => {
  //   editor.on('style:custom', onStyleChange);
  //   editor.on('undo', onStyleChange);
  //   editor.on('redo', onStyleChange);
  //
  //   return () => {
  //     editor.off('style:custom', onStyleChange);
  //     editor.off('undo', onStyleChange);
  //     editor.off('redo', onStyleChange);
  //   };
  // }, [editor]);

  return (
    <>
      <Box p={4}>
        Target: {cssRule?.getSelectorsString()}
        <br />
        {state}
        <br />
        {JSON.stringify(styles)}
      </Box>
      <Heading
        p={4}
        size="md"
      >
        Work in progress
      </Heading>
      {/* <Accordion */}
      {/*  defaultIndex={[0, 1, 2]} */}
      {/*  allowMultiple */}
      {/* > */}
      {/*  {sectorList.map((sector) => ( */}
      {/*    <React.Fragment key={sector.getId()}> */}
      {/*      <StyleSector sector={sector} /> */}
      {/*    </React.Fragment> */}
      {/*  ))} */}
      {/* </Accordion> */}
    </>
  );
}

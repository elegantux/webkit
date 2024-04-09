import { Box, Image } from '@chakra-ui/react';
import { CssRule, Editor } from 'grapesjs';

import { ExtendedBlock, ExtendedProperty } from '@lib/models/grapesjs-extended';

export const getBlockMedia = (block: ExtendedBlock) => {
  if (block.attributes.image?.length) {
    return (
      <Image
        src={block.attributes.image}
        alt={block.getLabel()}
        height="full"
        borderRadius="6px"
        objectFit="cover"
      />
    );
  }

  if (block.attributes.icon?.length) {
    return <Box dangerouslySetInnerHTML={{ __html: block.attributes.icon }} />;
  }

  return block.getLabel();
};

export const getPropertyValue = (property: ExtendedProperty) =>
  property.hasValue() ? (property.getValue() as string) : property.getDefaultValue();

export const propertyHasParentValue = (property: ExtendedProperty) => {
  const parent = property.getParent();
  return property.hasValueParent() && (parent ? parent.isDetached() : true);
};

/**
 * This function allows to re-assign styles from the component ID selector to component class names.
 * This function only makes sense in componentFirs mode - https://grapesjs.com/docs/modules/Selectors.html#component-first-selectors
 * The implementation is taken from the original source with adaptation to the project - https://github.com/GrapesJS/grapesjs/blob/dev/src/selector_manager/view/ClassTagsView.ts#L103
 * @param editor
 */
export const syncStyle = (editor: Editor) => {
  const em = editor.EditorModel;
  const target = em.getSelected();
  const targets = em.getSelectedAll();
  const cssC = em.Css;
  const opts = { noDisabled: 1 };
  const selectors = em.Selectors.__getCommonSelectors(targets, { opts });
  const state = em.get('state');
  const mediaText = em.getCurrentMedia();
  const ruleComponents: CssRule[] = [];
  const rule = cssC.get(selectors, state, mediaText) || cssC.add(selectors, state, mediaText);
  let style;

  targets.forEach((component) => {
    const ruleComponent = cssC.getIdRule(component.getId(), {
      state,
      mediaText,
    })!;
    style = ruleComponent.getStyle();
    ruleComponent.setStyle({});
    ruleComponents.push(ruleComponent);
  });

  if (style) {
    rule.addStyle(style);
  }
  em.trigger('component:toggled');
  em.trigger('component:sync-style', {
    component: target,
    selectors,
    mediaText,
    rule,
    ruleComponents,
    state,
  });
};

/**
 * This function checks if there are styles assigned to the component ID
 * that can be re-assigned to the class name if the class name exists.
 * This function only makes sense in componentFirs mode - https://grapesjs.com/docs/modules/Selectors.html#component-first-selectors
 * The implementation is taken from the original source with adaptation to the project - https://github.com/GrapesJS/grapesjs/blob/dev/src/selector_manager/view/ClassTagsView.ts#L230
 * @param editor
 */
export const checkSync = (editor: Editor) => {
  const collection = editor.SelectorManager.getSelected();
  const target = editor.getSelected();
  const componentFirst = editor.SelectorManager.getComponentFirst();

  let hasStyle;

  if (target && componentFirst && collection.length) {
    const style = target.getStyle();
    hasStyle = Object.keys(style).length > 0;
  }
  return hasStyle;
};

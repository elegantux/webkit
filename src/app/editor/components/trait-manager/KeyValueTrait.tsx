import { useEffect, useState } from 'react';
import { Trait } from 'grapesjs';
import { Box, Button, Flex, Input, Tag, TagCloseButton, TagLabel, Text } from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa6';

import { EDITOR_COMMANDS } from '@app/editor/lib/constant';
import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';
import { PropertyHeader } from '../style-manager/components/PropertyHeader';

type KeyValue = { key: string; value: string };

const parseAttributesStringToArray = (attributesString: string) => {
  if (attributesString.trim().length === 0) {
    return [];
  }

  const attributesArray = attributesString.split(/\s+(?=[a-z-]+=)/).map((attribute) => {
    const [key, value] = attribute.split('=');
    return { key, value: value.replace(/"/g, '') }; // Removing double quotes from the value
  });
  return attributesArray;
};

const convertArrayToAttributesString = (attributesArray: KeyValue[]) => {
  const attributesString = attributesArray
    .map((attribute) => {
      return `${attribute.key}="${attribute.value}"`;
    })
    .join(' ');
  return attributesString;
};

function KeyValueList({ list, onRemove }: { list: KeyValue[]; onRemove: (item: KeyValue) => void }) {
  return (
    <Flex
      gap="4px"
      flexWrap="wrap"
    >
      {list.map((item) => (
        <Tag
          key={item.key}
          size="sm"
          variant="solid"
          colorScheme="grey"
          pl="6px"
          pr="2px"
        >
          <TagLabel>
            {item.key}={item.value}
          </TagLabel>
          <TagCloseButton
            fontSize="md"
            onClick={() => onRemove(item)}
          />
        </Tag>
      ))}
    </Flex>
  );
}

export function KeyValueTrait({ trait }: { trait: Trait }) {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const [values, setValues] = useState<KeyValue[]>(parseAttributesStringToArray(trait.getValue()));
  const [inputValues, setInputValues] = useState({ key: '', value: '' });

  const component = editor.getSelected();
  const traitName = trait.getName();
  const traitLabel = trait.getLabel();
  const traitDefaultValue = trait.getDefault() ?? '';
  // @ts-ignore
  const ignoreKeys: string[] = trait.get('ignoreKeys') ?? [];

  const ignoredKeysUsed = ignoreKeys.includes(inputValues.key);
  const isValid = Object.values(inputValues).every((item) => item.trim().length > 0) && !ignoredKeysUsed;

  const updateTraitValue = (v: string) => {
    component?.set(traitName, v);
    trait.setValue(v);
  };

  const handleAddKeyValue = () => {
    const item: KeyValue = { key: inputValues.key, value: inputValues.value };
    const updatedValues = [...values, item];

    updateTraitValue(convertArrayToAttributesString(updatedValues));
    setValues(updatedValues);
    setInputValues({ key: '', value: '' });
  };

  const handleKeyValueRemove = (item: KeyValue) => {
    const filteredValues = values.filter((value) => value.key !== item.key);

    updateTraitValue(convertArrayToAttributesString(filteredValues));
    setValues(filteredValues);
  };

  const handleClearButton = () => {
    updateTraitValue(traitDefaultValue);
    setValues(traitDefaultValue);
  };

  const updateProperty = () => {
    const lastSelectedComponent = editor.getSelected();
    const traitValue = lastSelectedComponent?.getTrait(trait.getId())?.getValue();
    if (typeof traitValue === 'string') {
      setValues(parseAttributesStringToArray(traitValue));
    } else {
      setValues([]);
    }
  };

  // Update state when:
  // 1. selected
  // 2. deselected
  // 3. removed
  useEffect(() => {
    editor.on(`run:${EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY}`, updateProperty);

    return () => {
      editor.off(`run:${EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY}`, updateProperty);
    };
  }, [editor]);

  return (
    <Box key={trait.getId()}>
      <PropertyHeader
        onClear={handleClearButton}
        propertyLabel={traitLabel}
        hasValue={values.length > 0}
      />
      <Flex
        direction="column"
        gap="12px"
        borderRadius="6px"
      >
        {values.length > 0 && (
          <KeyValueList
            list={values}
            onRemove={handleKeyValueRemove}
          />
        )}
        <Box>
          <Flex
            alignItems="center"
            gap="6px"
            sx={{ '& > input[type="text"]': { mr: '0px' } }}
          >
            <Input
              type="text"
              value={inputValues.key}
              onChange={(event) => setInputValues((prevState) => ({ ...prevState, key: event.target.value }))}
              size="sm"
              borderRadius="6px"
            />
            :
            <Input
              type="text"
              value={inputValues.value}
              onChange={(event) => setInputValues((prevState) => ({ ...prevState, value: event.target.value }))}
              size="sm"
              borderRadius="6px"
            />
          </Flex>
          {ignoredKeysUsed && (
            <Text
              fontSize="13px"
              color="scarlet.500"
            >
              These keys are not allowed: {ignoreKeys.join(', ')}
            </Text>
          )}
        </Box>
        <Button
          variant="outline"
          size="sm"
          isDisabled={!isValid}
          onClick={handleAddKeyValue}
        >
          <FaPlus size={14} />
        </Button>
      </Flex>
    </Box>
  );
}

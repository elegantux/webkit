import { useEffect, useState } from 'react';
import { Trait } from 'grapesjs';
import { Box, Button, Flex, Input, Tag, TagCloseButton, TagLabel, Text } from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa6';

import { PropertyHeader } from '../style-manager/components/PropertyHeader';
import { useTraitProperty } from '@app/editor/components/trait-manager/lib/utils';

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
  const [values, setValues] = useState<KeyValue[]>([]);
  const [inputValues, setInputValues] = useState({ key: '', value: '' });
  const { setValue, updateTraitValue, clearTraitValue, traitLabel, traitDefaultValue } = useTraitProperty<
    string | undefined
  >(trait, '');

  // @ts-ignore
  const ignoreKeys: string[] = trait.get('ignoreKeys') ?? [];

  const ignoredKeysUsed = ignoreKeys.includes(inputValues.key);
  const isValid =
    values.every((item) => item.key !== inputValues.key) &&
    Object.values(inputValues).every((item) => item.trim().length > 0) &&
    !ignoredKeysUsed;

  const handleAddKeyValue = () => {
    const item: KeyValue = { key: inputValues.key, value: inputValues.value };
    const updatedValues = [...values, item];

    const convertedValue = convertArrayToAttributesString(updatedValues);
    updateTraitValue(convertedValue);
    setValues(updatedValues);
    setInputValues({ key: '', value: '' });
    setValue(convertedValue);
  };

  const handleKeyValueRemove = (item: KeyValue) => {
    const filteredValues = values.filter((v) => v.key !== item.key);

    const convertedValue = convertArrayToAttributesString(filteredValues);
    updateTraitValue(convertedValue);
    setValues(filteredValues);
    setValue(convertedValue);
  };

  const handleClearButton = () => {
    clearTraitValue();
    setValues(traitDefaultValue);
  };

  useEffect(() => {
    const traitValue = trait.getValue();
    setValue(traitValue);
    setValues(parseAttributesStringToArray(traitValue));
  }, [trait]);

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
              placeholder="name"
              value={inputValues.key}
              onChange={(event) => setInputValues((prevState) => ({ ...prevState, key: event.target.value }))}
              size="sm"
              borderRadius="6px"
            />
            :
            <Input
              type="text"
              placeholder="value"
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

import {
  Editable,
  EditableInput,
  EditablePreview,
  Input,
  Tag,
  TagLabel,
  TagLeftIcon,
  useDisclosure,
  useEditableControls,
} from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa6';
import { useState } from 'react';

function EditableControls() {
  const { isEditing, getEditButtonProps } = useEditableControls();

  if (isEditing) {
    return null;
  }

  return (
    <Tag
      size="sm"
      borderRadius="6px"
      variant="solid"
      colorScheme="grey"
      cursor="pointer"
      userSelect="none"
      {...getEditButtonProps()}
    >
      <TagLeftIcon as={FaPlus} />
      <TagLabel>Add</TagLabel>
    </Tag>
  );
}

export function AddSelectorButton({ onSubmit }: { onSubmit: (selector: string) => void }) {
  const [value, setValue] = useState('');

  const disclosure = useDisclosure();

  const handleSubmit = (v: string) => {
    onSubmit(v);
    setValue('');
    disclosure.onClose();
  };

  const handleCancel = () => {
    disclosure.onClose();
  };

  return (
    <Editable
      display="flex"
      fontSize="sm"
      value={value}
      onChange={setValue}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isPreviewFocusable={false}
    >
      <EditableControls />
      <EditablePreview />
      <Input
        size="xs"
        borderRadius="6px"
        height="20px"
        as={EditableInput}
      />
    </Editable>
  );
}

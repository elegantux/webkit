import { Input, Textarea } from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';
import { Component, Trait } from 'grapesjs';

import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';

function InputTrait({ trait, component }: { trait: Trait; component: Component | null }) {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    // trait.set({ [trait.getName()]: event.target.value });
    // console.log('event.target.value', event.target.value);
    component?.set(trait.getName(), event.target.value);
  };

  return <Input onInput={onChange} />;
}

function TextareaTrait({ trait, component }: { trait: Trait; component: Component | null }) {
  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    // trait.set({ [trait.getName()]: event.target.value });
    // console.log('event.target.value', event.target.value);
    component?.set(trait.getName(), event.target.value);
  };

  return <Textarea onInput={onChange} />;
}

export function TraitManager() {
  const [traitList, setTraitList] = useState<Trait[]>([]);
  const [component, setComponent] = useState<Component | null>(null);
  const editor = useEditorStore(EDITOR_STORE.EDITOR);

  editor.on(`component:selected`, (model) => {
    const componentTraitList = model.get('traits');
    setTraitList(componentTraitList);
    setComponent(model);

    // console.log(
    //   'selected component type => ',
    //   componentTraitList.map((trait) => trait.getName())
    // );
  });

  return (
    <ul>
      {traitList.map((trait) => (
        <li key={trait.getName()}>
          {trait.getLabel()}
          {trait.getName()}
          {trait.getType() === 'text' && (
            <InputTrait
              trait={trait}
              component={component}
            />
          )}
          {trait.getType() === 'number' && (
            <TextareaTrait
              trait={trait}
              component={component}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = "basic_button";
    const COMPONENT_NAME = "Button";
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Basic';

    const LINK_TRAITS = [
      {
        type: 'text',
        label: 'Link URL',
        placeholder: 'https://elegantux.com',
        name: 'href',
        default: '',
      },
      {
        type: 'select',
        label: 'Target',
        name: 'target',
        default: '_self',
        options: [
          { value: '_blank', label: '_blank'},
          { value: '_self', label: '_self'},
          { value: '_parent', label: '_parent'},
          { value: '_top', label: '_top'},
        ],
      },
    ];

    const BUTTON_TRAITS = [
      {
        type: 'select',
        label: 'Button Type',
        name: 'type',
        default: 'button',
        options: [
          { value: 'button', label: 'Button'},
          { value: 'submit', label: 'Submit'},
        ],
      },
    ];

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          attributes: {
            [DATA_KEY]: COMPONENT_TYPE,
            href: '',
            target: '_self',
          },
          tagName: 'a',
          droppable: `[${DATA_KEY}=basic_text], [${DATA_KEY}=basic_icon]`,
          style: {
            'display': 'inline-block',
            'width': 'max-content',
            'padding-left': '24px',
            'padding-right': '24px',
            'padding-top': '18px',
            'padding-bottom': '18px',
            'font-size': '16px',
            'color': '#ffffffff',
            'background-color': '#000000ff',
            'text-decoration': 'none',
            'border': 'none',
            'outline': 'none',
            'cursor': 'pointer',
          },
          components: {
            type: 'basic_text',
            components: 'Click Me',
            editable: true,
          },

          // Traits
          traits: [
            {
              type: 'select',
              label: 'Tag Name',
              name: 'tagName',
              default: 'a',
              options: [
                { value: 'a', label: 'Link'},
                { value: 'button', label: 'Button'},
              ],
            },
            ...LINK_TRAITS,
          ],
        },
      },
      view: {
        init({ model }) {
          this.listenTo(model, 'change:tagName', this.handleTagNameChange);
        },
        updateTraits(oldList, newList) {
          const linkAttributes = newList.reduce((acc, curr) => (acc[curr.name] = curr.default, acc), {});

          this.model
            // Remove Link attributes
            .removeAttributes(oldList.map((trait) => trait.name))
            // Add Button attributes
            .addAttributes(linkAttributes);

          // Remove Link traits
          this.model.removeTrait(oldList.map((trait) => trait.name));
          // Add Link traits
          this.model.addTrait(newList);
        },
        handleTagNameChange() {
          const tagName = this.model.get('tagName');

          if (tagName === 'a') {
            this.updateTraits(BUTTON_TRAITS, LINK_TRAITS);
          } else {
            this.updateTraits(LINK_TRAITS, BUTTON_TRAITS);
          }

          // Update Traits UI
          editor.runCommand('trait-manager:update-property-list');
        },
      }
    };

    const block = {
      id: COMPONENT_TYPE,
      label: COMPONENT_NAME,
      category: CATEGORY,
      icon: `<svg width="100%" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="4.5" width="19" height="9" rx="1.5" stroke="currentColor"/>
    <path d="M13.7765 12.9086L14.0467 18.8189L15.6192 16.8602L18.1304 16.9146L13.7765 12.9086Z" stroke="currentColor" stroke-width="0.546144" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15.7 17.0334L16.854 19.5084" stroke="currentColor" stroke-width="0.546144" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
      content: { type: COMPONENT_TYPE, },
      activate: true,
    };

    editor.Blocks.add(COMPONENT_TYPE, block);
    editor.DomComponents.addType(COMPONENT_TYPE, component);

    return {};
  }

  webkit.plugins.add(plugin);

})(window.webkit);

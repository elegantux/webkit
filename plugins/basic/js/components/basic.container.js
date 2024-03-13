((webkit) => {
  const parseAttributesStringToArray = (attributesString) => {
    if (attributesString.trim().length === 0) {
      return [];
    }
  
    const attributesArray = attributesString.split(/\s+(?=[a-z-]+=)/).map((attribute) => {
      const [key, value] = attribute.split('=');
      return { key, value: value.replace(/"/g, '') }; // Removing double quotes from the value
    });
    return attributesArray;
  };
  
  async function plugin(editor) {
    const COMPONENT_TYPE = "basic_container";
    const COMPONENT_NAME = "Container";
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Basic';
    const DEFAULT_ATTRIBUTES = { [DATA_KEY]: COMPONENT_TYPE, class: COMPONENT_TYPE };

    const TRAITS = {
      CUSTOM_ATTRIBUTES: 'custom_attributes',
    };

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          attributes: DEFAULT_ATTRIBUTES,
          tagName: 'section',
          style: {
            'width': '100%',
            'max-width': '1200px',
            'padding-top': '24px',
            'padding-bottom': '24px',
            'padding-left': '24px',
            'padding-right': '24px',
            'margin-left': 'auto',
            'margin-right': 'auto',
          },
          resizable: true,

          // Traits
          [TRAITS.CUSTOM_ATTRIBUTES]: '',
          traits: [
            {
              type: 'select',
              label: 'Tag Name',
              name: 'tagName',
              default: 'section',
              changeProp: true,
              options: [
                { value: 'header', label: 'Header'},
                { value: 'footer', label: 'Footer'},
                { value: 'section', label: 'Section'},
                { value: 'article', label: 'Article'},
                { value: 'main', label: 'Main'},
                { value: 'div', label: 'Div'},
              ],
            },
            {
              type: 'key_value',
              label: 'Tag Attributes',
              name: TRAITS.CUSTOM_ATTRIBUTES,
              // default: '',
              changeProp: true,
              ignoreKeys: ['id', 'class', 'data-gjs-type', DATA_KEY],
            }
          ],
        },
        init() {
          this.on(`change:${TRAITS.CUSTOM_ATTRIBUTES}`, this.handleCustomAttibuteChange);
        },
        handleCustomAttibuteChange() {
          const customAttributes = this.get(TRAITS.CUSTOM_ATTRIBUTES);
          const attributeList = parseAttributesStringToArray(customAttributes);
          const resultAttributes = DEFAULT_ATTRIBUTES;

          attributeList.forEach((item) => {
            resultAttributes[item.key] = item.value;
          });
          
          this.setAttributes(resultAttributes);
        }
      },
    };

    const block = {
      id: COMPONENT_TYPE,
      label: COMPONENT_NAME,
      category: CATEGORY,
      icon: `<svg width="100%" height="42px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="4.5" width="23" height="15" rx="1.5" stroke="currentColor"/>
    <path d="M3 7H4" stroke="currentColor" stroke-linecap="round"/>
    <path d="M3 17H4" stroke="currentColor" stroke-linecap="round"/>
    <path d="M20 7H21" stroke="currentColor" stroke-linecap="round"/>
    <path d="M20 17H21" stroke="currentColor" stroke-linecap="round"/>
    <path d="M7 7H10" stroke="currentColor" stroke-linecap="round"/>
    <path d="M7 17H10" stroke="currentColor" stroke-linecap="round"/>
    <path d="M14 7L17 7" stroke="currentColor" stroke-linecap="round"/>
    <path d="M14 17H17" stroke="currentColor" stroke-linecap="round"/>
    <path d="M3 7V7.5V8" stroke="currentColor" stroke-linecap="round"/>
    <path d="M3 16V16.5V17" stroke="currentColor" stroke-linecap="round"/>
    <path d="M21 7V7.5V8" stroke="currentColor" stroke-linecap="round"/>
    <path d="M21 16V16.5V17" stroke="currentColor" stroke-linecap="round"/>
</svg>`,
      content: { type: COMPONENT_TYPE, },
      activate: true,
    };

    editor.Blocks.add(COMPONENT_TYPE, block);
    editor.DomComponents.addType(COMPONENT_TYPE, component);

    return {};
  }

  webkit.plugins.add(plugin);

})(window.webkit);

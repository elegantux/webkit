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
    const COMPONENT_TYPE = "basic_box";
    const COMPONENT_NAME = "Box";
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Basic';
    const DEFAULT_ATTRIBUTES = { [DATA_KEY]: COMPONENT_TYPE, class: COMPONENT_TYPE };
    const BLOCK_ICON_HTML = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="48px" viewBox="0 0 24 24" fill="none">
    <path d="M20 15.4426V8.33151C19.9997 8.01975 19.9174 7.71356 19.7614 7.44365C19.6054 7.17375 19.3811 6.94961 19.1111 6.79373L12.8889 3.23818C12.6186 3.08214 12.3121 3 12 3C11.6879 3 11.3814 3.08214 11.1111 3.23818L4.88889 6.79373C4.6189 6.94961 4.39465 7.17375 4.23863 7.44365C4.08262 7.71356 4.00032 8.01975 4 8.33151V15.4426C4.00032 15.7544 4.08262 16.0606 4.23863 16.3305C4.39465 16.6004 4.6189 16.8245 4.88889 16.9804L11.1111 20.536C11.3814 20.692 11.6879 20.7741 12 20.7741C12.3121 20.7741 12.6186 20.692 12.8889 20.536L19.1111 16.9804C19.3811 16.8245 19.6054 16.6004 19.7614 16.3305C19.9174 16.0606 19.9997 15.7544 20 15.4426Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4.23999 7.40698L12 11.8959L19.76 7.40698" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 20.8472V11.8872" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
    const PLACEHOLDER_HTML = `
    <div class="${COMPONENT_TYPE}-placeholder" style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen-Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 24px;">
      ${BLOCK_ICON_HTML}
      <h5 style="margin: 0; font-size: 24px;">${COMPONENT_NAME}</h5>
      <p style="margin: 0; font-size: 14px;">Drag&Drop something inside me!</p>
    </div>`;

    const TRAITS = {
      CUSTOM_ATTRIBUTES: 'custom_attributes',
    };

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          attributes: { ...DEFAULT_ATTRIBUTES },
          tagName: 'div',
          resizable: true,

          // Traits
          [TRAITS.CUSTOM_ATTRIBUTES]: '',
          traits: [
            {
              type: 'select',
              label: 'Tag Name',
              name: 'tagName',
              default: 'div',
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
          this.on(`change:${TRAITS.CUSTOM_ATTRIBUTES}`, this.handleCustomAttributeChange);
        },
        handleCustomAttributeChange() {
          const customAttributes = this.get(TRAITS.CUSTOM_ATTRIBUTES);
          const attributeList = parseAttributesStringToArray(customAttributes);
          const resultAttributes = { ...DEFAULT_ATTRIBUTES };

          attributeList.forEach((item) => {
            resultAttributes[item.key] = item.value;
          });
          this.setAttributes(resultAttributes);
        },
      },
      view: {
        init({ model }) {
          const children = model.components();
          this.listenTo(children, 'add remove', this.handleComponentsChange);
        },
        handleComponentsChange(target, components, event) {
          if (components.length > 0) {
            this.el.querySelector(`.${COMPONENT_TYPE}-placeholder`)?.remove();
          } else {
            this.el.innerHTML = PLACEHOLDER_HTML;
          }
        },
        onRender({ model, el }) {
          if (model.components().length === 0) {
            this.el.innerHTML = PLACEHOLDER_HTML;
          }
        },
      }
    };

    const block = {
      id: COMPONENT_TYPE,
      label: COMPONENT_NAME,
      category: CATEGORY,
      icon: BLOCK_ICON_HTML,
      content: { type: COMPONENT_TYPE, },
      activate: true,
    };

    editor.Blocks.add(COMPONENT_TYPE, block);
    editor.DomComponents.addType(COMPONENT_TYPE, component);

    return {};
  }

  webkit.plugins.add(plugin);

})(window.webkit);

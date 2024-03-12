((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = "basic_text";
    const COMPONENT_NAME = "Text Editor";
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Basic';

    const component = {
      extend: 'text',
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          attributes: { [DATA_KEY]: COMPONENT_TYPE, class: COMPONENT_TYPE },
          style: { 'font-size': '16px', 'margin-top': '0px', 'margin-bottom': '0px' },
          tagName: 'p',
          components: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
          editable: true,

          // Traits
          traits: [],
        },
      },
    };

    const block = {
      id: COMPONENT_TYPE,
      label: COMPONENT_NAME,
      category: CATEGORY,
      icon: `<svg width="100%" height="42px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 5H20" stroke="currentColor" stroke-linecap="round"/>
    <path d="M1 8H14" stroke="currentColor" stroke-linecap="round"/>
    <path d="M1 20H14" stroke="currentColor" stroke-linecap="round"/>
    <path d="M1 11H20" stroke="currentColor" stroke-linecap="round"/>
    <path d="M1 17H20" stroke="currentColor" stroke-linecap="round"/>
    <path d="M1 14H14" stroke="currentColor" stroke-linecap="round"/>
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

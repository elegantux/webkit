((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = "basic_container";
    const COMPONENT_NAME = "Container";
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Basic';

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          attributes: { [DATA_KEY]: COMPONENT_TYPE },
          style: { 'padding-top': '12px', 'padding-bottom': '12px' },
          resizable: true,

          traits: [],
        },
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

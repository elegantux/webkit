((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = "basic_link";
    const COMPONENT_NAME = "Link";
    const DATA_KEY = "data-wk-type";
    const CATEGORY = "Basic";

    const component = {
      extend: 'link',
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          tagName: "a",
          attributes: {
            [DATA_KEY]: COMPONENT_TYPE,
            href: '',
          },
          content: 'Click me!',

          // Traits
          traits: [
            {
              type: 'text',
              label: 'Link URL',
              name: 'href',
            },
            {
              type: 'text',
              label: 'Title',
              name: 'title',
            },
            {
              type: 'select',
              label: 'Target',
              name: 'target',
              options: [
                { label: 'This window', value: '' },
                { label: 'New window', value: '_blank' },
              ],
              default: '',
            },
          ],
        },
      },
    };

    const block = {
      id: COMPONENT_TYPE,
      label: COMPONENT_NAME,
      category: CATEGORY,
      icon: `<svg width="100%" height="42px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.0833 12.7083C10.3874 13.115 10.7755 13.4515 11.2212 13.695C11.6669 13.9385 12.1597 14.0833 12.6663 14.1196C13.1729 14.1559 13.6813 14.0828 14.1571 13.9053C14.633 13.7278 15.065 13.45 15.4241 13.0908L17.5491 10.9658C18.1942 10.2979 18.5512 9.40325 18.5431 8.47464C18.5351 7.54602 18.1626 6.65773 17.5059 6.00108C16.8493 5.34442 15.961 4.97195 15.0324 4.96388C14.1038 4.95581 13.2091 5.31279 12.5412 5.95793L11.3228 7.16918" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12.9168 11.2916C12.6126 10.8849 12.2245 10.5485 11.7788 10.305C11.3332 10.0615 10.8403 9.91667 10.3338 9.88039C9.8272 9.84411 9.31877 9.9172 8.84294 10.0947C8.36711 10.2722 7.93502 10.5499 7.57598 10.9091L5.45097 13.0341C4.80583 13.7021 4.44885 14.5967 4.45692 15.5253C4.46499 16.4539 4.83746 17.3422 5.49412 17.9989C6.15077 18.6556 7.03907 19.028 7.96768 19.0361C8.89629 19.0442 9.79093 18.6872 10.4589 18.042L11.6701 16.8308" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
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

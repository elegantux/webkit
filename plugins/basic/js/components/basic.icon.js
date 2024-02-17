((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = "basic_icon";
    const COMPONENT_NAME = "Icon";
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Basic';

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          attributes: {
            [DATA_KEY]: COMPONENT_TYPE,
            class: 'fa-solid fa-cart-shopping',
          },
          style: { 'font-size': '24px' },
          tagName: 'i',
          editable: false,
          droppable: false,

          // Traits
          traits: [
            {
              type: 'icon',
              label: 'Icon',
              name: 'class',
            },
          ],
        },
      },
    };

    const block = {
      id: COMPONENT_TYPE,
      label: COMPONENT_NAME,
      category: CATEGORY,
      icon: `<svg width="100%" height="52px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="7.5" stroke="currentColor"/>
    <path d="M11.7147 6.87812C11.8045 6.60172 12.1955 6.60172 12.2853 6.87812L13.2797 9.9386C13.3199 10.0622 13.4351 10.1459 13.565 10.1459H16.783C17.0737 10.1459 17.1945 10.5178 16.9594 10.6886L14.356 12.5801C14.2508 12.6565 14.2068 12.7919 14.247 12.9155L15.2414 15.976C15.3312 16.2524 15.0149 16.4822 14.7797 16.3114L12.1763 14.4199C12.0712 14.3435 11.9288 14.3435 11.8237 14.4199L9.22026 16.3114C8.98514 16.4822 8.6688 16.2524 8.75861 15.976L9.75302 12.9155C9.79318 12.7919 9.74918 12.6565 9.64404 12.5801L7.04063 10.6886C6.80552 10.5178 6.92635 10.1459 7.21697 10.1459H10.435C10.5649 10.1459 10.6801 10.0622 10.7203 9.9386L11.7147 6.87812Z" fill="currentColor"/>
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

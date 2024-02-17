((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = "basic_image";
    const COMPONENT_NAME = "Image";
    const DATA_KEY = "data-wk-type";
    const CATEGORY = "Basic";

    // Remove build-in image component functionality
    editor.DomComponents.removeType('image');
    editor.on('canvas:drop', (dataTransfer, components) => {
      if (Array.isArray(components)) {
        components.map((component) => {
          if (component.get('type') === 'image') {
            component.remove();
          }
        });
      } else if (components && components.get('type') === 'image') {
        components?.remove();
      }
    });

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          attributes: { [DATA_KEY]: COMPONENT_TYPE, src: '/wa-apps/webkit/plugins/basic/img/dummy-image.webp' },
          tagName: "img",
          style: { 'width': '200px' },
          droppable: false,

          // Traits
          traits: [
            {
              type: 'image',
              label: 'Image',
              name: 'src',
              default: '/wa-apps/webkit/plugins/basic/img/dummy-image.webp',
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
    <g clip-path="url(#clip0_1182_339)">
        <path d="M24 17.4348L17.0632 8.20318C16.6781 7.69073 15.8589 7.80798 15.6025 8.39547C14.7509 10.347 13.0032 13.6678 10.9318 13.7826C9.74349 13.8485 8.77314 12.7823 8.13102 11.7853C7.69869 11.114 6.65558 11.0031 6.19455 11.655L1 19" stroke="currentColor"/>
        <rect x="4.5" y="7.5" width="2" height="2" rx="1" stroke="currentColor"/>
    </g>
    <rect x="0.5" y="4.5" width="23" height="15" rx="1.5" stroke="currentColor"/>
    <defs>
        <clipPath id="clip0_1182_339">
            <rect y="4" width="24" height="16" rx="2" fill="white"/>
        </clipPath>
    </defs>
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

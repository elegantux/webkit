((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = "basic_link_box";
    const COMPONENT_NAME = "Link Box";
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
          style: {
            'display': 'block',
            'min-height': '200px',
            'min-width': '200px',
            'text-decoration': 'none',
          },
          droppable: true,
          components: [
            { type: 'basic_image' },
            { type: 'basic_heading', tagName: 'h4' },
            { type: 'basic_text', tagName: 'p' },
          ],

          // Traits
          traits: [
            {
              type: 'text',
              label: 'Box URL',
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
    <rect x="0.5" y="4.5" width="23" height="15" rx="1.5" stroke="currentColor"/>
    <path d="M10.7788 12.3626C10.9339 12.57 11.1319 12.7416 11.3592 12.8658C11.5865 12.99 11.8378 13.0638 12.0962 13.0823C12.3545 13.1008 12.6138 13.0635 12.8565 12.973C13.0992 12.8825 13.3195 12.7408 13.5026 12.5577L14.5864 11.4739C14.9154 11.1333 15.0975 10.677 15.0934 10.2034C15.0892 9.7298 14.8993 9.27677 14.5644 8.94188C14.2295 8.60699 13.7765 8.41703 13.3029 8.41291C12.8293 8.40879 12.373 8.59085 12.0323 8.91988L11.411 9.53761" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12.224 11.6401C12.0689 11.4327 11.871 11.2611 11.6437 11.1369C11.4164 11.0127 11.165 10.9389 10.9067 10.9204C10.6483 10.9019 10.389 10.9392 10.1464 11.0297C9.90369 11.1202 9.68332 11.2619 9.50021 11.445L8.41646 12.5288C8.08744 12.8695 7.90538 13.3257 7.90949 13.7993C7.91361 14.2729 8.10357 14.7259 8.43846 15.0608C8.77336 15.3957 9.22639 15.5857 9.69998 15.5898C10.1736 15.5939 10.6298 15.4119 10.9705 15.0828L11.5882 14.4651" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
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

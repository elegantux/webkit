((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = "basic_link_box";
    const COMPONENT_NAME = "Link Box";
    const DATA_KEY = "data-wk-type";
    const CATEGORY = "Basic";
    const BLOCK_ICON_HTML = `<svg width="100%" height="52px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 15.4426V8.33151C19.9997 8.01975 19.9174 7.71356 19.7614 7.44365C19.6054 7.17375 19.3811 6.94961 19.1111 6.79373L12.8889 3.23818C12.6186 3.08214 12.3121 3 12 3C11.6879 3 11.3814 3.08214 11.1111 3.23818L4.88889 6.79373C4.6189 6.94961 4.39465 7.17375 4.23863 7.44365C4.08262 7.71356 4.00032 8.01975 4 8.33151V15.4426C4.00032 15.7544 4.08262 16.0606 4.23863 16.3305C4.39465 16.6004 4.6189 16.8245 4.88889 16.9804L11.1111 20.536C11.3814 20.692 11.6879 20.7741 12 20.7741C12.3121 20.7741 12.6186 20.692 12.8889 20.536L19.1111 16.9804C19.3811 16.8245 19.6054 16.6004 19.7614 16.3305C19.9174 16.0606 19.9997 15.7544 20 15.4426Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4.23999 7.40698L7 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M17 9L19.76 7.40698" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 20.5V17.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11.3345 12.3345C11.4776 12.5258 11.6603 12.6842 11.87 12.7988C12.0797 12.9134 12.3116 12.9815 12.55 12.9986C12.7884 13.0156 13.0277 12.9812 13.2516 12.8977C13.4755 12.8142 13.6788 12.6835 13.8478 12.5145L14.8478 11.5145C15.1514 11.2001 15.3194 10.7791 15.3156 10.3421C15.3118 9.90513 15.1365 9.48711 14.8275 9.1781C14.5185 8.86908 14.1005 8.6938 13.6635 8.69C13.2265 8.68621 12.8055 8.8542 12.4911 9.15779L11.9178 9.72779" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12.668 11.6679C12.5248 11.4765 12.3422 11.3182 12.1324 11.2036C11.9227 11.089 11.6908 11.0208 11.4524 11.0038C11.214 10.9867 10.9748 11.0211 10.7508 11.1046C10.5269 11.1881 10.3236 11.3189 10.1546 11.4879L9.15462 12.4879C8.85102 12.8022 8.68303 13.2232 8.68683 13.6602C8.69063 14.0972 8.86591 14.5152 9.17492 14.8242C9.48394 15.1333 9.90196 15.3085 10.339 15.3123C10.7759 15.3161 11.1969 15.1481 11.5113 14.8445L12.0813 14.2745" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
    const PLACEHOLDER_HTML = `
    <div class="${COMPONENT_TYPE}-placeholder" style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen-Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 24px;">
      ${BLOCK_ICON_HTML}
      <h5 style="margin: 0; font-size: 24px;">${COMPONENT_NAME}</h5>
      <p style="margin: 0; font-size: 14px;">Drag&Drop something inside me!</p>
    </div>`;

    const component = {
      extend: 'basic_link',
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          tagName: "a",
          attributes: {
            [DATA_KEY]: COMPONENT_TYPE,
            href: '',
            class: COMPONENT_TYPE,
          },
          style: {
            'display': 'block',
            'text-decoration': 'none',
          },
          droppable: true,
          editable: false,
          components: [],

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

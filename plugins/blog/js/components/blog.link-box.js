((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = 'blog_link_box';
    const COMPONENT_NAME = 'Blog Link Box';
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Blog';

    const BLOCK_ICON_HTML = `<svg width="100%" height="52px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 15.4426V8.33151C19.9997 8.01975 19.9174 7.71356 19.7614 7.44365C19.6054 7.17375 19.3811 6.94961 19.1111 6.79373L12.8889 3.23818C12.6186 3.08214 12.3121 3 12 3C11.6879 3 11.3814 3.08214 11.1111 3.23818L4.88889 6.79373C4.6189 6.94961 4.39465 7.17375 4.23863 7.44365C4.08262 7.71356 4.00032 8.01975 4 8.33151V15.4426C4.00032 15.7544 4.08262 16.0606 4.23863 16.3305C4.39465 16.6004 4.6189 16.8245 4.88889 16.9804L11.1111 20.536C11.3814 20.692 11.6879 20.7741 12 20.7741C12.3121 20.7741 12.6186 20.692 12.8889 20.536L19.1111 16.9804C19.3811 16.8245 19.6054 16.6004 19.7614 16.3305C19.9174 16.0606 19.9997 15.7544 20 15.4426Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15.4781 10.9788C15.45 10.8538 15.3719 10.7381 15.2828 10.6897C15.2547 10.674 15.0797 10.6553 14.8922 10.6475C14.5781 10.6334 14.5437 10.6272 14.4437 10.5693C14.2859 10.4771 14.2437 10.3771 14.2421 10.1083C14.2406 9.5925 14.0265 9.11268 13.603 8.68131C13.3014 8.37341 12.9639 8.16554 12.5795 8.04832C12.4873 8.02019 12.2811 8.01081 11.5904 8.003C10.5059 7.9905 10.2653 8.01238 9.89653 8.15929C9.2168 8.42812 8.72927 9.00015 8.55114 9.7316C8.51832 9.86914 8.51051 10.0895 8.5027 11.3555C8.49332 12.9419 8.50426 13.1747 8.6027 13.4889C8.84647 14.2641 9.5387 14.8377 10.2341 14.9627C10.4653 15.0049 13.3171 15.0143 13.6093 14.9752C14.1171 14.9065 14.5156 14.7017 14.889 14.3204C15.1594 14.0437 15.3281 13.7452 15.4391 13.3498C15.5156 13.0747 15.5094 11.1179 15.4781 10.9788ZM10.445 9.98479C10.5669 9.86132 10.6013 9.85663 11.3638 9.85663C12.0498 9.85663 12.0732 9.8582 12.1732 9.90977C12.3186 9.98323 12.3826 10.0864 12.3826 10.2521C12.3826 10.4005 12.3233 10.5052 12.1904 10.5896C12.1185 10.635 12.0764 10.6381 11.4044 10.6412C10.9904 10.6444 10.6591 10.635 10.6106 10.6225C10.3513 10.549 10.2544 10.177 10.445 9.98479ZM13.4421 13.1075L13.2092 13.145L11.9982 13.1591C10.9341 13.1716 10.6341 13.1529 10.5778 13.1278C10.4669 13.0794 10.3622 12.945 10.345 12.8246C10.3278 12.7105 10.3856 12.5542 10.4731 12.4745C10.5841 12.3745 10.6325 12.3714 11.9935 12.3698C13.3936 12.3683 13.3858 12.3683 13.5186 12.4917C13.7077 12.6683 13.6671 12.9794 13.4421 13.1075Z" fill="currentColor"/>
    <path d="M4.23999 7.40698L7 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M17 9L19.76 7.40698" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 20.5V17.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
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
          attributes: { [DATA_KEY]: COMPONENT_TYPE, class: COMPONENT_TYPE, href: '{$wa->blog->url()}' },
          style: {
            'display': 'block',
            'text-decoration': 'none',
          },
          droppable: true,
          editable: false,
          components: [],

          traits: [
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

((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = 'blog_post_author_box';
    const COMPONENT_NAME = 'Author Link Box';
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Blog';

    const BLOCK_ICON_HTML = `<svg width="100%" height="52px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 15.4426V8.33151C19.9997 8.01975 19.9174 7.71356 19.7614 7.44365C19.6054 7.17375 19.3811 6.94961 19.1111 6.79373L12.8889 3.23818C12.6186 3.08214 12.3121 3 12 3C11.6879 3 11.3814 3.08214 11.1111 3.23818L4.88889 6.79373C4.6189 6.94961 4.39465 7.17375 4.23863 7.44365C4.08262 7.71356 4.00032 8.01975 4 8.33151V15.4426C4.00032 15.7544 4.08262 16.0606 4.23863 16.3305C4.39465 16.6004 4.6189 16.8245 4.88889 16.9804L11.1111 20.536C11.3814 20.692 11.6879 20.7741 12 20.7741C12.3121 20.7741 12.6186 20.692 12.8889 20.536L19.1111 16.9804C19.3811 16.8245 19.6054 16.6004 19.7614 16.3305C19.9174 16.0606 19.9997 15.7544 20 15.4426Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4.23999 7.40698L7 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M17 9L19.76 7.40698" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 20.5V17.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15.5554 15.3571V14.4999C15.5554 14.0453 15.3681 13.6092 15.0347 13.2877C14.7013 12.9663 14.2492 12.7856 13.7777 12.7856H10.2221C9.75062 12.7856 9.29843 12.9663 8.96503 13.2877C8.63164 13.6092 8.44434 14.0453 8.44434 14.4999V15.3571" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11.9999 11.0714C12.9818 11.0714 13.7777 10.3039 13.7777 9.35711C13.7777 8.41033 12.9818 7.64282 11.9999 7.64282C11.0181 7.64282 10.2222 8.41033 10.2222 9.35711C10.2222 10.3039 11.0181 11.0714 11.9999 11.0714Z" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
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
          attributes: { [DATA_KEY]: COMPONENT_TYPE, class: COMPONENT_TYPE, href: '{$post.user.posts_link}' },
          style: {
            'display': 'block',
            'text-decoration': 'none',
          },
          droppable: true,
          editable: false,
          components: [],
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

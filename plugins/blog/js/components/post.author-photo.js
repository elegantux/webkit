((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = 'blog_post_author_photo';
    const COMPONENT_NAME = 'Author Photo';
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Blog';
    const API_ENDPOINT = webkit.webkitBackendUrls.backendApiUrl + '?plugin=blog&module=default&action=authorPhoto';

    // const TRAITS = {
    //   TAG_NAME: {
    //     type: 'select',
    //     label: 'Photo Size',
    //     name: `trait_${COMPONENT_TYPE}__photo_size`,
    //     default: 'p',
    //     changeProp: true,
    //     options: [
    //       { value: '20', label: '20x20'},
    //     ],
    //   },
    // };

    const component = {
      extend: 'basic_image',
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          attributes: { [DATA_KEY]: COMPONENT_TYPE, class: COMPONENT_TYPE },
          droppable: false,
          style: { width: '42px' },

          traits: [],
        },
      },
      view: {
        listenToProps: [],
        init({ model }) {},
        onRender({ model }) {
          this.handleTraitsChange(model);
        },
        showViewDisclaimer(innerHtml) {
          this.el.innerHTML = innerHtml;
        },
        setLoadingView() {
          this.el.src = window.webkit.webkitBackendUrls.backendAppStaticUrl + '/img/dummy-image.webp';
        },
        setEmptyView() {
          const view = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen-Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 24px;">
              <h5 style="margin: 0; font-size: 24px;">Post not found!</h5>
              <p style="margin: 0; font-size: 14px;">Please create one or more posts.</p>
            </div>
          `;
          this.showViewDisclaimer(view);
        },
        async handleTraitsChange(model) {
          this.setLoadingView();

          const formData = new FormData();
          formData.append('_csrf', window.webkit.getCsrf());

          const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            body: formData
          });

          if (response.status !== 200) {
            const error = await response.json();
            this.showViewDisclaimer(`<code>${JSON.stringify(error, null, 4)}</code>`);
          }

          const responseBody = await response.json();

          if (!responseBody.data.model) {
            this.setEmptyView();
            return;
          }

          // Update src
          this.model.addAttributes({ src: responseBody.data.model });

          // Update the component view in the canvas
          this.el.src = responseBody.data.view;
        },
      }
    };

    const block = {
      id: COMPONENT_TYPE,
      label: COMPONENT_NAME,
      category: CATEGORY,
      icon: `<svg width="100%" height="52px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.1111 19.7144V18.0001C19.1111 17.0908 18.7365 16.2187 18.0697 15.5757C17.4029 14.9328 16.4986 14.5715 15.5556 14.5715H8.44447C7.50148 14.5715 6.59711 14.9328 5.93031 15.5757C5.26352 16.2187 4.88892 17.0908 4.88892 18.0001V19.7144" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16 10.6087L14.2413 8.31471C14.1153 8.15042 13.8708 8.13761 13.7226 8.28213C13.2361 8.75653 12.2091 9.66558 11.4545 9.69565C11.0634 9.71124 10.7401 9.47333 10.5172 9.2365C10.3248 9.03197 9.98192 8.98576 9.78495 9.18594L8 11" stroke="currentColor" stroke-width="0.6"/>
    <rect x="9.87508" y="6.45833" width="0.833333" height="0.833333" rx="0.416667" stroke="currentColor" stroke-width="0.416667"/>
    <rect x="7.6" y="4.6" width="8.8" height="6.8" rx="1.23333" stroke="currentColor" stroke-width="0.8"/>
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

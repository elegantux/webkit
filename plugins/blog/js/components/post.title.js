((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = 'blog_post_title';
    const COMPONENT_NAME = 'Post Title';
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Blog';
    const API_ENDPOINT = webkit.webkitBackendUrls.backendApiUrl + '?plugin=blog&module=default&action=postTitle';

    const tagNameTrait = {
      type: 'select',
      label: 'Tag Name',
      name: 'tagName',
      default: 'p',
      changeProp: true,
      options: [
        { value: 'h1', label: 'H1'},
        { value: 'h2', label: 'H2'},
        { value: 'h3', label: 'H3'},
        { value: 'h4', label: 'H4'},
        { value: 'h5', label: 'H5'},
        { value: 'p', label: 'Paragraph'},
        { value: 'div', label: 'Div'},
        { value: 'span', label: 'Span'},
      ],
    };

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          tagName: 'h4',
          name: COMPONENT_NAME,
          attributes: { [DATA_KEY]: COMPONENT_TYPE, class: COMPONENT_TYPE },
          droppable: false,
          components: '{$post.title}',

          traits: [
            tagNameTrait
          ],
        },
      },
      view: {
        listenToProps: [],
        init({ model }) {},
        onRender({ model }) {
          this.handleTraitsChange(model);
        },
        updateInnerHtml(innerHtml) {
          this.el.innerHTML = innerHtml;
        },
        setLoadingView() {
          const loader = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 20" xml:space="preserve" style="width: 44px; height: 20px"><circle fill="#0051d2" cx="6" cy="10" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".1"></animate></circle><circle fill="#0051d2" cx="26" cy="10" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".2"></animate></circle><circle fill="#0051d2" cx="46" cy="10" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".3"></animate></circle></svg>';
          this.updateInnerHtml(loader);
        },
        setEmptyView() {
          const view = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen-Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 24px;">
              <h5 style="margin: 0; font-size: 24px;">Post not found!</h5>
              <p style="margin: 0; font-size: 14px;">Please create one or more posts.</p>
            </div>
          `;
          this.updateInnerHtml(view);
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
            this.updateInnerHtml(`<code>${JSON.stringify(error, null, 4)}</code>`);
          }

          const responseBody = await response.json();

          if (!responseBody.data.model) {
            this.setEmptyView();
            return;
          }

          // Stop tracking changes, we don't need to push the following changes to the UndoManager
          editor.UndoManager.stop();
          // Clear components to make sure that there is nothing in there.
          this.model.components(null);
          // Update content
          this.model.set('components', responseBody.data.model);
          // Continue tracking changes
          editor.UndoManager.start();

          // Update the widget view in the canvas
          this.updateInnerHtml(responseBody.data.view);
        },
      }
    };

    const block = {
      id: COMPONENT_TYPE,
      label: COMPONENT_NAME,
      category: CATEGORY,
      icon: `<svg width="100%" height="52px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.1816 3.81812H7.45436C7.02037 3.81812 6.60415 3.99052 6.29727 4.2974C5.9904 4.60427 5.81799 5.02049 5.81799 5.45448V18.5454C5.81799 18.9794 5.9904 19.3956 6.29727 19.7025C6.60415 20.0094 7.02037 20.1818 7.45436 20.1818H17.2725C17.7065 20.1818 18.1227 20.0094 18.4296 19.7025C18.7365 19.3956 18.9089 18.9794 18.9089 18.5454V9.54539L13.1816 3.81812Z" stroke="currentColor" stroke-width="0.818182" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M13.1819 3.81812V9.54539H18.9092" stroke="currentColor" stroke-width="0.818182" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11.5586 13.1602C11.3398 13.1602 11.1598 13.1715 11.0186 13.1943C10.8818 13.2171 10.7679 13.265 10.6768 13.3379C10.5902 13.4108 10.5195 13.5133 10.4648 13.6455C10.4147 13.7731 10.3669 13.944 10.3213 14.1582H10.1299L10.1777 12.832H14.5801L14.6279 14.1582H14.4365C14.391 13.944 14.3408 13.7731 14.2861 13.6455C14.236 13.5133 14.1676 13.4108 14.0811 13.3379C13.9945 13.265 13.8805 13.2171 13.7393 13.1943C13.598 13.1715 13.4157 13.1602 13.1924 13.1602H12.7754V17.1592C12.7754 17.3005 12.7845 17.4144 12.8027 17.501C12.821 17.5876 12.8551 17.6559 12.9053 17.7061C12.96 17.7562 13.0352 17.7926 13.1309 17.8154C13.2311 17.8337 13.361 17.8473 13.5205 17.8564V18H11.251V17.8564C11.4105 17.8473 11.5381 17.8337 11.6338 17.8154C11.7295 17.7926 11.8024 17.7539 11.8525 17.6992C11.9072 17.64 11.9414 17.5602 11.9551 17.46C11.9733 17.3597 11.9824 17.2275 11.9824 17.0635V13.1602H11.5586Z" fill="currentColor"/>
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

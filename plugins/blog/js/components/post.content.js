((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = 'blog_post_content';
    const COMPONENT_NAME = 'Post Content';
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Blog';
    const API_ENDPOINT = webkit.webkitBackendUrls.backendApiUrl + '?plugin=blog&module=default&action=postContent';

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          attributes: { [DATA_KEY]: COMPONENT_TYPE, class: COMPONENT_TYPE },
          droppable: false,

          traits: [],
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
    <path d="M12 12L16 12" stroke="currentColor" stroke-width="0.5" stroke-linecap="round"/>
    <path d="M12 13.5L17 13.5" stroke="currentColor" stroke-width="0.5" stroke-linecap="round"/>
    <path d="M8 15H17" stroke="currentColor" stroke-width="0.5" stroke-linecap="round"/>
    <path d="M8 16.5H17" stroke="currentColor" stroke-width="0.5" stroke-linecap="round"/>
    <path d="M8 18H16" stroke="currentColor" stroke-width="0.5" stroke-linecap="round"/>
    <path d="M9.11328 10.543C8.95703 10.543 8.82845 10.5511 8.72754 10.5674C8.62988 10.5837 8.5485 10.6178 8.4834 10.6699C8.42155 10.722 8.37109 10.7952 8.33203 10.8896C8.29622 10.9808 8.26204 11.1029 8.22949 11.2559H8.09277L8.12695 10.3086H11.2715L11.3057 11.2559H11.1689C11.1364 11.1029 11.1006 10.9808 11.0615 10.8896C11.0257 10.7952 10.9769 10.722 10.915 10.6699C10.8532 10.6178 10.7718 10.5837 10.6709 10.5674C10.57 10.5511 10.4398 10.543 10.2803 10.543H9.98242V13.3994C9.98242 13.5003 9.98893 13.5817 10.002 13.6436C10.015 13.7054 10.0394 13.7542 10.0752 13.79C10.1143 13.8258 10.168 13.8519 10.2363 13.8682C10.3079 13.8812 10.4007 13.891 10.5146 13.8975V14H8.89355V13.8975C9.00749 13.891 9.09863 13.8812 9.16699 13.8682C9.23535 13.8519 9.28743 13.8242 9.32324 13.7852C9.3623 13.7428 9.38672 13.6859 9.39648 13.6143C9.40951 13.5426 9.41602 13.4482 9.41602 13.3311V10.543H9.11328Z" fill="currentColor"/>
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

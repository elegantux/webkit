((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = 'site_page_content';
    const COMPONENT_NAME = 'Page Content';
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Site';
    const API_ENDPOINT = webkit.webkitBackendUrls.backendApiUrl + '?plugin=basic&module=default&action=pageContent';

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
        onRender({ el, model }) {
          this.handleTraitsChange(model);
        },
        updateInnerHtml(innerHtml) {
          this.el.innerHTML = innerHtml;
        },
        setLoadingView() {
          const loader = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 20" xml:space="preserve" style="width: 44px; height: 20px"><circle fill="#0051d2" cx="6" cy="10" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".1"></animate></circle><circle fill="#0051d2" cx="26" cy="10" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".2"></animate></circle><circle fill="#0051d2" cx="46" cy="10" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".3"></animate></circle></svg>';
          this.updateInnerHtml(loader);
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
            throw new Error(await response.json());
          }

          const responseBody = await response.json();

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
    <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" stroke="currentColor"/>
    <rect x="4" y="6" width="16" height="0.5" fill="currentColor"/>
    <rect x="5" y="5" width="0.5" height="0.5" rx="0.25" fill="currentColor"/>
    <rect x="6" y="5" width="0.5" height="0.5" rx="0.25" fill="currentColor"/>
    <rect x="7" y="5" width="0.5" height="0.5" rx="0.25" fill="currentColor"/>
    <path d="M12 12L16 12" stroke="currentColor" stroke-width="0.5" stroke-linecap="round"/>
    <path d="M12 13.5L17 13.5" stroke="currentColor" stroke-width="0.5" stroke-linecap="round"/>
    <path d="M7 15L17 15" stroke="currentColor" stroke-width="0.5" stroke-linecap="round"/>
    <path d="M7 16.5H17" stroke="currentColor" stroke-width="0.5" stroke-linecap="round"/>
    <path d="M7 18H16" stroke="currentColor" stroke-width="0.5" stroke-linecap="round"/>
    <path d="M8.11328 10.543C7.95703 10.543 7.82845 10.5511 7.72754 10.5674C7.62988 10.5837 7.5485 10.6178 7.4834 10.6699C7.42155 10.722 7.37109 10.7952 7.33203 10.8896C7.29622 10.9808 7.26204 11.1029 7.22949 11.2559H7.09277L7.12695 10.3086H10.2715L10.3057 11.2559H10.1689C10.1364 11.1029 10.1006 10.9808 10.0615 10.8896C10.0257 10.7952 9.97689 10.722 9.91504 10.6699C9.85319 10.6178 9.77181 10.5837 9.6709 10.5674C9.56999 10.5511 9.43978 10.543 9.28027 10.543H8.98242V13.3994C8.98242 13.5003 8.98893 13.5817 9.00195 13.6436C9.01497 13.7054 9.03939 13.7542 9.0752 13.79C9.11426 13.8258 9.16797 13.8519 9.23633 13.8682C9.30794 13.8812 9.40072 13.891 9.51465 13.8975V14H7.89355V13.8975C8.00749 13.891 8.09863 13.8812 8.16699 13.8682C8.23535 13.8519 8.28743 13.8242 8.32324 13.7852C8.3623 13.7428 8.38672 13.6859 8.39648 13.6143C8.40951 13.5426 8.41602 13.4482 8.41602 13.3311V10.543H8.11328Z" fill="currentColor"/>
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

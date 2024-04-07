((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = 'site_page_name';
    const COMPONENT_NAME = 'Page Name';
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Site';
    const API_ENDPOINT = webkit.webkitBackendUrls.backendApiUrl + '?plugin=basic&module=default&action=pageName';

    const TRAITS = {
      TAG_NAME: {
        type: 'select',
        label: 'Tag Name',
        name: 'tagName',
        default: 'h1',
        changeProp: true,
        options: [
          { value: 'h1', label: 'h1' },
          { value: 'h2', label: 'h2' },
          { value: 'h3', label: 'h3' },
          { value: 'h4', label: 'h4' },
          { value: 'h5', label: 'h5' },
          { value: 'p', label: 'p' },
          { value: 'div', label: 'div' },
          { value: 'span', label: 'span' },
        ],
      },
    };

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          tagName: 'h1',
          name: COMPONENT_NAME,
          attributes: { [DATA_KEY]: COMPONENT_TYPE, class: COMPONENT_TYPE },
          droppable: false,

          traits: [
            TRAITS.TAG_NAME
          ],
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

          // Clear components to make sure that there is nothing in there.
          this.model.components(null);

          // Update content
          this.model.set('components', responseBody.data.model);

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
    <path d="M10.7266 11.0859C10.4141 11.0859 10.1569 11.1022 9.95508 11.1348C9.75977 11.1673 9.59701 11.2357 9.4668 11.3398C9.3431 11.444 9.24219 11.5905 9.16406 11.7793C9.09245 11.9616 9.02409 12.2057 8.95898 12.5117H8.68555L8.75391 10.6172H15.043L15.1113 12.5117H14.8379C14.7728 12.2057 14.7012 11.9616 14.623 11.7793C14.5514 11.5905 14.4538 11.444 14.3301 11.3398C14.2064 11.2357 14.0436 11.1673 13.8418 11.1348C13.64 11.1022 13.3796 11.0859 13.0605 11.0859H12.4648V16.7988C12.4648 17.0007 12.4779 17.1634 12.5039 17.2871C12.5299 17.4108 12.5788 17.5085 12.6504 17.5801C12.7285 17.6517 12.8359 17.7038 12.9727 17.7363C13.1159 17.7624 13.3014 17.7819 13.5293 17.7949V18H10.2871V17.7949C10.515 17.7819 10.6973 17.7624 10.834 17.7363C10.9707 17.7038 11.0749 17.6484 11.1465 17.5703C11.2246 17.4857 11.2734 17.3717 11.293 17.2285C11.319 17.0853 11.332 16.8965 11.332 16.6621V11.0859H10.7266Z" fill="currentColor"/>
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

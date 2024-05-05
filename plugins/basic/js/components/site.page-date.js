((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = 'site_page_date';
    const COMPONENT_NAME = 'Page Date';
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Site';
    const API_ENDPOINT = webkit.webkitBackendUrls.backendApiUrl + '?plugin=basic&module=default&action=pageDate';

    const TRAITS = {
      TAG_NAME: {
        type: 'select',
        label: 'Tag Name',
        name: 'tagName',
        default: 'p',
        changeProp: true,
        options: [
          { value: 'p', label: 'p'},
          { value: 'span', label: 'span'},
          { value: 'div', label: 'div'},
        ],
      },
      DATE_FORMAT: {
        type: 'textarea',
        label: 'Date Mask',
        name: `trait_${COMPONENT_TYPE}__date_mask`,
        placeholder: '%I:%M %p',
        changeProp: true,
        description: `<a href="https://www.smarty.net/docs/en/language.modifier.date.format.tpl" target="_blank" style="display: flex; align-items: center; font-size: 14px; margin-top: 4px;">
<svg style="margin-right: 4px;" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
How to use?
</a>`,
      },
    };

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          attributes: { [DATA_KEY]: COMPONENT_TYPE, class: COMPONENT_TYPE },
          droppable: false,

          [TRAITS.DATE_FORMAT.name]: 'd-m, Y',
          traits: [
            TRAITS.TAG_NAME,
            TRAITS.DATE_FORMAT,
          ],
        },
      },
      view: {
        listenToProps: [TRAITS.DATE_FORMAT.name],
        init({ model }) {
          const propsList = this.listenToProps.map(prop => `change:${prop}`).join(' ');
          this.listenTo(model, propsList, this.handleTraitsChange);
        },
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

          const date_format = model.get(TRAITS.DATE_FORMAT.name);

          const formData = new FormData();
          formData.append(TRAITS.DATE_FORMAT.name, date_format);
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
    <path d="M6 17.05C5.76333 17.05 5.55833 17.005 5.385 16.915C5.21167 16.825 5.07667 16.6983 4.98 16.535C4.88667 16.3717 4.84 16.18 4.84 15.96V14.39C4.84 14.17 4.88667 13.9783 4.98 13.815C5.07667 13.6517 5.21167 13.525 5.385 13.435C5.55833 13.345 5.76333 13.3 6 13.3C6.24 13.3 6.445 13.345 6.615 13.435C6.78833 13.525 6.92167 13.6517 7.015 13.815C7.11167 13.9783 7.16 14.17 7.16 14.39V15.96C7.16 16.18 7.11167 16.3717 7.015 16.535C6.92167 16.6983 6.78833 16.825 6.615 16.915C6.44167 17.005 6.23667 17.05 6 17.05ZM6 16.51C6.17333 16.51 6.31167 16.46 6.415 16.36C6.51833 16.26 6.57 16.1267 6.57 15.96V14.39C6.57 14.2233 6.51833 14.09 6.415 13.99C6.31167 13.89 6.17333 13.84 6 13.84C5.82667 13.84 5.68833 13.89 5.585 13.99C5.48167 14.09 5.43 14.2233 5.43 14.39V15.96C5.43 16.1267 5.48167 16.26 5.585 16.36C5.68833 16.46 5.82667 16.51 6 16.51ZM6 15.5C5.90333 15.5 5.82333 15.4683 5.76 15.405C5.7 15.3417 5.67 15.26 5.67 15.16C5.67 15.06 5.7 14.98 5.76 14.92C5.82 14.86 5.9 14.83 6 14.83C6.1 14.83 6.18 14.86 6.24 14.92C6.3 14.98 6.33 15.06 6.33 15.16C6.33 15.26 6.3 15.3417 6.24 15.405C6.18 15.4683 6.1 15.5 6 15.5ZM7.89305 17V16.395L9.03305 15.25C9.19305 15.0867 9.31138 14.94 9.38805 14.81C9.46471 14.6767 9.50305 14.54 9.50305 14.4C9.50305 14.23 9.45638 14.0983 9.36305 14.005C9.26971 13.9083 9.14305 13.86 8.98305 13.86C8.80638 13.86 8.66805 13.9117 8.56805 14.015C8.46805 14.115 8.41805 14.255 8.41805 14.435H7.79305C7.79638 14.2017 7.84638 14.0017 7.94305 13.835C8.04305 13.665 8.18305 13.5333 8.36305 13.44C8.54305 13.3467 8.75305 13.3 8.99305 13.3C9.22305 13.3 9.42305 13.3433 9.59305 13.43C9.76305 13.5167 9.89471 13.6383 9.98805 13.795C10.0814 13.9517 10.128 14.1383 10.128 14.355C10.128 14.5783 10.0697 14.7967 9.95305 15.01C9.83971 15.22 9.65638 15.4467 9.40305 15.69L8.64305 16.435H10.173V17H7.89305ZM10.7961 17.55L12.5461 12.85H13.1961L11.4461 17.55H10.7961ZM14.9941 17.05C14.7575 17.05 14.5525 17.005 14.3791 16.915C14.2058 16.825 14.0708 16.6983 13.9741 16.535C13.8808 16.3717 13.8341 16.18 13.8341 15.96V14.39C13.8341 14.17 13.8808 13.9783 13.9741 13.815C14.0708 13.6517 14.2058 13.525 14.3791 13.435C14.5525 13.345 14.7575 13.3 14.9941 13.3C15.2341 13.3 15.4391 13.345 15.6091 13.435C15.7825 13.525 15.9158 13.6517 16.0091 13.815C16.1058 13.9783 16.1541 14.17 16.1541 14.39V15.96C16.1541 16.18 16.1058 16.3717 16.0091 16.535C15.9158 16.6983 15.7825 16.825 15.6091 16.915C15.4358 17.005 15.2308 17.05 14.9941 17.05ZM14.9941 16.51C15.1675 16.51 15.3058 16.46 15.4091 16.36C15.5125 16.26 15.5641 16.1267 15.5641 15.96V14.39C15.5641 14.2233 15.5125 14.09 15.4091 13.99C15.3058 13.89 15.1675 13.84 14.9941 13.84C14.8208 13.84 14.6825 13.89 14.5791 13.99C14.4758 14.09 14.4241 14.2233 14.4241 14.39V15.96C14.4241 16.1267 14.4758 16.26 14.5791 16.36C14.6825 16.46 14.8208 16.51 14.9941 16.51ZM14.9941 15.5C14.8975 15.5 14.8175 15.4683 14.7541 15.405C14.6941 15.3417 14.6641 15.26 14.6641 15.16C14.6641 15.06 14.6941 14.98 14.7541 14.92C14.8141 14.86 14.8941 14.83 14.9941 14.83C15.0941 14.83 15.1741 14.86 15.2341 14.92C15.2941 14.98 15.3241 15.06 15.3241 15.16C15.3241 15.26 15.2941 15.3417 15.2341 15.405C15.1741 15.4683 15.0941 15.5 14.9941 15.5ZM16.8872 17V16.395L18.0272 15.25C18.1872 15.0867 18.3055 14.94 18.3822 14.81C18.4589 14.6767 18.4972 14.54 18.4972 14.4C18.4972 14.23 18.4505 14.0983 18.3572 14.005C18.2639 13.9083 18.1372 13.86 17.9772 13.86C17.8005 13.86 17.6622 13.9117 17.5622 14.015C17.4622 14.115 17.4122 14.255 17.4122 14.435H16.7872C16.7905 14.2017 16.8405 14.0017 16.9372 13.835C17.0372 13.665 17.1772 13.5333 17.3572 13.44C17.5372 13.3467 17.7472 13.3 17.9872 13.3C18.2172 13.3 18.4172 13.3433 18.5872 13.43C18.7572 13.5167 18.8889 13.6383 18.9822 13.795C19.0755 13.9517 19.1222 14.1383 19.1222 14.355C19.1222 14.5783 19.0639 14.7967 18.9472 15.01C18.8339 15.22 18.6505 15.4467 18.3972 15.69L17.6372 16.435H19.1672V17H16.8872Z" fill="currentColor"/>
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

((webkit) => {
  async function plugin(editor, data) {
    const COMPONENT_TYPE = 'blog_posts_grid';
    const COMPONENT_NAME = 'Posts Grid';
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Blog';
    const API_ENDPOINT = webkit.webkitBackendUrls.backendApiUrl + '?plugin=blog&module=default&action=postsGrid';
    const TEMPLATE_LIST_API_ENDPOINT = webkit.webkitBackendUrls.backendApiUrl + `?module=templateList&project_id=${data.template.wtp_project_id}&per_page=100&template_type=loop`;

    const BLOCK_ICON_HTML = `<svg width="100%" height="52px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.7776 2.77271H5.33314C4.92058 2.77271 4.52492 2.93553 4.2332 3.22536C3.94148 3.51519 3.77759 3.90828 3.77759 4.31816V16.6818C3.77759 17.0917 3.94148 17.4848 4.2332 17.7746C4.52492 18.0644 4.92058 18.2273 5.33314 18.2273H14.6665C15.079 18.2273 15.4747 18.0644 15.7664 17.7746C16.0581 17.4848 16.222 17.0917 16.222 16.6818V8.1818L10.7776 2.77271Z" stroke="currentColor" stroke-width="0.818182" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10.7778 2.77271V8.1818H16.2223" stroke="currentColor" stroke-width="0.818182" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M21 13L22 12L21 11" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M19 11.75C18.8619 11.75 18.75 11.8619 18.75 12C18.75 12.1381 18.8619 12.25 19 12.25V11.75ZM19 12.25H22V11.75H19V12.25Z" fill="currentColor"/>
    <path d="M10 22L11 23L12 22" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11.25 20C11.25 19.8619 11.1381 19.75 11 19.75C10.8619 19.75 10.75 19.8619 10.75 20H11.25ZM10.75 20V23H11.25V20H10.75Z" fill="currentColor"/>
</svg>`;
    const EMPTY_VIEW_HTML = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen-Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 24px;">
      ${BLOCK_ICON_HTML}
      <h5 style="margin: 0; font-size: 24px;">${COMPONENT_NAME}</h5>
      <p style="margin: 0; font-size: 14px;">Please configure the component settings</p>
    </div>
`;

    async function fetchLoopTemplates() {
      const response = await fetch(TEMPLATE_LIST_API_ENDPOINT);
      if (response.status !== 200) {
        throw new Error(await response.json());
      }

      const responseBody = await response.json();

      return responseBody.data.data;
    }

    const templateList = await fetchLoopTemplates();

    const TRAITS = {
      TAG_NAME: {
        type: 'select',
        label: 'Tag Name',
        name: 'tagName',
        default: 'section',
        changeProp: true,
        options: [
          { value: 'section', label: 'section'},
          { value: 'div', label: 'div'},
        ],
      },
      TEMPLATE_ID: {
        type: 'select',
        name: `trait_${COMPONENT_TYPE}__template_id`,
        label: 'Template',
        changeProp: true,
        options: templateList?.length > 0
          ? templateList
            // Filter current loop template from the templateList
            .filter((template) => template.id !== data.template.id)
            .map((template) => ({ value: template.id, label: template.name }))
          : [],
      },
    };

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          tagName: 'section',
          name: COMPONENT_NAME,
          attributes: { [DATA_KEY]: COMPONENT_TYPE, class: COMPONENT_TYPE },
          droppable: false,
          styles: `
            .${COMPONENT_TYPE} {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 24px;
            }
          `,

          [TRAITS.TEMPLATE_ID.name]: '',
          traits: [
            TRAITS.TEMPLATE_ID,
            TRAITS.TAG_NAME,
          ],
        },
      },
      view: {
        listenToProps: [TRAITS.TEMPLATE_ID.name],
        init({ model }) {
          const propsList = this.listenToProps.map(prop => `change:${prop}`).join(' ');
          this.listenTo(model, propsList, this.handleTraitsChange);
        },
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
          this.updateInnerHtml(EMPTY_VIEW_HTML);
        },
        async handleTraitsChange(model) {
          this.setLoadingView();

          const template_id = model.get(TRAITS.TEMPLATE_ID.name);

          const formData = new FormData();
          formData.append(TRAITS.TEMPLATE_ID.name, template_id);
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

          // Clear components to make sure that there is nothing in there.
          this.model.components(null);

          // Update content
          this.model.set('components', responseBody.data.model);

          // Update the component view in the canvas
          this.updateInnerHtml(responseBody.data.view);
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

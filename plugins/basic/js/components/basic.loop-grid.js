((webkit) => {
  async function plugin(editor, data) {
    const COMPONENT_TYPE = 'basic_loop_grid';
    const COMPONENT_NAME = 'Loop Grid';
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Basic';
    const API_ENDPOINT = webkit.webkitBackendUrls.backendApiUrl + '?plugin=basic&module=default&action=loopGrid';
    const TEMPLATE_LIST_API_ENDPOINT = webkit.webkitBackendUrls.backendApiUrl + `?module=templateList&project_id=${data.template.wtp_project_id}&per_page=100&template_type=loop`;
    const BLOG_ICON = `<svg width="100%" height="52px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1.5" y="4.5" width="17" height="9" rx="1.5" stroke="currentColor"/>
    <path d="M22 9.5L23 8.5L22 7.5" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20 8.25C19.8619 8.25 19.75 8.36193 19.75 8.5C19.75 8.63807 19.8619 8.75 20 8.75V8.25ZM20 8.75H23V8.25H20V8.75Z" fill="currentColor"/>
    <path d="M9 20L10 21L11 20" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10.25 18C10.25 17.8619 10.1381 17.75 10 17.75C9.86193 17.75 9.75 17.8619 9.75 18H10.25ZM9.75 18V21H10.25V18H9.75Z" fill="currentColor"/>
    <rect x="5.25" y="15.25" width="9.5" height="0.5" rx="0.25" fill="#D9D9D9" stroke="currentColor" stroke-width="0.5"/>
    <rect x="5.25" y="17.25" width="9.5" height="0.5" rx="0.25" fill="#D9D9D9" stroke="currentColor" stroke-width="0.5"/>
</svg>
`;

    const TRAIT_GROUPS = {
      QUERY: 'Query',
    };

    const TRAITS = {
      TEMPLATE_ID: `trait_${COMPONENT_TYPE}__template_id`,
      QUERY_DATA_TYPE: `trait_${COMPONENT_TYPE}__query_data_type`,
    };

    async function fetchLoopTemplates() {
      const response = await fetch(TEMPLATE_LIST_API_ENDPOINT);
      if (response.status !== 200) {
        throw new Error(await response.json());
      }

      const responseBody = await response.json();

      return responseBody.data.data;
    }

    const templateList = await fetchLoopTemplates();

    const templateIdTrait = {
      type: 'select',
      label: 'Template',
      name: TRAITS.TEMPLATE_ID,
      changeProp: true,
      options: templateList?.length > 0
        ? templateList
          // Filter current loop template from the templateList
          .filter((template) => template.id !== data.template.id)
          .map((template) => ({ value: template.id, label: template.name }))
        : [],
    };

    const queryDataTypeTrait = {
      type: 'select',
      label: 'Data Type',
      group: TRAIT_GROUPS.QUERY,
      name: TRAITS.QUERY_DATA_TYPE,
      changeProp: true,
      options: [
        // Fetch from the Component
        { value: 'blog_posts', label: 'Blog Posts'},
      ],
    };

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          attributes: { [DATA_KEY]: COMPONENT_TYPE },
          droppable: false,

          // Traits
          [TRAITS.TEMPLATE_ID]: '',
          [TRAITS.QUERY_DATA_TYPE]: '',
          traits: [
            templateIdTrait,
            queryDataTypeTrait,
          ],
        },
      },
      view: {
        listenToProps: [
          TRAITS.TEMPLATE_ID,
          TRAITS.QUERY_DATA_TYPE,
        ],
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
          const view = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen-Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 24px;">
              ${BLOG_ICON}
              <h5 style="margin: 0; font-size: 24px;">Loop Grid</h5>
              <p style="margin: 0; font-size: 14px;">Please configure the component settings</p>
            </div>
          `;
          this.updateInnerHtml(view);
        },
        async handleTraitsChange(model) {
          this.setLoadingView();

          const templateId = model.get(TRAITS.TEMPLATE_ID);
          const queryDataType = model.get(TRAITS.QUERY_DATA_TYPE);

          if (templateId.length === 0 || queryDataType.length === 0) {
            this.setEmptyView();
            return;
          }

          const formData = new FormData();
          formData.append('template_id', templateId);
          formData.append('query_data_type', queryDataType);
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

          // Update the widget view in the canvas
          this.updateInnerHtml(responseBody.data.view);
        },
      }
    };

    const block = {
      id: COMPONENT_TYPE,
      label: COMPONENT_NAME,
      category: CATEGORY,
      icon: BLOG_ICON,
      content: { type: COMPONENT_TYPE, },
      activate: true,
    };

    editor.Blocks.add(COMPONENT_TYPE, block);
    editor.DomComponents.addType(COMPONENT_TYPE, component);

    return {};
  }

  webkit.plugins.add(plugin);

})(window.webkit);

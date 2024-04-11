((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = 'blog_pages';
    const COMPONENT_NAME = 'Info Page Links';
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Blog';
    const API_ENDPOINT = webkit.webkitBackendUrls.backendApiUrl + '?plugin=blog&module=default&action=pages';

    const TRAITS = {
      CONTAINER_SELECTOR: {
        type: 'child_selector',
        label: 'Container Styles',
        name: `trait_${COMPONENT_TYPE}__container_css_rules`,
        value: '.blog_pages_container',
        changeProp: true,
      },
      ITEM_SELECTOR: {
        type: 'child_selector',
        label: 'Item Styles',
        name: `trait_${COMPONENT_TYPE}__item_css_rules`,
        value: '.blog_pages_item',
        changeProp: true,
      },
      ACTIVE_ITEM_SELECTOR: {
        type: 'child_selector',
        label: 'Item Styles',
        name: `trait_${COMPONENT_TYPE}__active_item_css_rules`,
        value: '.blog_pages_item.active',
        changeProp: true,
      },
      LINK_SELECTOR: {
        type: 'child_selector',
        label: 'Link Styles',
        name: `trait_${COMPONENT_TYPE}__link_css_rules`,
        value: '.blog_pages_link',
        changeProp: true,
      },
      ACTIVE_LINK_SELECTOR: {
        type: 'child_selector',
        label: 'Selected Link Styles',
        name: `trait_${COMPONENT_TYPE}__active_link_css_rules`,
        value: '.blog_pages_link.active',
        changeProp: true,
      },
    };

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          attributes: { [DATA_KEY]: COMPONENT_TYPE, class: COMPONENT_TYPE },
          droppable: false,
          styles: `
            .${COMPONENT_TYPE} ${TRAITS.CONTAINER_SELECTOR.value} {
              padding-left: 0px;
              margin-bottom: 0px;
              display: flex;
              align-items: center;
              gap: 32px;
            }

            .${COMPONENT_TYPE} ${TRAITS.LINK_SELECTOR.value} {
              text-decoration: none;
            }
          `,

          [TRAITS.CONTAINER_SELECTOR.name]: TRAITS.CONTAINER_SELECTOR.value,
          [TRAITS.ITEM_SELECTOR.name]: TRAITS.ITEM_SELECTOR.value,
          [TRAITS.ACTIVE_ITEM_SELECTOR.name]: TRAITS.ACTIVE_ITEM_SELECTOR.value,
          [TRAITS.LINK_SELECTOR.name]: TRAITS.LINK_SELECTOR.value,
          [TRAITS.ACTIVE_LINK_SELECTOR.name]: TRAITS.ACTIVE_LINK_SELECTOR.value,
          traits: [
            TRAITS.CONTAINER_SELECTOR,
            TRAITS.ITEM_SELECTOR,
            TRAITS.ACTIVE_ITEM_SELECTOR,
            TRAITS.LINK_SELECTOR,
            TRAITS.ACTIVE_LINK_SELECTOR,
          ],
        },
      },
      view: {
        // listenToProps: [TRAITS.DATE_FORMAT.name],
        // init({ model }) {
        //   const propsList = this.listenToProps.map(prop => `change:${prop}`).join(' ');
        //   this.listenTo(model, propsList, this.handleTraitsChange);
        // },
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
              <h5 style="margin: 0; font-size: 24px;">Page not found!</h5>
              <p style="margin: 0; font-size: 14px;">Please create one or more pages.</p>
            </div>
          `;
          this.updateInnerHtml(view);
        },
        async handleTraitsChange(model) {
          this.setLoadingView();

          // const date_format = model.get(TRAITS.DATE_FORMAT.name);

          const formData = new FormData();
          // formData.append(TRAITS.DATE_FORMAT.name, date_format);
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
          this.model.set('content', responseBody.data.model);

          // Update the component view in the canvas
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
    <path d="M10.3335 10.5H15.7502" stroke="currentColor" stroke-width="1.05263" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10.3335 13H15.7502" stroke="currentColor" stroke-width="1.05263" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10.3335 15.5H15.7502" stroke="currentColor" stroke-width="1.05263" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8.25 10.5H8.25596" stroke="currentColor" stroke-width="1.05263" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8.25 13H8.25596" stroke="currentColor" stroke-width="1.05263" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8.25 15.5H8.25596" stroke="currentColor" stroke-width="1.05263" stroke-linecap="round" stroke-linejoin="round"/>
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

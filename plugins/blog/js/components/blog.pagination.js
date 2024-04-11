((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = 'blog_pagination';
    const COMPONENT_NAME = 'Blog Pagination';
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Blog';
    const API_ENDPOINT = webkit.webkitBackendUrls.backendApiUrl + '?plugin=blog&module=default&action=pagination';

    const BLOCK_ICON_HTML = `<svg width="100%" height="82px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="10" width="4" height="4" rx="0.5" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3.16005 13.5V13.172H3.95205V10.88L3.16005 11.472V11.072L3.82005 10.58H4.31205V13.172H4.96005V13.5H3.16005Z" fill="currentColor"/>
    <rect x="8" y="10" width="4" height="4" rx="0.5" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9.16805 13.5V13.132L10.06 12.184C10.212 12.0213 10.3227 11.8773 10.392 11.752C10.4614 11.624 10.496 11.5013 10.496 11.384C10.496 11.2213 10.4507 11.0933 10.36 11C10.272 10.9067 10.1507 10.86 9.99605 10.86C9.82538 10.86 9.69072 10.908 9.59205 11.004C9.49605 11.1 9.44805 11.232 9.44805 11.4H9.08805C9.09338 11.224 9.13338 11.072 9.20805 10.944C9.28538 10.8133 9.39072 10.7133 9.52405 10.644C9.66005 10.5747 9.81738 10.54 9.99605 10.54C10.172 10.54 10.324 10.5747 10.452 10.644C10.5827 10.7107 10.6827 10.8067 10.752 10.932C10.8214 11.0573 10.856 11.2067 10.856 11.38C10.856 11.5453 10.812 11.7093 10.724 11.872C10.636 12.0347 10.492 12.22 10.292 12.428L9.57205 13.172H10.904V13.5H9.16805Z" fill="currentColor"/>
    <rect x="18" y="10" width="4" height="4" rx="0.5" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M19.548 13.5L20.376 12.172L20.36 12.16C20.3094 12.2347 20.24 12.292 20.152 12.332C20.064 12.372 19.9654 12.392 19.856 12.392C19.6987 12.392 19.56 12.3547 19.44 12.28C19.3227 12.2053 19.232 12.1 19.168 11.964C19.104 11.8253 19.072 11.664 19.072 11.48C19.072 11.2907 19.1107 11.1267 19.188 10.988C19.2654 10.8467 19.3734 10.7373 19.512 10.66C19.6507 10.58 19.812 10.54 19.996 10.54C20.1827 10.54 20.3454 10.58 20.484 10.66C20.6254 10.7373 20.7347 10.8467 20.812 10.988C20.8894 11.1267 20.928 11.2907 20.928 11.48C20.928 11.6267 20.9067 11.7707 20.864 11.912C20.824 12.0533 20.7627 12.1893 20.68 12.32L19.948 13.5H19.548ZM20 12.1C20.1707 12.1 20.308 12.044 20.412 11.932C20.516 11.8173 20.568 11.6667 20.568 11.48C20.568 11.2933 20.516 11.144 20.412 11.032C20.308 10.9173 20.1707 10.86 20 10.86C19.8294 10.86 19.692 10.9173 19.588 11.032C19.484 11.144 19.432 11.2933 19.432 11.48C19.432 11.6667 19.484 11.8173 19.588 11.932C19.692 12.044 19.8294 12.1 20 12.1Z" fill="currentColor"/>
    <path d="M13.8625 13.5586C13.925 13.5586 13.981 13.5833 14.0305 13.6328C14.0826 13.6823 14.1086 13.7409 14.1086 13.8086C14.1086 13.8737 14.0826 13.931 14.0305 13.9805C13.981 14.0273 13.9224 14.0508 13.8547 14.0508C13.787 14.0508 13.7284 14.0273 13.679 13.9805C13.6321 13.931 13.6086 13.8724 13.6086 13.8047C13.6086 13.7344 13.6334 13.6758 13.6829 13.6289C13.7323 13.582 13.7922 13.5586 13.8625 13.5586ZM14.9758 13.5586C15.0383 13.5586 15.0943 13.5833 15.1438 13.6328C15.1959 13.6823 15.2219 13.7409 15.2219 13.8086C15.2219 13.8737 15.1959 13.931 15.1438 13.9805C15.0943 14.0273 15.0357 14.0508 14.968 14.0508C14.9003 14.0508 14.8417 14.0273 14.7922 13.9805C14.7454 13.931 14.7219 13.8724 14.7219 13.8047C14.7219 13.7344 14.7467 13.6758 14.7961 13.6289C14.8456 13.582 14.9055 13.5586 14.9758 13.5586ZM16.0891 13.5586C16.1516 13.5586 16.2076 13.5833 16.2571 13.6328C16.3092 13.6823 16.3352 13.7409 16.3352 13.8086C16.3352 13.8737 16.3092 13.931 16.2571 13.9805C16.2076 14.0273 16.149 14.0508 16.0813 14.0508C16.0136 14.0508 15.955 14.0273 15.9055 13.9805C15.8586 13.931 15.8352 13.8724 15.8352 13.8047C15.8352 13.7344 15.8599 13.6758 15.9094 13.6289C15.9589 13.582 16.0188 13.5586 16.0891 13.5586Z" fill="currentColor"/>
</svg>`;
    const LOADING_ANIMATION_HTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 20" xml:space="preserve" style="width: 44px; height: 20px"><circle fill="#0051d2" cx="6" cy="10" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".1"></animate></circle><circle fill="#0051d2" cx="26" cy="10" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".2"></animate></circle><circle fill="#0051d2" cx="46" cy="10" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".3"></animate></circle></svg>';
    const EMPTY_VIEW_HTML = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen-Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 24px;">
      ${BLOCK_ICON_HTML}
      <h5 style="margin: 0; font-size: 24px;">${COMPONENT_NAME}</h5>
      <p style="margin: 0; font-size: 14px;">Please configure the component settings</p>
    </div>
`;

    const TRAITS = {
      CONTAINER_SELECTOR: {
        type: 'child_selector',
        label: 'Container Styles',
        name: `trait_${COMPONENT_TYPE}__container_css_rules`,
        value: '.blog_pagination_container',
        changeProp: true,
      },
      ITEM_SELECTOR: {
        type: 'child_selector',
        label: 'Item Styles',
        name: `trait_${COMPONENT_TYPE}__item_css_rules`,
        value: '.blog_pagination_item',
        changeProp: true,
      },
      ACTIVE_ITEM_SELECTOR: {
        type: 'child_selector',
        label: 'Item Styles',
        name: `trait_${COMPONENT_TYPE}__active_item_css_rules`,
        value: '.blog_pagination_item.active',
        changeProp: true,
      },
      LINK_SELECTOR: {
        type: 'child_selector',
        label: 'Link Styles',
        name: `trait_${COMPONENT_TYPE}__link_css_rules`,
        value: '.blog_pagination_link',
        changeProp: true,
      },
      ACTIVE_LINK_SELECTOR: {
        type: 'child_selector',
        label: 'Selected Link Styles',
        name: `trait_${COMPONENT_TYPE}__active_link_css_rules`,
        value: '.blog_pagination_link.active',
        changeProp: true,
      },
    };

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          attributes: { [DATA_KEY]: COMPONENT_TYPE, class: `.${COMPONENT_TYPE}` },
          droppable: false,
          styles: `
            .${COMPONENT_TYPE} ${TRAITS.CONTAINER_SELECTOR.value} {
              padding-left: 0px;
              margin-bottom: 0px;
              display: flex;
              align-items: center;
              gap: 20px;
            }

            .${COMPONENT_TYPE} ${TRAITS.LINK_SELECTOR.value} {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 40px;
              height: 40px;
              border-radius: 50px;
              background-color: #F5F5F5;
              color: #000638;
              text-decoration: none;
            }

            .${COMPONENT_TYPE} ${TRAITS.ACTIVE_LINK_SELECTOR.value} {
              background-color: #000638;
              color: #ffffff;
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
        onRender({ model }) {
          this.handleTraitsChange(model);
        },
        updateInnerHtml(innerHtml) {
          this.el.innerHTML = innerHtml;
        },
        setLoadingView() {
          this.updateInnerHtml(LOADING_ANIMATION_HTML);
        },
        setEmptyView() {
          this.updateInnerHtml(EMPTY_VIEW_HTML);
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

          // Clear components to make sure that there is nothing in there.
          this.model.components(null);

          // Update content
          // this.model.set('components', responseBody.data.model);

          // Use the "content" property instead of "components" to prevent formatting
          // of smarties used in html element attributes.
          this.model.set('content', responseBody.data.model);

          // Update the widget view in the canvas
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

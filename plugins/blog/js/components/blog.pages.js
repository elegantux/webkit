((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = 'blog_pages';
    const COMPONENT_NAME = 'Info Pages';
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
    <path d="M12.7776 3.81812H7.33314C6.92058 3.81812 6.52492 3.99052 6.2332 4.2974C5.94148 4.60427 5.77759 5.02049 5.77759 5.45448V18.5454C5.77759 18.9794 5.94148 19.3956 6.2332 19.7025C6.52492 20.0094 6.92058 20.1818 7.33314 20.1818H16.6665C17.079 20.1818 17.4747 20.0094 17.7664 19.7025C18.0581 19.3956 18.222 18.9794 18.222 18.5454V9.54539L12.7776 3.81812Z" stroke="currentColor" stroke-width="0.818182" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12.7778 3.81812V9.54539H18.2223" stroke="currentColor" stroke-width="0.818182" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M7.07398 19V18.274L8.44198 16.9C8.63398 16.704 8.77598 16.528 8.86798 16.372C8.95998 16.212 9.00598 16.048 9.00598 15.88C9.00598 15.676 8.94998 15.518 8.83798 15.406C8.72598 15.29 8.57398 15.232 8.38198 15.232C8.16998 15.232 8.00398 15.294 7.88398 15.418C7.76398 15.538 7.70398 15.706 7.70398 15.922H6.95398C6.95798 15.642 7.01798 15.402 7.13398 15.202C7.25398 14.998 7.42198 14.84 7.63798 14.728C7.85398 14.616 8.10598 14.56 8.39398 14.56C8.66998 14.56 8.90998 14.612 9.11398 14.716C9.31798 14.82 9.47598 14.966 9.58798 15.154C9.69998 15.342 9.75598 15.566 9.75598 15.826C9.75598 16.094 9.68598 16.356 9.54598 16.612C9.40998 16.864 9.18998 17.136 8.88598 17.428L7.97398 18.322H9.80998V19H7.07398ZM10.5576 19.66L12.6576 14.02H13.4376L11.3376 19.66H10.5576ZM15.5953 19.06C15.3113 19.06 15.0653 19.006 14.8573 18.898C14.6493 18.79 14.4873 18.638 14.3713 18.442C14.2593 18.246 14.2033 18.016 14.2033 17.752V15.868C14.2033 15.604 14.2593 15.374 14.3713 15.178C14.4873 14.982 14.6493 14.83 14.8573 14.722C15.0653 14.614 15.3113 14.56 15.5953 14.56C15.8833 14.56 16.1293 14.614 16.3333 14.722C16.5413 14.83 16.7013 14.982 16.8133 15.178C16.9293 15.374 16.9873 15.604 16.9873 15.868V17.752C16.9873 18.016 16.9293 18.246 16.8133 18.442C16.7013 18.638 16.5413 18.79 16.3333 18.898C16.1253 19.006 15.8793 19.06 15.5953 19.06ZM15.5953 18.412C15.8033 18.412 15.9693 18.352 16.0933 18.232C16.2173 18.112 16.2793 17.952 16.2793 17.752V15.868C16.2793 15.668 16.2173 15.508 16.0933 15.388C15.9693 15.268 15.8033 15.208 15.5953 15.208C15.3873 15.208 15.2213 15.268 15.0973 15.388C14.9733 15.508 14.9113 15.668 14.9113 15.868V17.752C14.9113 17.952 14.9733 18.112 15.0973 18.232C15.2213 18.352 15.3873 18.412 15.5953 18.412ZM15.5953 17.2C15.4793 17.2 15.3833 17.162 15.3073 17.086C15.2353 17.01 15.1993 16.912 15.1993 16.792C15.1993 16.672 15.2353 16.576 15.3073 16.504C15.3793 16.432 15.4753 16.396 15.5953 16.396C15.7153 16.396 15.8113 16.432 15.8833 16.504C15.9553 16.576 15.9913 16.672 15.9913 16.792C15.9913 16.912 15.9553 17.01 15.8833 17.086C15.8113 17.162 15.7153 17.2 15.5953 17.2Z" fill="currentColor"/>
    <path d="M19.474 19V18.274L20.842 16.9C21.034 16.704 21.176 16.528 21.268 16.372C21.36 16.212 21.406 16.048 21.406 15.88C21.406 15.676 21.35 15.518 21.238 15.406C21.126 15.29 20.974 15.232 20.782 15.232C20.57 15.232 20.404 15.294 20.284 15.418C20.164 15.538 20.104 15.706 20.104 15.922H19.354C19.358 15.642 19.418 15.402 19.534 15.202C19.654 14.998 19.822 14.84 20.038 14.728C20.254 14.616 20.506 14.56 20.794 14.56C21.07 14.56 21.31 14.612 21.514 14.716C21.718 14.82 21.876 14.966 21.988 15.154C22.1 15.342 22.156 15.566 22.156 15.826C22.156 16.094 22.086 16.356 21.946 16.612C21.81 16.864 21.59 17.136 21.286 17.428L20.374 18.322H22.21V19H19.474Z" fill="currentColor"/>
    <path d="M2.8 19.06C2.516 19.06 2.27 19.006 2.062 18.898C1.854 18.79 1.692 18.638 1.576 18.442C1.464 18.246 1.408 18.016 1.408 17.752V15.868C1.408 15.604 1.464 15.374 1.576 15.178C1.692 14.982 1.854 14.83 2.062 14.722C2.27 14.614 2.516 14.56 2.8 14.56C3.088 14.56 3.334 14.614 3.538 14.722C3.746 14.83 3.906 14.982 4.018 15.178C4.134 15.374 4.192 15.604 4.192 15.868V17.752C4.192 18.016 4.134 18.246 4.018 18.442C3.906 18.638 3.746 18.79 3.538 18.898C3.33 19.006 3.084 19.06 2.8 19.06ZM2.8 18.412C3.008 18.412 3.174 18.352 3.298 18.232C3.422 18.112 3.484 17.952 3.484 17.752V15.868C3.484 15.668 3.422 15.508 3.298 15.388C3.174 15.268 3.008 15.208 2.8 15.208C2.592 15.208 2.426 15.268 2.302 15.388C2.178 15.508 2.116 15.668 2.116 15.868V17.752C2.116 17.952 2.178 18.112 2.302 18.232C2.426 18.352 2.592 18.412 2.8 18.412ZM2.8 17.2C2.684 17.2 2.588 17.162 2.512 17.086C2.44 17.01 2.404 16.912 2.404 16.792C2.404 16.672 2.44 16.576 2.512 16.504C2.584 16.432 2.68 16.396 2.8 16.396C2.92 16.396 3.016 16.432 3.088 16.504C3.16 16.576 3.196 16.672 3.196 16.792C3.196 16.912 3.16 17.01 3.088 17.086C3.016 17.162 2.92 17.2 2.8 17.2Z" fill="currentColor"/>
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

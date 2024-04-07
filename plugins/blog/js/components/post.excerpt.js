((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = 'blog_post_excerpt';
    const COMPONENT_NAME = 'Post Excerpt';
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Blog';
    const API_ENDPOINT = webkit.webkitBackendUrls.backendApiUrl + '?plugin=blog&module=default&action=postExcerpt';

    const TRAITS = {
      TEXT_LENGTH: {
        name: `trait_${COMPONENT_TYPE}__text_length`,
        type: 'number',
        label: 'Text Length',
        default: 120,
        min: 0,
        step: 1,
        debounce: 500,
        changeProp: true,
      },
      TRUNCATE_REPLACE: {
        name: `trait_${COMPONENT_TYPE}__truncate_replace`,
        type: 'text',
        label: 'Replace with',
        changeProp: true,
      },
      TRUNCATE_AT_WORD: {
        type: 'checkbox',
        label: 'Truncate at word',
        text: 'Enable truncate on exact character, otherwise it will truncate on word boundary.',
        default: false,
        changeProp: true,
        name: `trait_${COMPONENT_TYPE}__truncate_at_word`,
      },
      TRUNCATE_AT_MIDDLE: {
        type: 'checkbox',
        label: 'Truncate at middle',
        text: 'Enable to truncate in the middle of the string, otherwise will truncate at the end of the string.',
        default: false,
        changeProp: true,
        name: `trait_${COMPONENT_TYPE}__truncate_at_middle`,
      },
    };

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          tagName: 'p',
          name: COMPONENT_NAME,
          attributes: { [DATA_KEY]: COMPONENT_TYPE, class: COMPONENT_TYPE },
          droppable: false,

          [TRAITS.TEXT_LENGTH.name]: 120,
          [TRAITS.TRUNCATE_REPLACE.name]: '...',
          [TRAITS.TRUNCATE_AT_WORD.name]: false,
          [TRAITS.TRUNCATE_AT_MIDDLE.name]: false,
          traits: [
            TRAITS.TEXT_LENGTH,
            TRAITS.TRUNCATE_REPLACE,
            TRAITS.TRUNCATE_AT_WORD,
            TRAITS.TRUNCATE_AT_MIDDLE,
          ],
        },
      },
      view: {
        listenToProps: [
          TRAITS.TEXT_LENGTH.name,
          TRAITS.TRUNCATE_REPLACE.name,
          TRAITS.TRUNCATE_AT_WORD.name,
          TRAITS.TRUNCATE_AT_MIDDLE.name,
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
              <h5 style="margin: 0; font-size: 24px;">Post Excerpt</h5>
              <p style="margin: 0; font-size: 14px;">Please configure the component settings</p>
            </div>
          `;
          this.updateInnerHtml(view);
        },
        async handleTraitsChange(model) {
          this.setLoadingView();

          const text_length = model.get(TRAITS.TEXT_LENGTH.name);
          const truncate_replace = model.get(TRAITS.TRUNCATE_REPLACE.name);
          const truncate_at_word = model.get(TRAITS.TRUNCATE_AT_WORD.name);
          const truncate_at_middle = model.get(TRAITS.TRUNCATE_AT_MIDDLE.name);

          const formData = new FormData();
          formData.append(TRAITS.TEXT_LENGTH.name, text_length);
          formData.append(TRAITS.TRUNCATE_REPLACE.name, truncate_replace);
          formData.append(TRAITS.TRUNCATE_AT_WORD.name, truncate_at_word);
          formData.append(TRAITS.TRUNCATE_AT_MIDDLE.name, truncate_at_middle);
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
      icon: `<svg width="100%" height="52px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.1816 3.81812H7.45436C7.02037 3.81812 6.60415 3.99052 6.29727 4.2974C5.9904 4.60427 5.81799 5.02049 5.81799 5.45448V18.5454C5.81799 18.9794 5.9904 19.3956 6.29727 19.7025C6.60415 20.0094 7.02037 20.1818 7.45436 20.1818H17.2725C17.7065 20.1818 18.1227 20.0094 18.4296 19.7025C18.7365 19.3956 18.9089 18.9794 18.9089 18.5454V9.54539L13.1816 3.81812Z" stroke="currentColor" stroke-width="0.818182" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M13.1819 3.81812V9.54539H18.9092" stroke="currentColor" stroke-width="0.818182" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8.6 17.3C8.6 17.4657 8.46569 17.6 8.3 17.6C8.13431 17.6 8 17.4657 8 17.3C8 17.1343 8.13431 17 8.3 17C8.46569 17 8.6 17.1343 8.6 17.3Z" fill="currentColor"/>
    <path d="M10 17.3C10 17.4657 9.86569 17.6 9.7 17.6C9.53431 17.6 9.4 17.4657 9.4 17.3C9.4 17.1343 9.53431 17 9.7 17C9.86569 17 10 17.1343 10 17.3Z" fill="currentColor"/>
    <path d="M11.3 17.3C11.3 17.4657 11.1657 17.6 11 17.6C10.8343 17.6 10.7 17.4657 10.7 17.3C10.7 17.1343 10.8343 17 11 17C11.1657 17 11.3 17.1343 11.3 17.3Z" fill="currentColor"/>
    <path d="M8 12H15" stroke="currentColor" stroke-width="0.5" stroke-linecap="round"/>
    <path d="M8 13.5H16" stroke="currentColor" stroke-width="0.5" stroke-linecap="round"/>
    <path d="M8 15H15" stroke="currentColor" stroke-width="0.5" stroke-linecap="round"/>
</svg>
`,
      content: { type: COMPONENT_TYPE, },
      activate: true,
    };

    editor.Blocks.add(COMPONENT_TYPE, block);
    editor.DomComponents.addType(COMPONENT_TYPE, component);

    return {};
  }

  webkit.plugins.add(plugin);

})(window.webkit);

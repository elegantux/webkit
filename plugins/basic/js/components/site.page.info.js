((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = 'site_page_info';
    const COMPONENT_NAME = 'Page Info';
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Site';
    const API_ENDPOINT = webkit.webkitBackendUrls.backendApiUrl + '?plugin=basic&module=default&action=pageInfo';

    const TRAITS = {
      INFO_KEY: `trait_${COMPONENT_TYPE}__info_key`,
      DATE_FORMAT: `trait_${COMPONENT_TYPE}__date_format`,
    };

    const tagNameTrait = {
      type: 'select',
      label: 'Tag Name',
      name: 'tagName',
      default: 'p',
      options: [
        { value: 'h1', label: 'H1'},
        { value: 'h2', label: 'H2'},
        { value: 'h3', label: 'H3'},
        { value: 'h4', label: 'H4'},
        { value: 'h5', label: 'H5'},
        { value: 'p', label: 'Paragraph'},
        { value: 'div', label: 'Div'},
        { value: 'span', label: 'Span'},
      ],
    };

    const formatDateTrait = {
      type: 'textarea',
      label: 'Date Mask',
      name: TRAITS.DATE_FORMAT,
      placeholder: '%I:%M %p',
      changeProp: true,
      description: `<a href="https://www.smarty.net/docs/en/language.modifier.date.format.tpl" target="_blank" style="display: flex; align-items: center; font-size: 14px; margin-top: 4px;">
<svg style="margin-right: 4px;" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
How to use?
</a>`,
    };

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          tagName: 'p',
          name: COMPONENT_NAME,
          attributes: { [DATA_KEY]: COMPONENT_TYPE },
          droppable: false,

          // Traits
          [TRAITS.INFO_KEY]: 'name',
          [TRAITS.DATE_FORMAT]: '',
          traits: [
            {
              type: 'select',
              label: 'Page Info Type',
              name: TRAITS.INFO_KEY,
              changeProp: true,
              default: 'name',
              options: [
                { value: 'name', label: 'Page Name'},
                { value: 'content', label: 'Page Content'},
                { value: 'create_datetime', label: 'Created At'},
                { value: 'update_datetime', label: 'Updated At'},
              ],
            },
          ],
        },
      },
      view: {
        listenToProps: [
          TRAITS.INFO_KEY,
          TRAITS.DATE_FORMAT,
        ],
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

          const infoKey = model.get(TRAITS.INFO_KEY);
          const dateFormat = model.get(TRAITS.DATE_FORMAT);

          if (infoKey === 'name') {
            this.model.addTrait(tagNameTrait);
          } else {
            this.model.removeTrait('tagName');
          }

          if (['create_datetime', 'update_datetime'].includes(infoKey)) {
            this.model.addTrait(formatDateTrait);
          } else {
            this.model.set(TRAITS.DATE_FORMAT, '');
            this.model.removeTrait(TRAITS.DATE_FORMAT);
          }

          editor.runCommand('trait-manager:update-property-list');

          // console.log('componentTraits', model.get(TRAIT_KEYS.TITLE_PREFIX))
          const formData = new FormData();
          formData.append('info_key', infoKey);
          formData.append('date_format', dateFormat);
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
    <path d="M13.1815 3.81824H7.45423C7.02024 3.81824 6.60403 3.99064 6.29715 4.29752C5.99027 4.60439 5.81787 5.02061 5.81787 5.4546V18.5455C5.81787 18.9795 5.99027 19.3957 6.29715 19.7026C6.60403 20.0095 7.02024 20.1819 7.45423 20.1819H17.2724C17.7064 20.1819 18.1226 20.0095 18.4295 19.7026C18.7364 19.3957 18.9088 18.9795 18.9088 18.5455V9.54551L13.1815 3.81824Z" stroke="currentColor" stroke-width="0.818182" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M13.1819 3.81824V9.54551H18.9092" stroke="currentColor" stroke-width="0.818182" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12.1987 17.0314C13.2107 17.0314 14.0312 16.211 14.0312 15.1989C14.0312 14.1869 13.2107 13.3665 12.1987 13.3665C11.1866 13.3665 10.3662 14.1869 10.3662 15.1989C10.3662 16.211 11.1866 17.0314 12.1987 17.0314Z" stroke="currentColor" stroke-width="0.366496" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12.199 15.932V15.199" stroke="currentColor" stroke-width="0.366496" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12.199 14.4659H12.2016" stroke="currentColor" stroke-width="0.366496" stroke-linecap="round" stroke-linejoin="round"/>
    <clipPath id="clip0_1197_8">
        <rect width="14.7273" height="18" fill="white" transform="translate(5 3)"/>
    </clipPath>
    <clipPath id="clip1_1197_8">
        <rect width="4.39795" height="4.39795" fill="white" transform="translate(10 13)"/>
    </clipPath>
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

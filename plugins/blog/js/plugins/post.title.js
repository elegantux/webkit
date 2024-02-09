((webkit) => {

  async function plugin(editor, params) {
    // await new Promise(r => setTimeout(r, 1000));
    const loadBlogList = async () => {
      const response = await fetch(webkit.webkitBackendUrls.backendApiUrl + '?plugin=blog&module=default&action=default');

      if (response.status !== 200) {
        throw new Error(await response.json());
      }

      const responseBody = await response.json();

      return responseBody.data;
    };
    const optionList = await loadBlogList();

    const API_ENDPOINT = webkit.webkitBackendUrls.backendApiUrl + '?plugin=blog&module=post&action=title';
    const DATA_KEY = 'data-wk-type';
    const POST_TITLE_COMPONENT_TYPE = 'blog_post_title';
    const POST_TITLE_COMPONENT_NAME = 'Post Title';
    const TRAIT_KEYS = {
      BLOG_ID: `trait_${POST_TITLE_COMPONENT_TYPE}__blog_id`,
      TITLE_PREFIX: `trait_${POST_TITLE_COMPONENT_TYPE}__prefix`,
      TITLE_SUFFIX: `trait_${POST_TITLE_COMPONENT_TYPE}__suffix`,
      DISPLAY: `trait_${POST_TITLE_COMPONENT_TYPE}__display`,
      BUTTON_GROUP: `trait_${POST_TITLE_COMPONENT_TYPE}__button_group`,
      TEXTAREA: `trait_${POST_TITLE_COMPONENT_TYPE}__textarea`,
      COLOR: `trait_${POST_TITLE_COMPONENT_TYPE}__color`,
      NUMBER: `trait_${POST_TITLE_COMPONENT_TYPE}__number`,
    };

    // console.log(params);

    const postTitleComponent = {
      extend: 'text',
      isComponent: (el) => el?.dataset?.[DATA_KEY] === POST_TITLE_COMPONENT_TYPE,
      model: {
        defaults: {
          tagName: 'h3',
          name: POST_TITLE_COMPONENT_NAME,
          attributes: { [DATA_KEY]: POST_TITLE_COMPONENT_TYPE },
          editable: false,

          // Traits
          [TRAIT_KEYS.BLOG_ID]: '',
          [TRAIT_KEYS.TITLE_PREFIX]: '',
          [TRAIT_KEYS.TITLE_SUFFIX]: '',
          [TRAIT_KEYS.DISPLAY]: false,
          [TRAIT_KEYS.BUTTON_GROUP]: '',
          [TRAIT_KEYS.TEXTAREA]: '',
          [TRAIT_KEYS.COLOR]: '',
          [TRAIT_KEYS.NUMBER]: '',
          traits: [
            {
              type: 'select', // Type of the trait
              label: 'Tag Name', // The label you will see in Settings
              name: 'tagName', // The name of the attribute/property to use on component
              default: 'h3',
              options: [
                { value: 'h1', label: 'H1'},
                { value: 'h2', label: 'H2'},
                { value: 'h3', label: 'H3'},
                { value: 'h4', label: 'H4'},
                { value: 'h5', label: 'H5'},
                { value: 'span', label: 'Span'},
              ],
            },
            {
              type: 'select', // Type of the trait
              label: 'Blog ID', // The label you will see in Settings
              name: TRAIT_KEYS.BLOG_ID, // The name of the attribute/property to use on component
              options: optionList,
            },
            {
              type: 'text',
              label: 'Prefix',
              name: TRAIT_KEYS.TITLE_PREFIX,
              options: [
                { value: 'nowrap', label: 'No Wrap' },
                { value: 'wrap', label: 'Wrap' },
                { value: 'wrap-reverse', label: 'Wrap Reverse' },
              ],
              changeProp: 1,
              colSpan: 1,
            },
            {
              type: 'text',
              label: 'Suffix',
              name: TRAIT_KEYS.TITLE_SUFFIX,
              changeProp: 1,
              colSpan: 1,
            },
            {
              type: 'number',
              label: 'Number type',
              name: TRAIT_KEYS.NUMBER,
              changeProp: 1,
            },
            {
              type: 'textarea',
              label: 'Some textarea',
              name: TRAIT_KEYS.TEXTAREA,
              changeProp: 1,
            },
            {
              type: 'color',
              label: 'Color picker',
              name: TRAIT_KEYS.COLOR,
              changeProp: 1,
            },
            {
              type: 'checkbox',
              label: 'Display block',
              text: 'Confirmation text',
              name: TRAIT_KEYS.DISPLAY,
              changeProp: 1,
            },
            {
              type: 'button_group', // Type of the trait
              label: 'Button Group', // The label you will see in Settings
              name: TRAIT_KEYS.BUTTON_GROUP, // The name of the attribute/property to use on component
              options: optionList,
              default: '',
            },
          ]
        },
      },
      view: {
        listenToProps: [
          TRAIT_KEYS.BLOG_ID,
          TRAIT_KEYS.TITLE_PREFIX,
          TRAIT_KEYS.TITLE_SUFFIX,
          TRAIT_KEYS.DISPLAY,
          TRAIT_KEYS.BUTTON_GROUP,
          TRAIT_KEYS.TEXTAREA,
          TRAIT_KEYS.COLOR,
          TRAIT_KEYS.NUMBER,
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

          const blogId = model.get(TRAIT_KEYS.BLOG_ID);
          const prefix = model.get(TRAIT_KEYS.TITLE_PREFIX);
          const suffix = model.get(TRAIT_KEYS.TITLE_SUFFIX);
          const display = model.get(TRAIT_KEYS.DISPLAY);

          // await new Promise(r => setTimeout(r, 1000));

          if (display) {
            this.model.addTrait({
              type: 'text', // Type of the trait
              label: 'Conditional Trait', // The label you will see in Settings
              name: 'conditional_trait', // The name of the attribute/property to use on component
              // options: optionList,
            });
          } else {
            this.model.removeTrait('conditional_trait');
          }

          editor.runCommand('trait-manager:update-property-list');

          // console.log('componentTraits', model.get(TRAIT_KEYS.TITLE_PREFIX))
          const formData = new FormData();
          formData.append('blog_id', blogId);
          formData.append('prefix', prefix);
          formData.append('suffix', suffix);
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
    const block1 = {
      id: POST_TITLE_COMPONENT_TYPE,
      label: POST_TITLE_COMPONENT_NAME,
      category: 'Blog Post',
      icon: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" height="4em" width="4em" xmlns="http://www.w3.org/2000/svg"><path d="M221.5 51.7C216.6 39.8 204.9 32 192 32s-24.6 7.8-29.5 19.7l-120 288-40 96c-6.8 16.3 .9 35 17.2 41.8s35-.9 41.8-17.2L93.3 384H290.7l31.8 76.3c6.8 16.3 25.5 24 41.8 17.2s24-25.5 17.2-41.8l-40-96-120-288zM264 320H120l72-172.8L264 320z"></path></svg>`,
      content: { type: POST_TITLE_COMPONENT_TYPE, },
      // The component `image` is activatable (shows the Asset Manager).
      // We want to activate it once dropped in the canvas.
      activate: true,
      // select: true, // Default with `activate: true`
    };

    editor.Blocks.add(POST_TITLE_COMPONENT_TYPE, block1);
    editor.DomComponents.addType(POST_TITLE_COMPONENT_TYPE, postTitleComponent);

    return {
      id: '',
      name: '',

      blocks: [block1],

      components: [postTitleComponent],
    };
  }

  webkit.plugins.add(plugin);

})(window.webkit);

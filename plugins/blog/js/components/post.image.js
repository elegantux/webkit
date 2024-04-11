((webkit) => {
  async function plugin(editor, data) {
    const COMPONENT_TYPE = 'blog_post_image';
    const COMPONENT_NAME = 'Post Image';
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Blog';
    const PLUGIN_ID = 'ewblogpimg';
    const API_ENDPOINT = webkit.webkitBackendUrls.backendApiUrl + '?plugin=blog&module=default&action=postImage';
    const PLUGIN_API_ENDPOINT = webkit.webkitBackendUrls.backendUrl + `/blog?plugin=${PLUGIN_ID}&module=data`;

    async function fetchPluginSettings() {
      const response = await fetch(PLUGIN_API_ENDPOINT);
      if (response.status !== 200) {
        throw new Error(await response.json());
      }

      const responseBody = await response.json();

      return responseBody.data;
    }

    const pluginSettings = await fetchPluginSettings();
    const imageGroupOptions = pluginSettings.groups.map((group) => ({
      value: group.id,
      label: group.title,
    }));

    const TRAITS = {
      IMAGE_GROUP: {
        type: 'select',
        name: `trait_${COMPONENT_TYPE}__group`,
        label: 'Image Size',
        changeProp: true,
        options: imageGroupOptions,
      },
      USE_RETINA: {
        type: 'checkbox',
        name: `trait_${COMPONENT_TYPE}__use_retina`,
        label: 'Use Retina',
        text: 'Use retina image (@2x)',
        default: false,
        changeProp: true,
      },
      PLACEHOLDER_IMAGE: {
        type: 'image',
        label: 'Placeholder Image',
        name: `trait_${COMPONENT_TYPE}__placeholder_src`,
        default: '/wa-apps/webkit/img/dummy-image.webp',
        changeProp: true,
        group: 'Placeholder',
      },
    };

    const component = {
      extend: 'basic_image',
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          attributes: { [DATA_KEY]: COMPONENT_TYPE, class: COMPONENT_TYPE },
          droppable: false,
          style: { width: 'auto', 'max-width': '100%', },

          [TRAITS.IMAGE_GROUP.name]: imageGroupOptions[0].value,
          [TRAITS.USE_RETINA.name]: TRAITS.USE_RETINA.default,
          [TRAITS.PLACEHOLDER_IMAGE.name]: TRAITS.PLACEHOLDER_IMAGE.default,
          traits: [
            TRAITS.IMAGE_GROUP,
            TRAITS.USE_RETINA,
            TRAITS.PLACEHOLDER_IMAGE,
          ],
        },
      },
      view: {
        listenToProps: [
          TRAITS.IMAGE_GROUP.name,
          TRAITS.USE_RETINA.name,
          TRAITS.PLACEHOLDER_IMAGE.name,
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
          this.el.src = '/wa-apps/webkit/img/loading.webp';
        },
        async handleTraitsChange(model) {
          this.setLoadingView();

          const groupId = model.get(TRAITS.IMAGE_GROUP.name);
          const useRetina = model.get(TRAITS.USE_RETINA.name);
          const placeholderSrc = model.get(TRAITS.PLACEHOLDER_IMAGE.name);

          const groupUniqueId = pluginSettings.groups.find((group) => group.id === groupId)?.unique_id;

          if (groupId.length === 0) {
            this.model.addAttributes({ src: placeholderSrc });
            this.el.src = placeholderSrc;
            return;
          }

          const sizeGroup = pluginSettings.group_sizes.find((group) => group.group_id === groupId)
          const imageSize = `${sizeGroup.width}x${sizeGroup.height}`;

          const formData = new FormData();
          formData.append('size', imageSize);
          formData.append('unique_id', groupUniqueId);
          formData.append('use_retina', useRetina);
          formData.append('placeholder_src', placeholderSrc);
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

          // Update src
          this.model.addAttributes({ src: responseBody.data.model });

          // Update the component view in the canvas
          this.el.src = responseBody.data.view;
        },
      }
    };

    const block = {
      id: COMPONENT_TYPE,
      label: COMPONENT_NAME,
      category: CATEGORY,
      image: `/wa-apps/blog/plugins/${PLUGIN_ID}/img/${PLUGIN_ID}.png`,
      content: { type: COMPONENT_TYPE, },
      activate: true,
    };

    editor.Blocks.add(COMPONENT_TYPE, block);
    editor.DomComponents.addType(COMPONENT_TYPE, component);

    return {};
  }

  webkit.plugins.add(plugin);

})(window.webkit);

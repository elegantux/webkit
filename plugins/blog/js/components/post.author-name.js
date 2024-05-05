((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = 'blog_post_author_name';
    const COMPONENT_NAME = 'Author Name';
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Blog';
    const API_ENDPOINT = webkit.webkitBackendUrls.backendApiUrl + '?plugin=blog&module=default&action=authorName';

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
      NAME_TYPE: {
        name: `trait_${COMPONENT_TYPE}__name_type`,
        type: 'select',
        label: 'Name Type',
        default: 'name',
        changeProp: true,
        options: [
          { value: 'name', label: 'Full Name'},
          { value: 'firstname', label: 'First Name'},
          { value: 'middlename', label: 'Middle Name'},
          { value: 'lastname', label: 'Last Name'},
        ],
      }
    };

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          tabName: 'p',
          name: COMPONENT_NAME,
          attributes: { [DATA_KEY]: COMPONENT_TYPE, class: COMPONENT_TYPE },
          droppable: false,

          [TRAITS.NAME_TYPE.name]: TRAITS.NAME_TYPE.default,
          traits: [
            TRAITS.TAG_NAME,
            TRAITS.NAME_TYPE,
          ],
        },
      },
      view: {
        listenToProps: [
          TRAITS.NAME_TYPE.name,
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
              <h5 style="margin: 0; font-size: 24px;">Post not found!</h5>
              <p style="margin: 0; font-size: 14px;">Please create one or more posts.</p>
            </div>
          `;
          this.updateInnerHtml(view);
        },
        async handleTraitsChange(model) {
          this.setLoadingView();

          const name_type = model.get(TRAITS.NAME_TYPE.name);

          const formData = new FormData();
          formData.append(TRAITS.NAME_TYPE.name, name_type);
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
    <path d="M19.1111 19.7144V18.0001C19.1111 17.0908 18.7365 16.2187 18.0697 15.5757C17.4029 14.9328 16.4986 14.5715 15.5556 14.5715H8.44447C7.50148 14.5715 6.59711 14.9328 5.93031 15.5757C5.26352 16.2187 4.88892 17.0908 4.88892 18.0001V19.7144" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 11.9999C14.2091 11.9999 16 10.273 16 8.14279C16 6.01255 14.2091 4.28564 12 4.28564C9.79086 4.28564 8 6.01255 8 8.14279C8 10.273 9.79086 11.9999 12 11.9999Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 10.0714V8.14282" stroke="currentColor" stroke-width="0.67" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 6.69995H12.0052" stroke="currentColor" stroke-width="0.67" stroke-linecap="round" stroke-linejoin="round"/>
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

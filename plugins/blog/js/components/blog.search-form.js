((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = 'blog_search_form';
    const COMPONENT_NAME = 'Search Form';
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Blog';

    const BLOCK_ICON_HTML = `<svg width="100%" height="52px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.7776 3.81812H7.33314C6.92058 3.81812 6.52492 3.99052 6.2332 4.2974C5.94148 4.60427 5.77759 5.02049 5.77759 5.45448V18.5454C5.77759 18.9794 5.94148 19.3956 6.2332 19.7025C6.52492 20.0094 6.92058 20.1818 7.33314 20.1818H16.6665C17.079 20.1818 17.4747 20.0094 17.7664 19.7025C18.0581 19.3956 18.222 18.9794 18.222 18.5454V9.54539L12.7776 3.81812Z" stroke="currentColor" stroke-width="0.818182" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12.7778 3.81812V9.54539H18.2223" stroke="currentColor" stroke-width="0.818182" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11.6667 17.3336C13.1394 17.3336 14.3333 16.1397 14.3333 14.6669C14.3333 13.1942 13.1394 12.0002 11.6667 12.0002C10.1939 12.0002 9 13.1942 9 14.6669C9 16.1397 10.1939 17.3336 11.6667 17.3336Z" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15 18L13.55 16.55" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          tagName: 'form',
          attributes: {
            [DATA_KEY]: COMPONENT_TYPE,
            class: `.${COMPONENT_TYPE}`,
            // Form attributes
            method: 'get',
            action: '{$wa_app_url}',
          },
          droppable: false,
          styles: `
            .${COMPONENT_TYPE} {
              position: relative;
              display: flex;
              width: max-content;
            }
            .${COMPONENT_TYPE}_input::-ms-clear,
            .${COMPONENT_TYPE}_input::-ms-reveal {
              display: none;
              width : 0;
              height: 0;
            }
            
            .${COMPONENT_TYPE}_input::-webkit-search-decoration,
            .${COMPONENT_TYPE}_input::-webkit-search-cancel-button,
            .${COMPONENT_TYPE}_input::-webkit-search-results-button,
            .${COMPONENT_TYPE}_input::-webkit-search-results-decoration {
              display: none;
            }
            
            .${COMPONENT_TYPE}_input:focus {
              outline: none;
            }

            .${COMPONENT_TYPE}_input {
              padding-left: 12px;
              padding-right: 52px;
              padding-top: 8px;
              padding-bottom: 8px;
              border-style: solid;
              border-color: #e6e6e6ff;
              border-top-width: 0.5px;
              border-right-width: 0.5px;
              border-bottom-width: 0.5px;
              border-left-width: 0.5px;
              border-top-left-radius: 8px;
              border-top-right-radius: 8px;
              border-bottom-left-radius: 8px;
              border-bottom-right-radius: 8px;
            }

            .${COMPONENT_TYPE}_button {
              position: absolute;
              top: 0px;
              right: 0px;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 42px;
              height: 100%;
              text-decoration: none;
            }
          `,
          components: [
            {
              name: 'input',
              tagName: 'input',
              draggable: `.${COMPONENT_TYPE}`,
              droppable: false,
              badgable: false,
              removable: false,
              copyable: false,
              attributes: {
                class: `.${COMPONENT_TYPE}_input`,
                type: 'search',
                name: 'query',
                // value: '{if !empty($blog_query)}{$blog_query}{/if}',
                placeholder: '[`Search posts`]',
              },
              traits: [
                {
                  type: 'text',
                  label: 'Input Placeholder',
                  name: 'placeholder',
                  default: '[`Search posts`]',
                }
              ],
            },
            {
              name: 'Button',
              type: 'basic_button',
              draggable: `.${COMPONENT_TYPE}`,
              badgable: false,
              copyable: false,
              attributes: { class: `.${COMPONENT_TYPE}_button`, },
              components: {
                type: 'basic_icon',
                attributes: { class: 'basic_icon fa-solid fa-magnifying-glass fa-fw', },
                style: { 'font-size': '18px', },
                droppable: false,
                badgable: false,
                removable: false,
                copyable: false,
              },
            }
          ],

          traits: [],
        },
      },
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

((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = "basic_html";
    const COMPONENT_NAME = "HTML";
    const DATA_KEY = "data-wk-type";
    const CATEGORY = "Basic";
    const ICON = `<svg width="100%" height="42px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 18L21 12L16 6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 6L3 12L8 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="8.53015" y1="20.829" x2="14.6865" y2="3.91452" stroke="currentColor"/>
</svg>`;

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          attributes: { [DATA_KEY]: COMPONENT_TYPE },
          content: '<h1>{$wa->title()|escape}</h1>',
          editable: false,
          droppable: false,

          // Traits
          traits: [
            {
              type: 'code_editor',
              label: 'HTML Code',
              name: 'content',
            },
          ],
        },
      },
      view: {
        init({ model }) {
          this.listenTo(model, 'change:content', this.renderPlaceholder);
        },
        renderPlaceholder() {
          const el = this.el;
          el.innerHTML = ICON;
        },
        onRender() {
          this.renderPlaceholder();
        }
      }
    };

    const block = {
      id: COMPONENT_TYPE,
      label: COMPONENT_NAME,
      category: CATEGORY,
      icon: ICON,
      content: { type: COMPONENT_TYPE, },
      activate: true,
    };

    editor.Blocks.add(COMPONENT_TYPE, block);
    editor.DomComponents.addType(COMPONENT_TYPE, component);

    return {};
  }

  webkit.plugins.add(plugin);

})(window.webkit);

((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = "basic_smarty";
    const COMPONENT_NAME = "Smarty";
    const DATA_KEY = "data-wk-type";
    const CATEGORY = "Basic";
    const ICON = `<svg width="100%" height="42px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.627841 11.8082V11.0597C1.29995 11.0597 1.76882 10.9188 2.03445 10.6371C2.3041 10.3554 2.43892 9.88447 2.43892 9.22443V7.29261C2.43892 6.73722 2.49124 6.25627 2.59588 5.84979C2.70455 5.4433 2.87962 5.10724 3.12109 4.84162C3.36257 4.57599 3.68454 4.37879 4.087 4.25C4.48947 4.12121 4.98651 4.05682 5.57812 4.05682V5.24006C5.11127 5.24006 4.74302 5.3125 4.47337 5.45739C4.20774 5.60227 4.01858 5.82765 3.9059 6.13352C3.79723 6.43537 3.7429 6.82173 3.7429 7.29261V9.70739C3.7429 10.0213 3.70064 10.3071 3.61612 10.5646C3.53563 10.8222 3.38471 11.0436 3.16335 11.2287C2.942 11.4138 2.62607 11.5567 2.21555 11.6573C1.80907 11.7579 1.27983 11.8082 0.627841 11.8082ZM5.57812 19.5114C4.98651 19.5114 4.48947 19.447 4.087 19.3182C3.68454 19.1894 3.36257 18.9922 3.12109 18.7266C2.87962 18.4609 2.70455 18.1249 2.59588 17.7184C2.49124 17.3119 2.43892 16.831 2.43892 16.2756V14.3438C2.43892 13.6837 2.3041 13.2128 2.03445 12.9311C1.76882 12.6494 1.29995 12.5085 0.627841 12.5085V11.7599C1.27983 11.7599 1.80907 11.8103 2.21555 11.9109C2.62607 12.0115 2.942 12.1544 3.16335 12.3395C3.38471 12.5246 3.53563 12.746 3.61612 13.0036C3.70064 13.2611 3.7429 13.5469 3.7429 13.8608V16.2756C3.7429 16.7464 3.79723 17.1328 3.9059 17.4347C4.01858 17.7365 4.20774 17.9599 4.47337 18.1048C4.74302 18.2537 5.11127 18.3281 5.57812 18.3281V19.5114ZM0.627841 12.5085V11.0597H2.05256V12.5085H0.627841Z" fill="currentColor"/>
    <path d="M23.5298 11.7599V12.5085C22.8577 12.5085 22.3868 12.6494 22.1172 12.9311C21.8516 13.2128 21.7188 13.6837 21.7188 14.3438V16.2756C21.7188 16.831 21.6644 17.3119 21.5558 17.7184C21.4511 18.1249 21.2781 18.4609 21.0366 18.7266C20.7951 18.9922 20.4731 19.1894 20.0707 19.3182C19.6682 19.447 19.1712 19.5114 18.5795 19.5114V18.3281C19.0464 18.3281 19.4126 18.2537 19.6783 18.1048C19.9479 17.9599 20.1371 17.7365 20.2457 17.4347C20.3584 17.1328 20.4148 16.7464 20.4148 16.2756V13.8608C20.4148 13.5469 20.455 13.2611 20.5355 13.0036C20.62 12.746 20.773 12.5246 20.9943 12.3395C21.2157 12.1544 21.5296 12.0115 21.9361 11.9109C22.3466 11.8103 22.8778 11.7599 23.5298 11.7599ZM18.5795 4.05682C19.1712 4.05682 19.6682 4.12121 20.0707 4.25C20.4731 4.37879 20.7951 4.57599 21.0366 4.84162C21.2781 5.10724 21.4511 5.4433 21.5558 5.84979C21.6644 6.25627 21.7188 6.73722 21.7188 7.29261V9.22443C21.7188 9.88447 21.8516 10.3554 22.1172 10.6371C22.3868 10.9188 22.8577 11.0597 23.5298 11.0597V11.8082C22.8778 11.8082 22.3466 11.7579 21.9361 11.6573C21.5296 11.5567 21.2157 11.4138 20.9943 11.2287C20.773 11.0436 20.62 10.8222 20.5355 10.5646C20.455 10.3071 20.4148 10.0213 20.4148 9.70739V7.29261C20.4148 6.82173 20.3584 6.43537 20.2457 6.13352C20.1371 5.82765 19.9479 5.60227 19.6783 5.45739C19.4126 5.3125 19.0464 5.24006 18.5795 5.24006V4.05682ZM23.5298 11.0597V12.5085H22.1051V11.0597H23.5298Z" fill="currentColor"/>
    <rect x="7" y="15" width="2" height="2" rx="1" fill="currentColor"/>
    <rect x="11" y="15" width="2" height="2" rx="1" fill="currentColor"/>
    <rect x="15" y="15" width="2" height="2" rx="1" fill="currentColor"/>
</svg>`;

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          attributes: { [DATA_KEY]: COMPONENT_TYPE },
          content: '{$wa->title()|escape}',
          editable: false,
          droppable: false,

          // Traits
          traits: [
            {
              type: 'code_editor',
              label: 'Smarty Code',
              name: 'content',
            },
          ],
          // toolbar: [
          //   {
          //     label: '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill-opacity="0" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>',
          //     command: 'tlb-move'
          //   },
          //   {
          //     // attributes: {class: 'fa fa-trash'},
          //     label: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" fill-opacity="0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
          //     command: 'tlb-delete'
          //   }
          // ],
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

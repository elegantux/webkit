((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = "basic_text";
    const COMPONENT_NAME = "Text";
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Basic';

    const component = {
      extend: 'text',
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          attributes: { [DATA_KEY]: COMPONENT_TYPE },
          style: { 'font-size': '16px' },
          components: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
          editable: true,
        },
      },
    };

    const block = {
      id: COMPONENT_TYPE,
      label: COMPONENT_NAME,
      category: CATEGORY,
      icon: `<svg width="100%" height="62px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.67578 5.48047C9.01953 5.48047 8.47949 5.51465 8.05566 5.58301C7.64551 5.65137 7.30371 5.79492 7.03027 6.01367C6.77051 6.23242 6.55859 6.54004 6.39453 6.93652C6.24414 7.31934 6.10059 7.83203 5.96387 8.47461H5.38965L5.5332 4.49609H18.7402L18.8838 8.47461H18.3096C18.1729 7.83203 18.0225 7.31934 17.8584 6.93652C17.708 6.54004 17.5029 6.23242 17.2432 6.01367C16.9834 5.79492 16.6416 5.65137 16.2178 5.58301C15.7939 5.51465 15.2471 5.48047 14.5771 5.48047H13.3262V17.4775C13.3262 17.9014 13.3535 18.2432 13.4082 18.5029C13.4629 18.7627 13.5654 18.9678 13.7158 19.1182C13.8799 19.2686 14.1055 19.3779 14.3926 19.4463C14.6934 19.501 15.083 19.542 15.5615 19.5693V20H8.75293V19.5693C9.23145 19.542 9.61426 19.501 9.90137 19.4463C10.1885 19.3779 10.4072 19.2617 10.5576 19.0977C10.7217 18.9199 10.8242 18.6807 10.8652 18.3799C10.9199 18.0791 10.9473 17.6826 10.9473 17.1904V5.48047H9.67578Z" fill="currentColor"/></svg>`,
      content: { type: COMPONENT_TYPE, },
      activate: true,
    };

    editor.Blocks.add(COMPONENT_TYPE, block);
    editor.DomComponents.addType(COMPONENT_TYPE, component);

    return {};
  }

  webkit.plugins.add(plugin);

})(window.webkit);

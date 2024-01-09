((webkit) => {
  const block1 = {
    id: 'my-block-1',
    block: {
      label: 'My block 1',
      content: '<div class="my-block-1">My block 1 TEST</div>',
    }
  };

  async function plugin(template) {
    // All AJAX requests must be made inside the plugin function.

    return {
      id: '',
      name: '',

      dependencies: {
        styles: [''],
        scripts: [''],
      },

      blocks: [block1],

      components: [
        {
          type: '',
          component: {}
        }
      ],
    };
  }

webkit.plugins.add(plugin);

})(window.webkit);

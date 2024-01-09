((webkit) => {
  const block1 = {
    id: 'post-title-block',
    block: {
      label: 'Post title',
      content: '<div class="my-block-1">Dynamic Post Title here</div>',
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

((webkit) => {
  const POST_TITLE_COMPONENT_TYPE = 'blog.post.title';
  const POST_TITLE_COMPONENT_NAME = 'Post Title';

  const postTitleComponent = {
    type: POST_TITLE_COMPONENT_TYPE,
    definition: {
      extend: 'text',
      isComponent: (el) => el?.dataset?.['data-gjs-type'] === POST_TITLE_COMPONENT_TYPE,
      model: {
        defaults: {
          tagName: 'h2',
          name: POST_TITLE_COMPONENT_NAME,
          attributes: { 'data-gjs-type': POST_TITLE_COMPONENT_TYPE },
          // components: {
          //   type: 'text',
          //   attributes: { 'data-gjs-type': 'text' },
          //   content: 'Some post title',
          // },
          content: 'Some post title',
          editable: true,
        },
      },
    }
  };
  const block1 = {
    id: POST_TITLE_COMPONENT_TYPE,
    label: POST_TITLE_COMPONENT_NAME,
    category: 'Blog Post',
    icon: `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
        </svg>`,
    // Use `image` component
    // content: { type: 'image' },
    content: { type: POST_TITLE_COMPONENT_TYPE, },
    // The component `image` is activatable (shows the Asset Manager).
    // We want to activate it once dropped in the canvas.
    activate: true,
    // select: true, // Default with `activate: true`
  };

  async function plugin(params) {
    // All AJAX requests must be made inside the plugin function.
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(POST_TITLE_COMPONENT_TYPE, params);

    return {
      id: '',
      name: '',

      blocks: [block1],

      components: [postTitleComponent],
    };
  }

  webkit.plugins.add(plugin);

})(window.webkit);

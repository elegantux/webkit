((webkit) => {
  const PRODUCT_PRICE_COMPONENT_TYPE = 'shop.product.price';
  const PRODUCT_PRICE_COMPONENT_NAME = 'Price';

  const productPriceComponent = {
    type: PRODUCT_PRICE_COMPONENT_TYPE,
    definition: {
      isComponent: (el) => el?.dataset?.['data-gjs-type'] === PRODUCT_PRICE_COMPONENT_TYPE,
      model: {
        defaults: {
          tagName: 'span',
          name: PRODUCT_PRICE_COMPONENT_NAME,
          attributes: { 'data-gjs-type': PRODUCT_PRICE_COMPONENT_TYPE },
          content: '999$',
          editable: true,

          // Traits
          templateId: null,
          traits: [
            {
              type: 'text',
              name: 'templateId',
              label: 'Template ID',
              placeholder: '0',
              min: 0, // Minimum number value
            }
          ]
        },
      },
    }
  };

  const block1 = {
    id: PRODUCT_PRICE_COMPONENT_TYPE,
    label: PRODUCT_PRICE_COMPONENT_NAME,
    category: 'Shop Product',
    icon: `<svg style="width:64px;height:64px" viewBox="0 0 24 24">
            <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
        </svg>`,
    image: 'http://localhost:8888/wa-apps/shop/img/shop.svg?v=10.1.1',
    // Use `image` component
    // content: { type: 'image' },
    content: { type: PRODUCT_PRICE_COMPONENT_TYPE, },
    // The component `image` is activatable (shows the Asset Manager).
    // We want to activate it once dropped in the canvas.
    activate: true,
    // select: true, // Default with `activate: true`
  };

  const block2 = {
    id: PRODUCT_PRICE_COMPONENT_TYPE + '_test',
    label: 'Sale Price',
    category: 'Shop Product',
    icon: `<svg style="width:64px;height:64px" viewBox="0 0 24 24">
            <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
        </svg>`,
    image: 'http://localhost:8888/wa-apps/shop/img/shop.svg?v=10.1.1',
    // Use `image` component
    // content: { type: 'image' },
    content: { type: PRODUCT_PRICE_COMPONENT_TYPE, },
    // The component `image` is activatable (shows the Asset Manager).
    // We want to activate it once dropped in the canvas.
    activate: true,
    // select: true, // Default with `activate: true`
  };

  async function plugin(editor, params) {
    // All AJAX requests must be made inside the plugin function.
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(PRODUCT_PRICE_COMPONENT_TYPE, params);

    return {
      id: '',
      name: '',

      blocks: [block1, block2],

      components: [productPriceComponent],
    };
  }

webkit.plugins.add(plugin);

})(window.webkit);

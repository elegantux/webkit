((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = 'blog_pagination';
    const COMPONENT_NAME = 'Blog Pagination';
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Blog';
    const API_ENDPOINT = webkit.webkitBackendUrls.backendApiUrl + '?plugin=blog&module=default&action=pagination';

    const BLOCK_ICON_HTML = `<svg width="100%" height="82px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="10" width="4" height="4" rx="0.5" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4.16602 11.2981V12.636C4.16602 12.6633 4.16862 12.6855 4.17383 12.7024C4.17904 12.718 4.18945 12.731 4.20508 12.7415C4.2207 12.7506 4.24219 12.7571 4.26953 12.761C4.29818 12.7649 4.33464 12.7675 4.37891 12.7688V12.8H3.76367V12.7688C3.80664 12.7675 3.8418 12.7636 3.86914 12.7571C3.89648 12.7506 3.91797 12.7408 3.93359 12.7278C3.94922 12.7148 3.95964 12.6978 3.96484 12.677C3.97135 12.6549 3.97461 12.6269 3.97461 12.593V11.5852C3.97461 11.5136 3.95247 11.4778 3.9082 11.4778C3.88477 11.4778 3.85091 11.4862 3.80664 11.5032L3.74609 11.5286V11.4954L4.14648 11.2942L4.16602 11.2981Z" fill="currentColor"/>
    <rect x="8" y="10" width="4" height="4" rx="0.5" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10.4355 12.8H9.56641V12.7727L9.96289 12.3528C10.0566 12.2525 10.1283 12.1529 10.1777 12.054C10.2285 11.955 10.2539 11.8619 10.2539 11.7747C10.2539 11.6796 10.2253 11.6034 10.168 11.5461C10.112 11.4875 10.0352 11.4583 9.9375 11.4583C9.89844 11.4583 9.86393 11.4635 9.83398 11.4739C9.80404 11.483 9.77669 11.4993 9.75195 11.5227C9.72721 11.5448 9.70378 11.5741 9.68164 11.6106C9.65951 11.6471 9.63737 11.6926 9.61523 11.7473L9.56836 11.7375C9.57747 11.6985 9.58659 11.664 9.5957 11.634C9.60612 11.6041 9.61654 11.5774 9.62695 11.554C9.63867 11.5305 9.65104 11.509 9.66406 11.4895C9.67708 11.47 9.69271 11.4504 9.71094 11.4309C9.7526 11.3866 9.80078 11.3528 9.85547 11.3293C9.91146 11.3059 9.97005 11.2942 10.0312 11.2942C10.0898 11.2942 10.1439 11.3046 10.1934 11.3254C10.2441 11.345 10.2878 11.3723 10.3242 11.4075C10.362 11.4426 10.3913 11.4843 10.4121 11.5325C10.4342 11.5793 10.4453 11.6301 10.4453 11.6848C10.4453 11.7747 10.4219 11.8632 10.375 11.9504C10.3294 12.0377 10.2578 12.134 10.1602 12.2395L9.78516 12.6301H10.3164C10.3411 12.6301 10.3626 12.6288 10.3809 12.6262C10.3991 12.6223 10.4154 12.6152 10.4297 12.6047C10.4453 12.5943 10.4603 12.5793 10.4746 12.5598C10.4902 12.5403 10.5085 12.5142 10.5293 12.4817L10.5586 12.4954L10.4355 12.8Z" fill="currentColor"/>
    <rect x="18" y="10" width="4" height="4" rx="0.5" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M19.625 12.8059C19.7096 12.7916 19.7884 12.7662 19.8613 12.7297C19.9342 12.6933 19.9993 12.6471 20.0566 12.5911C20.1139 12.5351 20.1634 12.47 20.2051 12.3958C20.2467 12.3202 20.2793 12.2369 20.3027 12.1458C20.2428 12.1913 20.1875 12.2239 20.1367 12.2434C20.0859 12.2629 20.0293 12.2727 19.9668 12.2727C19.9069 12.2727 19.8522 12.2623 19.8027 12.2415C19.7533 12.2193 19.7109 12.1887 19.6758 12.1497C19.6406 12.1093 19.6133 12.0618 19.5938 12.0071C19.5755 11.9511 19.5664 11.8892 19.5664 11.8215C19.5664 11.746 19.5781 11.6764 19.6016 11.6125C19.625 11.5474 19.6576 11.4915 19.6992 11.4446C19.7409 11.3977 19.7897 11.3612 19.8457 11.3352C19.9017 11.3079 19.9629 11.2942 20.0293 11.2942C20.1022 11.2942 20.1686 11.3098 20.2285 11.3411C20.2897 11.371 20.3418 11.414 20.3848 11.47C20.429 11.5247 20.4629 11.5904 20.4863 11.6672C20.5111 11.7441 20.5234 11.8287 20.5234 11.9211C20.5234 11.998 20.515 12.0728 20.498 12.1458C20.4811 12.2187 20.4564 12.2877 20.4238 12.3528C20.3913 12.4179 20.3509 12.4784 20.3027 12.5344C20.2559 12.5891 20.2025 12.6366 20.1426 12.677C20.1048 12.703 20.0684 12.7258 20.0332 12.7454C19.998 12.7636 19.9609 12.7792 19.9219 12.7922C19.8828 12.8053 19.8398 12.8163 19.793 12.8254C19.7461 12.8346 19.6921 12.8424 19.6309 12.8489L19.625 12.8059ZM20.3066 11.9211C20.3066 11.7336 20.2819 11.5924 20.2324 11.4973C20.1829 11.4023 20.1094 11.3547 20.0117 11.3547C19.9427 11.3547 19.8887 11.3801 19.8496 11.4309C19.8379 11.4465 19.8275 11.4661 19.8184 11.4895C19.8092 11.5116 19.8008 11.537 19.793 11.5657C19.7865 11.593 19.7812 11.6223 19.7773 11.6536C19.7734 11.6835 19.7715 11.7135 19.7715 11.7434C19.7715 11.8775 19.7962 11.9836 19.8457 12.0618C19.8952 12.1386 19.9622 12.177 20.0469 12.177C20.0885 12.177 20.1289 12.1698 20.168 12.1555C20.2083 12.1399 20.2448 12.1184 20.2773 12.0911C20.2878 12.0819 20.2949 12.0715 20.2988 12.0598C20.304 12.0481 20.3066 12.0318 20.3066 12.011V11.9211Z" fill="currentColor"/>
    <path d="M14.0625 13.5586C14.125 13.5586 14.181 13.5833 14.2305 13.6328C14.2826 13.6823 14.3086 13.7409 14.3086 13.8086C14.3086 13.8737 14.2826 13.931 14.2305 13.9805C14.181 14.0273 14.1224 14.0508 14.0547 14.0508C13.987 14.0508 13.9284 14.0273 13.8789 13.9805C13.832 13.931 13.8086 13.8724 13.8086 13.8047C13.8086 13.7344 13.8333 13.6758 13.8828 13.6289C13.9323 13.582 13.9922 13.5586 14.0625 13.5586ZM15.1758 13.5586C15.2383 13.5586 15.2943 13.5833 15.3438 13.6328C15.3958 13.6823 15.4219 13.7409 15.4219 13.8086C15.4219 13.8737 15.3958 13.931 15.3438 13.9805C15.2943 14.0273 15.2357 14.0508 15.168 14.0508C15.1003 14.0508 15.0417 14.0273 14.9922 13.9805C14.9453 13.931 14.9219 13.8724 14.9219 13.8047C14.9219 13.7344 14.9466 13.6758 14.9961 13.6289C15.0456 13.582 15.1055 13.5586 15.1758 13.5586ZM16.2891 13.5586C16.3516 13.5586 16.4076 13.5833 16.457 13.6328C16.5091 13.6823 16.5352 13.7409 16.5352 13.8086C16.5352 13.8737 16.5091 13.931 16.457 13.9805C16.4076 14.0273 16.349 14.0508 16.2812 14.0508C16.2135 14.0508 16.1549 14.0273 16.1055 13.9805C16.0586 13.931 16.0352 13.8724 16.0352 13.8047C16.0352 13.7344 16.0599 13.6758 16.1094 13.6289C16.1589 13.582 16.2188 13.5586 16.2891 13.5586Z" fill="currentColor"/>
</svg>
`;
    const LOADING_ANIMATION_HTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 20" xml:space="preserve" style="width: 44px; height: 20px"><circle fill="#0051d2" cx="6" cy="10" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".1"></animate></circle><circle fill="#0051d2" cx="26" cy="10" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".2"></animate></circle><circle fill="#0051d2" cx="46" cy="10" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".3"></animate></circle></svg>';
    const EMPTY_VIEW_HTML = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen-Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 24px;">
      ${BLOCK_ICON_HTML}
      <h5 style="margin: 0; font-size: 24px;">${COMPONENT_NAME}</h5>
      <p style="margin: 0; font-size: 14px;">Please configure the component settings</p>
    </div>
`;

    const TRAITS = {
      CONTAINER_SELECTOR: {
        type: 'child_selector',
        label: 'Container Styles',
        name: `trait_${COMPONENT_TYPE}__container_css_rules`,
        value: '.blog_pagination_container',
        changeProp: true,
      },
      ITEM_SELECTOR: {
        type: 'child_selector',
        label: 'Item Styles',
        name: `trait_${COMPONENT_TYPE}__item_css_rules`,
        value: '.blog_pagination_item',
        changeProp: true,
      },
      ACTIVE_ITEM_SELECTOR: {
        type: 'child_selector',
        label: 'Item Styles',
        name: `trait_${COMPONENT_TYPE}__active_item_css_rules`,
        value: '.blog_pagination_item.active',
        changeProp: true,
      },
      LINK_SELECTOR: {
        type: 'child_selector',
        label: 'Link Styles',
        name: `trait_${COMPONENT_TYPE}__link_css_rules`,
        value: '.blog_pagination_link',
        changeProp: true,
      },
      ACTIVE_LINK_SELECTOR: {
        type: 'child_selector',
        label: 'Selected Link Styles',
        name: `trait_${COMPONENT_TYPE}__active_link_css_rules`,
        value: '.blog_pagination_link.active',
        changeProp: true,
      },
    };

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          attributes: { [DATA_KEY]: COMPONENT_TYPE, class: `.${COMPONENT_TYPE}` },
          droppable: false,

          [TRAITS.CONTAINER_SELECTOR.name]: TRAITS.CONTAINER_SELECTOR.value,
          [TRAITS.ITEM_SELECTOR.name]: TRAITS.ITEM_SELECTOR.value,
          [TRAITS.ACTIVE_ITEM_SELECTOR.name]: TRAITS.ACTIVE_ITEM_SELECTOR.value,
          [TRAITS.LINK_SELECTOR.name]: TRAITS.LINK_SELECTOR.value,
          [TRAITS.ACTIVE_LINK_SELECTOR.name]: TRAITS.ACTIVE_LINK_SELECTOR.value,
          traits: [
            TRAITS.CONTAINER_SELECTOR,
            TRAITS.ITEM_SELECTOR,
            TRAITS.ACTIVE_ITEM_SELECTOR,
            TRAITS.LINK_SELECTOR,
            TRAITS.ACTIVE_LINK_SELECTOR,
          ],
        },
      },
      view: {
        onRender({ model }) {
          this.handleTraitsChange(model);
        },
        updateInnerHtml(innerHtml) {
          this.el.innerHTML = innerHtml;
        },
        setLoadingView() {
          this.updateInnerHtml(LOADING_ANIMATION_HTML);
        },
        setEmptyView() {
          this.updateInnerHtml(EMPTY_VIEW_HTML);
        },
        async handleTraitsChange(model) {
          this.setLoadingView();

          const formData = new FormData();
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

          // Clear components to make sure that there is nothing in there.
          this.model.components(null);

          // Update content
          // this.model.set('components', responseBody.data.model);

          // Use the "content" property instead of "components" to prevent formatting
          // of smarties used in html element attributes.
          this.model.set('content', responseBody.data.model);

          // Update the widget view in the canvas
          this.updateInnerHtml(responseBody.data.view);
        },
      }
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

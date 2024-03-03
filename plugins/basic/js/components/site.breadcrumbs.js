((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = 'site_breadcrumbs';
    const COMPONENT_NAME = 'Breadcrumbs';
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Site';
    const API_ENDPOINT = webkit.webkitBackendUrls.backendApiUrl + '?plugin=basic&module=default&action=breadcrumbs';
    const GROUPS = {
      PREFIX_SUFFIX: 'Link Prefix & Suffix',
      DIVIDER: 'Divider',
      STYLES: 'Styles',
    };

    const TRAITS = {
      SHOW_MAIN_PAGE: {
        type: 'checkbox',
        label: 'Show main page',
        name: `trait_${COMPONENT_TYPE}__show_main_page`,
        text: 'Prepend main page to the breadcrumbs',
        default: false,
        changeProp: this,
      },
      MAIN_PAGE_NAME: {
        type: 'text',
        label: 'Main page name',
        name: `trait_${COMPONENT_TYPE}__main_page_name`,
        placeholder: 'Main',
        changeProp: this,
      },
      PREFIX_HTML: {
        type: 'code_editor',
        label: 'Prefix HTML',
        name: `trait_${COMPONENT_TYPE}__prefix_html`,
        changeProp: this,
        colSpan: 1,
        group: GROUPS.PREFIX_SUFFIX,
      },
      SUFFIX_HTML: {
        type: 'code_editor',
        label: 'Suffix HTML',
        name: `trait_${COMPONENT_TYPE}__suffix_html`,
        changeProp: this,
        colSpan: 1,
        group: GROUPS.PREFIX_SUFFIX,
      },
      SHOW_DIVIDER: {
        type: 'checkbox',
        label: 'Links divider',
        name: `trait_${COMPONENT_TYPE}__show_divider`,
        text: 'Show breadcrumb links divider',
        changeProp: this,
        default: true,
        group: GROUPS.DIVIDER,
      },
      DIVIDER_ICON: {
        type: 'icon',
        label: 'Divider Icon',
        name: `trait_${COMPONENT_TYPE}__divider_icon`,
        changeProp: this,
        group: GROUPS.DIVIDER,
      },
      DIVIDER_HTML: {
        type: 'code_editor',
        label: 'Divider HTML',
        name: `trait_${COMPONENT_TYPE}__divider_html`,
        changeProp: this,
        group: GROUPS.DIVIDER,
      },
      // Styles
      STYLE_LINKS_COLOR: {
        type: 'color',
        label: 'Links color',
        name: `trait_${COMPONENT_TYPE}__style_links_color`,
        changeProp: this,
        colSpan: 1,
        group: GROUPS.STYLES,
      },
      STYLE_LINKS_TEXT_DECORATION: {
        type: 'select',
        label: 'Text Decoration',
        name: `trait_${COMPONENT_TYPE}__style_text_decoration`,
        default: '',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Line Through', value: 'line-through' },
          { label: 'Overline', value: 'overline' },
          { label: 'Underline', value: 'underline' },
        ],
        changeProp: this,
        colSpan: 1,
        group: GROUPS.STYLES,
      },
      STYLE_ICON_SIZE: {
        type: 'number',
        label: 'Icon Size',
        name: `trait_${COMPONENT_TYPE}__style_icon_size`,
        default: '',
        options: [{ value: 'px', label: 'px' }],
        changeProp: this,
        group: GROUPS.STYLES,
      },
    };

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          attributes: { [DATA_KEY]: COMPONENT_TYPE, itemprop: 'breadcrumb' },
          droppable: false,

          // Traits
          [TRAITS.SHOW_MAIN_PAGE.name]: false,
          [TRAITS.MAIN_PAGE_NAME.name]: '',
          [TRAITS.PREFIX_HTML.name]: '',
          [TRAITS.SUFFIX_HTML.name]: '',
          [TRAITS.SHOW_DIVIDER.name]: true,
          [TRAITS.DIVIDER_ICON.name]: '',
          [TRAITS.DIVIDER_HTML.name]: '',
          [TRAITS.STYLE_LINKS_COLOR.name]: '',
          [TRAITS.STYLE_LINKS_TEXT_DECORATION.name]: '',
          [TRAITS.STYLE_ICON_SIZE.name]: '',
          traits: [
            TRAITS.SHOW_MAIN_PAGE,
            TRAITS.MAIN_PAGE_NAME,
            TRAITS.SHOW_DIVIDER,
            TRAITS.DIVIDER_ICON,
            TRAITS.DIVIDER_HTML,
            TRAITS.STYLE_LINKS_COLOR,
            TRAITS.STYLE_LINKS_TEXT_DECORATION,
            TRAITS.STYLE_ICON_SIZE,
            TRAITS.PREFIX_HTML,
            TRAITS.SUFFIX_HTML,
          ],
        },
      },
      view: {
        listenToProps: [
          TRAITS.SHOW_MAIN_PAGE.name,
          TRAITS.MAIN_PAGE_NAME.name,
          TRAITS.PREFIX_HTML.name,
          TRAITS.SUFFIX_HTML.name,
          TRAITS.SHOW_DIVIDER.name,
          TRAITS.DIVIDER_ICON.name,
          TRAITS.DIVIDER_HTML.name,
        ],
        listenToStyleProps: [
          TRAITS.STYLE_LINKS_COLOR.name,
          TRAITS.STYLE_LINKS_TEXT_DECORATION.name,
          TRAITS.STYLE_ICON_SIZE.name,
        ],
        init({ model }) {
          const propsList = this.listenToProps.map((prop) => `change:${prop}`).join(' ');
          this.listenTo(model, propsList, this.handleTraitsChange);

          const stylePropsList = this.listenToStyleProps.map((prop) => `change:${prop}`).join(' ');
          this.listenTo(model, stylePropsList, this.handleStyleChange);
        },
        onRender({ el, model }) {
          this.handleTraitsChange(model);
        },
        updateInnerHtml(innerHtml) {
          this.el.innerHTML = innerHtml;
        },
        setLoadingView() {
          const loader =
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 20" xml:space="preserve" style="width: 44px; height: 20px"><circle fill="#0051d2" cx="6" cy="10" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".1"></animate></circle><circle fill="#0051d2" cx="26" cy="10" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".2"></animate></circle><circle fill="#0051d2" cx="46" cy="10" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".3"></animate></circle></svg>';
          this.updateInnerHtml(loader);
        },
        async handleTraitsChange(model) {
          this.setLoadingView();

          const showMainPage = !!model.get(TRAITS.SHOW_MAIN_PAGE.name);
          const mainPageName = model.get(TRAITS.MAIN_PAGE_NAME.name);
          const prefixHtml = model.get(TRAITS.PREFIX_HTML.name);
          const suffixHtml = model.get(TRAITS.SUFFIX_HTML.name);
          const showDivider = !!model.get(TRAITS.SHOW_DIVIDER.name);
          const dividerIcon = model.get(TRAITS.DIVIDER_ICON.name);
          const dividerHtml = model.get(TRAITS.DIVIDER_HTML.name);

          if (showMainPage) {
            this.model.addTrait(TRAITS.MAIN_PAGE_NAME);
          } else {
            this.model.removeTrait(TRAITS.MAIN_PAGE_NAME.name);
          }

          if (showDivider) {
            this.model.addTrait(TRAITS.DIVIDER_ICON);
            this.model.addTrait(TRAITS.DIVIDER_HTML);
          } else {
            this.model.removeTrait(TRAITS.DIVIDER_ICON.name);
            this.model.removeTrait(TRAITS.DIVIDER_HTML.name);
          }

          const formData = new FormData();
          formData.append(TRAITS.SHOW_MAIN_PAGE.name, showMainPage);
          formData.append(TRAITS.MAIN_PAGE_NAME.name, mainPageName);
          formData.append(TRAITS.PREFIX_HTML.name, prefixHtml);
          formData.append(TRAITS.SUFFIX_HTML.name, suffixHtml);
          formData.append(TRAITS.SHOW_DIVIDER.name, showDivider);
          formData.append(TRAITS.DIVIDER_ICON.name, dividerIcon);
          formData.append(TRAITS.DIVIDER_HTML.name, dividerHtml);
          formData.append('_csrf', window.webkit.getCsrf());

          const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            body: formData,
          });

          if (response.status !== 200) {
            throw new Error(await response.json());
          }

          const responseBody = await response.json();

          // Update content
          this.model.components(responseBody.data.model);

          editor.runCommand('trait-manager:update-property-list');

          // Update the widget view in the canvas
          this.updateInnerHtml(responseBody.data.view);
        },
        // TODO: Hover state?
        handleStyleChange() {
          const elementId = this.model.getId();

          const linksSelector = `#${elementId} a`;
          const iconsSelector = `#${elementId} i`;

          const linksColor = this.model.get(TRAITS.STYLE_LINKS_COLOR.name);
          const textDecoration = this.model.get(TRAITS.STYLE_LINKS_TEXT_DECORATION.name);
          const iconSize = this.model.get(TRAITS.STYLE_ICON_SIZE.name);

          const linksResultRule = {};
          const dividerIconResultRule = {};

          if (linksColor?.length > 0) {
            linksResultRule.color = linksColor;
          }

          if (textDecoration?.length > 0) {
            linksResultRule['text-decoration'] = textDecoration;
          }

          if (iconSize?.length > 0) {
            dividerIconResultRule['font-size'] = `${iconSize}px`;
          }

          if (Object.keys(linksResultRule).length > 0) {
            const [linkCssRule] = editor.StyleManager.select(linksSelector);
            linkCssRule.setStyle(linksResultRule);
          }

          if (Object.keys(dividerIconResultRule).length > 0) {
            const [iconCssRule] = editor.StyleManager.select(iconsSelector);
            iconCssRule.setStyle(dividerIconResultRule);
          }

          // Since we select selectors that cannot be selected in the editor we should
          // select back the parent component to prevent unnecessary assignment of styles
          editor.StyleManager.select(this.model);
        },
      },
    };

    const block = {
      id: COMPONENT_TYPE,
      label: COMPONENT_NAME,
      category: CATEGORY,
      icon: `<svg width="100%" height="42px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1.5" y="4.5" width="21" height="15" rx="1.5" stroke="currentColor"/>
    <rect x="3.25" y="8.25" width="4.5" height="0.5" rx="0.25" fill="currentColor" stroke="currentColor" stroke-width="0.5"/>
    <rect x="16.25" y="8.25" width="4.5" height="0.5" rx="0.25" fill="currentColor" stroke="currentColor" stroke-width="0.5"/>
    <path d="M10.5 10L13.5 8.5L10.5 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
      content: { type: COMPONENT_TYPE },
      activate: true,
    };

    editor.Blocks.add(COMPONENT_TYPE, block);
    editor.DomComponents.addType(COMPONENT_TYPE, component);

    return {};
  }

  webkit.plugins.add(plugin);
})(window.webkit);

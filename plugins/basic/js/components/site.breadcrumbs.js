((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = 'site_breadcrumbs';
    const COMPONENT_NAME = 'Breadcrumbs';
    const DATA_KEY = 'data-wk-type';
    const CATEGORY = 'Site';
    const API_ENDPOINT = webkit.webkitBackendUrls.backendApiUrl + '?plugin=basic&module=default&action=breadcrumbs';
    const GROUPS = {
      LINKS: 'Links',
      DIVIDER: 'Divider',
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
      DIVIDER_CSS_RULES: {
        type: 'css_rule_manager_button',
        label: 'Divider styles',
        // text: 'Update styles',
        name: `trait_${COMPONENT_TYPE}__divider_css_rules`,
        description: `<p style="display: flex; align-items: center; font-size: 14px; margin-top: 4px; opacity: 0.5;">Change styles of the breadcrumb divider.</p>`,
        group: GROUPS.DIVIDER,
        command: function(_e) {
          /**
           * 1. Get selector by clicked element
           * 2. Get cssRule by selector
           * 3. Get styles object from cssRule https://grapesjs.com/docs/api/css_rule.html#cssrule
           */
          const component = editor.getSelected();

          // Selector
          /**
           * Get element class name as selector first. If it doesn't have classes, then use id.
           * @type {string}
           */
          const linksSelector = `.${COMPONENT_TYPE}__divider`;

          // cssRule
          let linkCssRule = editor.Css.getRule(linksSelector);

          if (!linkCssRule) {
            linkCssRule = editor.Css.setRule(linksSelector, {});
          }

          editor.runCommand('rule-manager:toggle-sidebar', { component, cssRule: linkCssRule });
        },
      },
      DIVIDER_HTML: {
        type: 'code_editor',
        label: 'Divider HTML',
        name: `trait_${COMPONENT_TYPE}__divider_html`,
        changeProp: this,
        group: GROUPS.DIVIDER,
      },
      LINKS_CSS_RULES: {
        type: 'css_rule_manager_button',
        label: 'Link styles',
        name: `trait_${COMPONENT_TYPE}__links_css_rule`,
        // text: 'Update styles',
        description: `<p style="display: flex; align-items: center; font-size: 14px; margin-top: 4px; opacity: 0.5;">Change styles of the breadcrumb link.</p>`,
        group: GROUPS.LINKS,
        command: function(_e) {
          /**
           * 1. Get selector by clicked element
           * 2. Get cssRule by selector
           * 3. Get styles object from cssRule https://grapesjs.com/docs/api/css_rule.html#cssrule
           */
          const component = editor.getSelected();

          const lTargets = editor.SelectorManager.getSelectedTargets()
            .map((targetItem) => targetItem.getSelectorsString())
            .join(', ');

          // Selector
          /**
           * Get element class name as selector first. If it doesn't have classes, then use id.
           * @type {string}
           */
          const linksSelector = `${lTargets} .${COMPONENT_TYPE}__link`;

          console.log(linksSelector)

          // cssRule
          let linkCssRule = editor.Css.getRule(linksSelector);

          if (!linkCssRule) {
            linkCssRule = editor.Css.setRule(linksSelector, {});
          }

          editor.runCommand('rule-manager:toggle-sidebar', { component, cssRule: linkCssRule });
        },
      },
    };

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          attributes: { [DATA_KEY]: COMPONENT_TYPE, itemprop: 'breadcrumb', class: COMPONENT_TYPE },
          droppable: false,

          // Traits
          [TRAITS.SHOW_MAIN_PAGE.name]: false,
          [TRAITS.MAIN_PAGE_NAME.name]: '',
          [TRAITS.SHOW_DIVIDER.name]: true,
          [TRAITS.DIVIDER_ICON.name]: '',
          [TRAITS.DIVIDER_HTML.name]: '',
          // [TRAITS.STYLE_LINKS_COLOR.name]: '',
          // [TRAITS.STYLE_LINKS_TEXT_DECORATION.name]: '',
          // [TRAITS.STYLE_ICON_SIZE.name]: '',
          traits: [
            TRAITS.SHOW_MAIN_PAGE,
            TRAITS.MAIN_PAGE_NAME,
            TRAITS.LINKS_CSS_RULES,
            TRAITS.SHOW_DIVIDER,
            TRAITS.DIVIDER_ICON,
            TRAITS.DIVIDER_CSS_RULES,
            TRAITS.DIVIDER_HTML,
            // TRAITS.STYLE_LINKS_COLOR,
            // TRAITS.STYLE_LINKS_TEXT_DECORATION,
            // TRAITS.STYLE_ICON_SIZE,
          ],
        },
      },
      view: {
        listenToProps: [
          TRAITS.SHOW_MAIN_PAGE.name,
          TRAITS.MAIN_PAGE_NAME.name,
          TRAITS.SHOW_DIVIDER.name,
          TRAITS.DIVIDER_ICON.name,
          TRAITS.DIVIDER_HTML.name,
        ],
        init({ model }) {
          const propsList = this.listenToProps.map((prop) => `change:${prop}`).join(' ');
          this.listenTo(model, propsList, this.handleTraitsChange);
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

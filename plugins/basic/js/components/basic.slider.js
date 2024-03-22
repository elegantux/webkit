((webkit) => {
  const generateRandomColor = () => "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});

  function slidePlugin(editor) {
    const COMPONENT_TYPE = "basic_slider_slide";
    const DATA_KEY = "data-wk-type";
    const COMPONENT_NAME = "Carousel Slide";

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          attributes: { [DATA_KEY]: COMPONENT_TYPE, class: `${COMPONENT_TYPE} swiper-slide` },
          draggable: false,
          style: {
            'min-height': '200px',
            'padding-left': '24px',
            'padding-right': '24px',
            'padding-top': '24px',
            'padding-bottom': '24px',
            'border-radius': '6px',
          },
          components: [
            { type: 'basic_image', style: { height: '200px', width: '100%', 'object-fit': 'cover' } },
            { type: 'basic_heading' },
            { type: 'basic_text' },
          ],

          traits: [],
          toolbar: [],
        },
      },
    };

    editor.DomComponents.addType(COMPONENT_TYPE, component);
  }

  function sliderNavigationPlugin(editor) {
    const COMPONENT_TYPE = "basic_slider_navigation";
    const DATA_KEY = "data-wk-type";
    const COMPONENT_NAME = "Carousel Navigation";

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          draggable: false,
          copyable: false,
          attributes: {
            [DATA_KEY]: COMPONENT_TYPE,
          },
          style: {
            position: 'absolute',
            'z-index': 1,
            top: '50%',
            'margin-top': '-17px',
            'font-size': '34px',
            cursor: 'pointer',
          },
          components: { type: 'basic_icon', class: 'fa-solid fa-caret-left fa-fw' },

          traits: [],
          toolbar: [],
        },
      },
    };

    editor.DomComponents.addType(COMPONENT_TYPE, component);
  }

  function sliderPaginationPlugin(editor) {
    const COMPONENT_TYPE = "basic_slider_pagination";
    const DATA_KEY = "data-wk-type";
    const COMPONENT_NAME = "Carousel Pagination";

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          draggable: false,
          attributes: {
            [DATA_KEY]: COMPONENT_TYPE,
            class: 'swiper-pagination'
          },

          traits: [],
          toolbar: [],
        },
      },
    };

    editor.DomComponents.addType(COMPONENT_TYPE, component);
  }

  function sliderWrapperPlugin(editor) {
    const COMPONENT_TYPE = "basic_slider_wrapper";
    const DATA_KEY = "data-wk-type";
    const COMPONENT_NAME = "Carousel Wrapper";

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          draggable: false,
          droppable: false,
          selectable: false,
          hoverable: false,
          attributes: {
            [DATA_KEY]: COMPONENT_TYPE,
            class: 'swiper-wrapper'
          },

          toolbar: [],
        },
      },
    };

    editor.DomComponents.addType(COMPONENT_TYPE, component);
  }

  async function plugin(editor) {
    const COMPONENT_TYPE = "basic_slider";
    const COMPONENT_NAME = "Carousel";
    const DATA_KEY = "data-wk-type";
    const CATEGORY = "Basic";

    const TRAITS = {
      SLIDES_COUNT: `trait_${COMPONENT_TYPE}__slides_count`,
      SLIDES_PER_VIEW: `trait_${COMPONENT_TYPE}__slides_per_view`,
      SPACE_BETWEEN: `trait_${COMPONENT_TYPE}__space_between`,
      SHOW_NAVIGATION: `trait_${COMPONENT_TYPE}__show_navigation`,
      DYNAMIC_BULLETS: `trait_${COMPONENT_TYPE}__dynamic_bullets`,

      // Pagination
      SHOW_PAGINATION: `trait_${COMPONENT_TYPE}__show_pagination`,
      BULLETS_COLOR: `trait_${COMPONENT_TYPE}__bullets_color`,
      INACTIVE_BULLETS_COLOR: `trait_${COMPONENT_TYPE}__inactive_bullets_color`,
      INACTIVE_BULLETS_OPACITY: `trait_${COMPONENT_TYPE}__inactive_bullets_opacity`,
      BULLETS_WIDTH: `trait_${COMPONENT_TYPE}__bullets_width`,
      BULLETS_HEIGHT: `trait_${COMPONENT_TYPE}__bullets_height`,
      BULLETS_RADIUS: `trait_${COMPONENT_TYPE}__bullets_radius`,

      // Effect
      EFFECT: `trait_${COMPONENT_TYPE}__effect`,
    };

    const navigationDefaults = editor.Components.getType('basic_slider_navigation').model.prototype.defaults;
    const slideDefaults = editor.Components.getType('basic_slider_slide').model.prototype.defaults;

    const navigationComponents = [
      {
        type: 'basic_slider_navigation',
        attributes: { 'data-wk-swiper-button-prev': 'swiper-button-prev' },
        components: { type: 'basic_icon', attributes: { class: 'fa-solid fa-caret-left fa-fw' } },
        style: { ...navigationDefaults.style, left: '0px' },
      },
      {
        type: 'basic_slider_navigation',
        attributes: { 'data-wk-swiper-button-next': 'swiper-button-next' },
        components: { type: 'basic_icon', attributes: { class: 'fa-solid fa-caret-right fa-fw' } },
        style: { ...navigationDefaults.style, right: '0px' },
      }
    ];

    const paginationComponent = {
      type: 'basic_slider_pagination',
      attributes: { 'data-wk-swiper-pagination': 'swiper-pagination' },
    };

    const createSlideComponent = (slideId = 1) => ({
      type: 'basic_slider_slide',
      style: { ...slideDefaults.style, 'background-color': generateRandomColor() },
      components: [
        { type: 'basic_image', style: { height: '200px', width: '100%', 'object-fit': 'cover' } },
        { type: 'basic_heading', components: `Heading #${slideId}. Lorem Ipsum is simply dummy text.` },
        { type: 'basic_text' },
      ]
    });

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          attributes: { [DATA_KEY]: COMPONENT_TYPE, class: 'swiper' },
          style: {
            width: '100%',
            'padding-top': '24px',
            'padding-right': '24px',
            'padding-bottom': '24px',
            'padding-left': '24px',

            // Pagination styles
            '--swiper-pagination-bullet-inactive-color': '#abababff',
            '--swiper-pagination-color': '#0083ecff',
            '--swiper-pagination-bullet-inactive-opacity': '0.2',
            '--swiper-pagination-bullet-opacity': '1',
            '--swiper-pagination-bullet-width': '14px',
            '--swiper-pagination-bullet-height': '4px',
            '--swiper-pagination-bullet-border-radius': '12px',
          },
          droppable: false,

          components: [
            {
              type: 'basic_slider_wrapper',
              components: [1,2,3,4,5,6].map((slideId) => createSlideComponent(slideId)),
            },
            ...navigationComponents,
            paginationComponent,
          ],

          // This script runs in the website directly.
          'script-props': [
            TRAITS.SLIDES_COUNT,
            TRAITS.SLIDES_PER_VIEW,
            TRAITS.SPACE_BETWEEN,
            TRAITS.SHOW_NAVIGATION,
            TRAITS.SHOW_PAGINATION,
            TRAITS.DYNAMIC_BULLETS,
            TRAITS.EFFECT,
          ],
          script: function (props) {
            if (typeof Swiper === 'undefined') {
              console.error(`[WebKit]->[${COMPONENT_NAME}]: Cannot find Swiper sources!`);
              return;
            }

            var el = this;
            var elId = this.id;
            var slidesPerView = props.trait_basic_slider__slides_per_view;
            var spaceBetween = props.trait_basic_slider__space_between;
            var shopNavigation = props.trait_basic_slider__show_navigation;
            var shopPagination = props.trait_basic_slider__show_pagination;
            var dynamicBullets = props.trait_basic_slider__dynamic_bullets;
            var effect = props.trait_basic_slider__effect;

            var options = {
              slidesPerView: slidesPerView,
            };

            if (spaceBetween) {
              options['spaceBetween'] = spaceBetween;
            }

            if (shopNavigation) {
              options['navigation'] = {
                prevEl: '#' + elId + ' [data-wk-swiper-button-prev]',
                nextEl: '#' + elId + ' [data-wk-swiper-button-next]',
              };
            }

            if (shopPagination) {
              options['pagination'] = {
                el: '#' + elId + ' [data-wk-swiper-pagination]',
                dynamicBullets: dynamicBullets,
              };
            }

            if (effect && effect?.length > 0) {
              options['effect'] = effect;

              if (effect === 'fade') {
                options['crossFade'] = true;
              }
            }

            new Swiper(el, options);
          },

          // Traits
          [TRAITS.SLIDES_COUNT]: 6,
          [TRAITS.SLIDES_PER_VIEW]: 3,
          [TRAITS.SPACE_BETWEEN]: 24,
          [TRAITS.SHOW_NAVIGATION]: true,
          [TRAITS.SHOW_PAGINATION]: true,
          [TRAITS.DYNAMIC_BULLETS]: true,
          [TRAITS.BULLETS_COLOR]: '#0083ecff',
          [TRAITS.INACTIVE_BULLETS_COLOR]: '#abababff',
          [TRAITS.INACTIVE_BULLETS_OPACITY]: 0.2,
          [TRAITS.BULLETS_WIDTH]: 14,
          [TRAITS.BULLETS_HEIGHT]: 4,
          [TRAITS.BULLETS_RADIUS]: 12,
          [TRAITS.EFFECT]: '',
          traits: [
            {
              type: 'number',
              label: 'Slides count',
              name: TRAITS.SLIDES_COUNT,
              min: 1,
              default: 6,
              debounce: 200,
              colSpan: 1,
              changeProp: true,
            },
            {
              type: 'number',
              label: 'Slides per view',
              name: TRAITS.SLIDES_PER_VIEW,
              min: 1,
              default: 3,
              colSpan: 1,
              changeProp: true,
            },
            {
              type: 'number',
              label: 'Space between slides(px)',
              name: TRAITS.SPACE_BETWEEN,
              min: 0,
              changeProp: true,
            },
            // Navigation
            {
              type: 'checkbox',
              label: 'Show navigation',
              name: TRAITS.SHOW_NAVIGATION,
              text: 'Show/Hide slider navigation elements',
              changeProp: true,
              group: 'Navigation'
            },
            // Pagination
            {
              type: 'checkbox',
              label: 'Show pagination',
              name: TRAITS.SHOW_PAGINATION,
              text: 'Show/Hide slider pagination elements',
              changeProp: true,
              group: 'Pagination'
            },
            {
              type: 'checkbox',
              label: 'Dynamic bullets',
              name: TRAITS.DYNAMIC_BULLETS,
              text: 'Animate pagination elements',
              changeProp: true,
              group: 'Pagination'
            },
            {
              type: 'color',
              label: 'Active color',
              name: TRAITS.BULLETS_COLOR,
              default: '#0083ecff',
              changeProp: true,
              colSpan: 1,
              group: 'Pagination'
            },
            {
              type: 'color',
              label: 'Inactive color',
              name: TRAITS.INACTIVE_BULLETS_COLOR,
              default: '#abababff',
              changeProp: true,
              colSpan: 1,
              group: 'Pagination'
            },
            {
              type: 'number',
              label: 'Inactive opacity',
              name: TRAITS.INACTIVE_BULLETS_OPACITY,
              default: 0.2,
              min: 0,
              max: 1,
              step: 0.1,
              changeProp: true,
              group: 'Pagination'
            },
            {
              type: 'number',
              label: 'Bullet width(px)',
              name: TRAITS.BULLETS_WIDTH,
              default: 14,
              min: 0,
              changeProp: true,
              colSpan: 1,
              group: 'Pagination'
            },
            {
              type: 'number',
              label: 'Bullet height(px)',
              name: TRAITS.BULLETS_HEIGHT,
              default: 4,
              min: 0,
              changeProp: true,
              colSpan: 1,
              group: 'Pagination'
            },
            {
              type: 'number',
              label: 'Bullet border radius(px)',
              name: TRAITS.BULLETS_RADIUS,
              default: 12,
              min: 0,
              changeProp: true,
              group: 'Pagination'
            },

            // Effect
            {
              type: 'select',
              label: 'Effect type',
              name: TRAITS.EFFECT,
              changeProp: true,
              group: 'Effects (beta)',
              options: [
                { label: 'Fade Effect', value: 'fade' },
                { label: 'Coverflow Effect', value: 'coverflow' },
                { label: 'Flip Effect', value: 'flip' },
                { label: 'Cube Effect', value: 'cube' },
                { label: 'Cards Effect', value: 'cards' },
              ],
            },
          ],
        },

        init() {
          this.on(`change:${TRAITS.SLIDES_COUNT}`, this.updateSlidesCount);
          this.on(`change:${TRAITS.SHOW_NAVIGATION}`, this.updateNavigation);
          this.on(`change:${TRAITS.EFFECT}`, this.updateEffect);

          const paginationPropList = [
            TRAITS.BULLETS_COLOR,
            TRAITS.INACTIVE_BULLETS_COLOR,
            TRAITS.INACTIVE_BULLETS_OPACITY,
            TRAITS.BULLETS_WIDTH,
            TRAITS.BULLETS_HEIGHT,
            TRAITS.BULLETS_RADIUS,
          ].map(prop => `change:${prop}`).join(' ');
          this.on(paginationPropList, this.updatePagination);
        },
        updateSlidesCount() {
          const slidesCount = this.get(TRAITS.SLIDES_COUNT);

          if (slidesCount < 1) {
            return;
          }

          const slideList = this.findType('basic_slider_slide');
          const sliderWrapperComponent = this.findType('basic_slider_wrapper')[0];

          if (slidesCount > slideList.length) {
            const shift = slidesCount - slideList.length;

            const componentsToAppend = [];
            for (let i = 0; i < shift; i++) {
              componentsToAppend.push(createSlideComponent(slideList.length + i + 1));
            }

            sliderWrapperComponent.append(componentsToAppend);
          } else {
            const shift = slideList.length - slidesCount;
            const removedSlides = slideList.splice(slideList.length - shift, shift);
            removedSlides.forEach((slide) => slide.remove());
          }
        },
        updateNavigation() {
          const showNavigation = this.get(TRAITS.SHOW_NAVIGATION);
          const navigationType = this.findType('basic_slider_navigation');

          if (showNavigation) {
            this.append(navigationComponents);
          } else {
            navigationType.forEach((navigation) => {
              navigation.remove();
            });
          }
        },
        updatePagination() {
          const color = this.get(TRAITS.BULLETS_COLOR);
          const inactiveColor = this.get(TRAITS.INACTIVE_BULLETS_COLOR);
          const inactiveOpacity = this.get(TRAITS.INACTIVE_BULLETS_OPACITY);
          const bulletsWidth = this.get(TRAITS.BULLETS_WIDTH);
          const bulletsHeight = this.get(TRAITS.BULLETS_HEIGHT);
          const bulletsRadius = this.get(TRAITS.BULLETS_RADIUS);
          const styles = this.getStyle();

          this.setStyle({
            ...styles,
            '--swiper-pagination-color': color,
            '--swiper-pagination-bullet-inactive-color': inactiveColor,
            '--swiper-pagination-bullet-inactive-opacity': inactiveOpacity,
            '--swiper-pagination-bullet-width': bulletsWidth + 'px',
            '--swiper-pagination-bullet-height': bulletsHeight + 'px',
            '--swiper-pagination-bullet-border-radius': bulletsRadius + 'px',
          });
        },
        updateEffect() {
          const slidesPerViewTrait = this.getTrait(TRAITS.SLIDES_PER_VIEW);

          const effect = this.getTrait(TRAITS.EFFECT).getValue();

          if (['fade', 'flip', 'cube', 'cards'].includes(effect)) {
            slidesPerViewTrait.setValue(1);
            editor.runCommand('trait-manager:update-property-list');
          }
        },
      },
    };

    const block = {
      id: COMPONENT_TYPE,
      label: COMPONENT_NAME,
      category: CATEGORY,
      icon: `<svg width="100%" height="42px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3.5" y="6.5" width="17" height="11" rx="1.5" stroke="currentColor"/>
    <rect x="-14.5" y="7.5" width="16" height="9" rx="1.5" stroke="currentColor"/>
    <rect x="22.5" y="7.5" width="16" height="9" rx="1.5" stroke="currentColor"/>
</svg>`,
      content: { type: COMPONENT_TYPE, },
      activate: true,
    };

    editor.Blocks.add(COMPONENT_TYPE, block);
    editor.DomComponents.addType(COMPONENT_TYPE, component);

    return {};
  }

  webkit.plugins.add(slidePlugin);
  webkit.plugins.add(sliderNavigationPlugin);
  webkit.plugins.add(sliderPaginationPlugin);
  webkit.plugins.add(sliderWrapperPlugin);
  webkit.plugins.add(plugin);

})(window.webkit);

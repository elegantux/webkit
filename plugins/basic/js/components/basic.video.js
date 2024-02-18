((webkit) => {
  async function plugin(editor) {
    const COMPONENT_TYPE = "basic_video";
    const COMPONENT_NAME = "Video";
    const DATA_KEY = "data-wk-type";
    const CATEGORY = "Basic";

    const YOUTUBE_URL = 'https://www.youtube.com/embed/';
    const VIMEO_URL = 'https://player.vimeo.com/video/';

    const VIDEO_PROVIDERS = {
      YOUTUBE: 'youtube',
      VIMEO: 'vimeo',
    };

    const VIDEO_PROVIDERS_OPTIONS = [{
      label: 'YouTube',
      value: VIDEO_PROVIDERS.YOUTUBE,
    }, {
      label: 'Vimeo',
      value: VIDEO_PROVIDERS.VIMEO,
    }];

    const TRAITS = {
      VIDEO_PROVIDER: `trait_${COMPONENT_TYPE}__provider`,
      VIDEO_ID: `trait_${COMPONENT_TYPE}__id`,
      AUTOPLAY: `trait_${COMPONENT_TYPE}__autoplay`,
      CONTROLS: `trait_${COMPONENT_TYPE}__controls`,
      LOOP: `trait_${COMPONENT_TYPE}__loop`,
    };

    // Remove build-in image component functionality
    editor.DomComponents.removeType('video');
    editor.on('canvas:drop', (dataTransfer, components) => {
      if (Array.isArray(components)) {
        components.map((component) => {
          if (component.get('type') === 'video') {
            component.remove();
          }
        });
      } else if (components && components.get('type') === 'video') {
        components?.remove();
      }
    });

    const component = {
      isComponent: (el) => el?.dataset?.[DATA_KEY] === COMPONENT_TYPE,
      model: {
        defaults: {
          name: COMPONENT_NAME,
          attributes: {
            [DATA_KEY]: COMPONENT_TYPE,
            src: '',
            frameBorder: 0,
            allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
          },
          tagName: "iframe",
          style: { 'width': '620px', 'max-width': '100%', 'height': '480px' },
          droppable: false,

          // Traits
          [TRAITS.VIDEO_PROVIDER]: VIDEO_PROVIDERS.YOUTUBE,
          [TRAITS.VIDEO_ID]: '',
          [TRAITS.AUTOPLAY]: false,
          [TRAITS.CONTROLS]: true,
          [TRAITS.LOOP]: false,
          traits: [
            {
              type: 'select',
              label: 'Provider',
              name: TRAITS.VIDEO_PROVIDER,
              options: VIDEO_PROVIDERS_OPTIONS,
              default: VIDEO_PROVIDERS.YOUTUBE,
              changeProp: 1,
            },
            {
              type: 'text',
              label: 'Video ID',
              name: TRAITS.VIDEO_ID,
              // default: '',
              changeProp: 1,
            },
            {
              type: 'checkbox',
              label: 'Autoplay',
              text: 'Play video automatically',
              name: TRAITS.AUTOPLAY,
              default: false,
              changeProp: 1,
            },
            {
              type: 'checkbox',
              label: 'Show controls',
              text: 'Show Video Controls',
              name: TRAITS.CONTROLS,
              default: true,
              changeProp: 1,
            },
            {
              type: 'checkbox',
              label: 'Loop video',
              text: 'Play the video in a loop',
              name: TRAITS.LOOP,
              default: false,
              changeProp: 1,
            },
          ],
        },

        init() {
          this.on(`change:${TRAITS.VIDEO_ID} change:${TRAITS.VIDEO_PROVIDER}`, this.updateSrc);
        },

        /**
         * Update src on change of video ID
         * @private
         */
        updateSrc() {
          const provider = this.get(TRAITS.VIDEO_PROVIDER);
          let src = '';

          switch (provider) {
            case VIDEO_PROVIDERS.YOUTUBE:
              src = this.getYoutubeSrc();
              break;
            case VIDEO_PROVIDERS.VIMEO:
              src = this.getVimeoSrc();
              break;
          }

          this.addAttributes({ src });
        },

        /**
         * Returns url to youtube video
         * @return {string}
         * @private
         */
        getYoutubeSrc() {
          const id = this.get(TRAITS.VIDEO_ID);
          const autoplay = this.get(TRAITS.AUTOPLAY);
          const controls = this.get(TRAITS.CONTROLS);
          const loop = this.get(TRAITS.LOOP);

          let url = YOUTUBE_URL + id;

          const searchParams = new URLSearchParams();

          if (autoplay) {
            searchParams.append('autoplay', '1');
            searchParams.append('mute', '1');
          }
          if (!controls) {
            searchParams.append('controls', '0');
            searchParams.append('showinfo', '0');
          }
          if (loop) {
            searchParams.append('loop', '1');
            searchParams.append('playlist', id);
          }

          const query = searchParams.toString();

          if (query.length > 0) {
            url += url.indexOf('?') < 0 ? '?' + query : '&' + query;
          }

          return url;
        },

        /**
         * Returns url to vimeo video
         * @return {string}
         * @private
         */
        getVimeoSrc() {
          const id = this.get(TRAITS.VIDEO_ID);
          const autoplay = this.get(TRAITS.AUTOPLAY);
          const controls = this.get(TRAITS.CONTROLS);
          const loop = this.get(TRAITS.LOOP);

          let url = VIMEO_URL + id;

          const searchParams = new URLSearchParams();

          if (autoplay) {
            searchParams.append('autoplay', '1');
            searchParams.append('muted', '1');
          }
          if (!controls) {
            searchParams.append('title', '0');
            searchParams.append('portrait', '0');
            searchParams.append('badge', '0');
          }
          if (loop) {
            searchParams.append('loop', '1');
          }

          const query = searchParams.toString();

          if (query.length > 0) {
            url += '?' + query;
          }

          return url;
        }
      },
      view: {
        tagName: "div",

        videoElement: undefined,

        events: {
          'click iframe': 'onClick',
        },

        onClick(event) {
          event.stopPropagation();
        },

        init({ model }) {
          const listenToTraits =
            [TRAITS.AUTOPLAY, TRAITS.CONTROLS, TRAITS.LOOP]
              .map((trait) => `change:${trait}`).join(' ');

          // Calling the callback function when changing providers
          this.listenTo(model, `change:${TRAITS.VIDEO_PROVIDER}`, this.handleProviderChange);

          // Calling the callback function when changing video id
          this.listenTo(model, 'change:attributes:src', this.updateSrc);

          // Calling the callback function when one of the listenToTraits changing
          this.listenTo(model, listenToTraits, this.handleUpdateVideo);
        },

        /**
         * Update the source of the video
         * This method is called when the video ID changes. See model -> updateSrc
         * @private
         */
        updateSrc() {
          if (!this.videoElement) return;
          const provider = this.model.get(TRAITS.VIDEO_PROVIDER);
          let src = this.model.get('src');

          switch (provider) {
            case VIDEO_PROVIDERS.YOUTUBE:
              src = this.model.getYoutubeSrc();
              break;
            case VIDEO_PROVIDERS.VIMEO:
              src = this.model.getVimeoSrc();
              break;
          }

          this.videoElement.src = src;
        },

        /**
         * Rerender on update of the provider
         * @private
         */
        handleProviderChange() {
          const provider = this.model.get(TRAITS.VIDEO_PROVIDER);
          this.el.innerHTML = '';
          this.el.appendChild(this.renderByProvider(provider));
        },

        /**
         * Update video parameters
         * @private
         */
        handleUpdateVideo() {
          const provider = this.model.get(TRAITS.VIDEO_PROVIDER);

          switch (provider) {
            case VIDEO_PROVIDERS.YOUTUBE:
            case VIDEO_PROVIDERS.VIMEO:
              this.model.trigger(`change:${TRAITS.VIDEO_ID}`);
              break;
            // TODO: This is for a source video located on a hosting.
            default:
              break;
          }
        },

        renderByProvider(provider) {
          let videoElement;

          switch (provider) {
            case VIDEO_PROVIDERS.YOUTUBE:
              videoElement = this.renderYoutube();
              break;
            case VIDEO_PROVIDERS.VIMEO:
              videoElement = this.renderVimeo();
              break;
            // TODO: This is for a source video located on a hosting.
            default:
              break;
          }

          this.videoElement = videoElement;
          return videoElement;
        },

        renderYoutube() {
          const el = document.createElement('iframe');
          el.src = this.model.getYoutubeSrc();
          el.frameBorder = '0';
          el.setAttribute('allowfullscreen', 'true');
          this.initVideoEl(el);
          return el;
        },

        renderVimeo() {
          const el = document.createElement('iframe');
          el.src = this.model.getVimeoSrc();
          el.frameBorder = '0';
          el.setAttribute('allowfullscreen', 'true');
          this.initVideoEl(el);
          return el;
        },

        initVideoEl(el) {
          el.style.height = '100%';
          el.style.width = '100%';
          el.style.pointerEvents = 'none';
        },

        onRender() {
          const provider = this.model.get(TRAITS.VIDEO_PROVIDER);
          this.el.appendChild(this.renderByProvider(provider));
          this.handleUpdateVideo();
          return this;
        }
      }
    };

    const block = {
      id: COMPONENT_TYPE,
      label: COMPONENT_NAME,
      category: CATEGORY,
      icon: `<svg width="100%" height="42px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="4.5" width="23" height="15" rx="1.5" stroke="currentColor"/>
    <path d="M15.25 11.567C15.5833 11.7594 15.5833 12.2406 15.25 12.433L10.75 15.0311C10.4167 15.2235 10 14.983 10 14.5981V9.40192C10 9.01702 10.4167 8.77646 10.75 8.96891L15.25 11.567Z" fill="currentColor"/>
</svg>
`,
      content: { type: COMPONENT_TYPE, },
      activate: true,
    };

    editor.Blocks.add(COMPONENT_TYPE, block);
    editor.DomComponents.addType(COMPONENT_TYPE, component);

    return {};
  }

  webkit.plugins.add(plugin);

})(window.webkit);

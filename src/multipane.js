const LAYOUT_HORIZONTAL = 'horizontal';
const LAYOUT_VERTICAL = 'vertical';

const PANE_RESIZE_START = 'resizestart';
const PANE_RESIZE = 'resize';
const PANE_RESIZE_STOP = 'resizestop';

export default {
  name: 'multipane',

  props: {
    layout: {
      type: String,
      default: LAYOUT_VERTICAL,
    },
  },

  data() {
    return {
      isResizing: false,
    };
  },


  computed: {
    classnames() {
      return [
        'multipane',
        'layout-' + this.layout.slice(0, 1),
        this.isResizing ? 'is-resizing' : '',
      ];
    },
    cursor() {
      return this.isResizing
        ? this.layout == LAYOUT_VERTICAL ? 'col-resize' : 'row-resize'
        : '';
    },
    userSelect() {
      return this.isResizing ? 'none' : '';
    },
  },

  methods: {
    onMouseDown(e) {
      const resizer = e.target;

      if (resizer.className && typeof resizer.className === 'string' && resizer.className.match('multipane-resizer')) {
        e.preventDefault();
        let initialPageX, initialPageY;
        if (e.type == 'touchstart') {
          initialPageX = e.touches[0].pageX;
          initialPageY = e.touches[0].pageY;
        } else {
          initialPageX = e.pageX;
          initialPageY = e.pageY;
        }
        if (resizer.parentElement !== this.$el) return;
        const self = this;
        const { $el: container, layout } = self;

        let pane = resizer.previousElementSibling;
        let previousPane = true;
        const style = window.getComputedStyle(pane);
        if (style.flexGrow !== '0') {
          pane = resizer.nextElementSibling;
          previousPane = false;
        }
        const {
          offsetWidth: initialPaneWidth,
          offsetHeight: initialPaneHeight,
        } = pane;

        const usePercentage = !!(pane.style.width + '').match('%');

        const { addEventListener, removeEventListener } = window;

        const resize = (initialSize, offset = 0) => {
          if (layout == LAYOUT_VERTICAL) {
            const containerWidth = container.clientWidth;
            const paneWidth = initialSize + (previousPane ? offset : -offset);

            return (pane.style.width = usePercentage
              ? paneWidth / containerWidth * 100 + '%'
              : paneWidth + 'px');
          }

          if (layout == LAYOUT_HORIZONTAL) {
            const containerHeight = container.clientHeight;
            const paneHeight = initialSize + (previousPane ? offset : -offset);

            return (pane.style.height = usePercentage
              ? paneHeight / containerHeight * 100 + '%'
              : paneHeight + 'px');
          }
        };

        // This adds is-resizing class to container
        self.isResizing = true;

        // Resize once to get current computed size
        // let size = resize();
        const size = (layout == LAYOUT_VERTICAL
          ? resize(initialPaneWidth)
          : resize(initialPaneHeight));

        // Trigger paneResizeStart event
        self.$emit(PANE_RESIZE_START, pane, resizer, size);

        const onMouseMove = function(e) {
          var pageX, pageY;
          if (e.type == 'touchmove') {
            pageX = e.touches[0].pageX;
            pageY = e.touches[0].pageY;
          } else {
            e.preventDefault();
            pageX = e.pageX;
            pageY = e.pageY;
          }
          const size = (layout == LAYOUT_VERTICAL
            ? resize(initialPaneWidth, pageX - initialPageX)
            : resize(initialPaneHeight, pageY - initialPageY));

          self.$emit(PANE_RESIZE, pane, resizer, size);
        };

        const onMouseUp = function() {
          // Run resize one more time to set computed width/height.
          const size = (layout == LAYOUT_VERTICAL
            ? resize(pane.clientWidth)
            : resize(pane.clientHeight));

          // This removes is-resizing class to container
          self.isResizing = false;

          removeEventListener('mousemove', onMouseMove);
          removeEventListener('mouseup', onMouseUp);

          removeEventListener('touchmove', onMouseMove);
          removeEventListener('touchend', onMouseUp);

          self.$emit(PANE_RESIZE_STOP, pane, resizer, size);
        };

        addEventListener('mousemove', onMouseMove);
        addEventListener('mouseup', onMouseUp);

        addEventListener('touchmove', onMouseMove);
        addEventListener('touchend', onMouseUp);
      }
    },
  },
};

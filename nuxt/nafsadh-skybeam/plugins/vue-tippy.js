import Vue from 'vue';
import Tippy from 'v-tippy';
import 'v-tippy/dist/tippy.css';

Vue.use(Tippy, {
  arrow: true,
  arrowType: 'round',
  duration: 0,
  theme: 'skybee',
  placement: 'left-start'
});

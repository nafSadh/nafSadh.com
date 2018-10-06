// import tns from 'tiny-slider';
import Vue from 'vue';
import VueTinySlider from 'vue-tiny-slider';

const TinySlider = {
  install(Vue, options) {
    Vue.component('tiny-slider', VueTinySlider)
  }
};
Vue.use(TinySlider);
export default TinySlider;

/*
tns({
  container: '#autoWidth-lazyload',
  loop: true,
  autoWidth: true,
  items: 17,
  slideBy: 1.25,
  mouseDrag: true,
  autoplayHoverPause: true,
  autoplay: true,
  speed: 400,
  autoplayTimeout: 2000,
  arrowKeys: true,
  nav: false,
  controls: false,
  swipeAngle: false,
  autoplayButtonOutput: false,
  autoplayResetOnVisibility: false
});

*/

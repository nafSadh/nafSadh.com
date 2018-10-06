import tns from 'tiny-slider';

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


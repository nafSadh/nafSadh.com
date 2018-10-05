<template>
  <section class="section stitched">
    <div class="container lux-pad-4">
      <div class="columns is-centered fuse-bottom">
        <div class="column is-half-fullhd is-two-thirds-widescreen is-three-quarters is-not-paddingless glass fuse-bottom">
          <h1 class="title is-size-2 has-text-weight-light ">art + painting</h1>
          <hr class="half-extended bg-silver glassy">
        </div>
      </div>
      <div class="columns is-centered fuse-top">
        <div class="column is-half-fullhd is-two-thirds-widescreen is-three-quarters is-paddingless glass fuse-top">
          <div class="card bg-white-sky">
            <div
              id="bulmaCarousel"
              class="carousel carousel-animated carousel-animate-slide" 
              data-autoplay="true" 
              data-delay="5000">
              <div class="carousel-container">
                <div class="carousel-item has-background is-active">
                  <img 
                    class="is-background is-16by9" 
                    src="img/art/minar.jpg">
                </div>
                <div class="carousel-item has-background is-active">
                  <img 
                    class="is-background is-16by9" 
                    src="img/art/nafSadh-art.jpg">
                </div>
                <div class="carousel-item has-background is-active">
                  <img 
                    class="is-background is-16by9" 
                    src="img/art/bornomala.jpg">
                </div>
                <div class="carousel-item has-background is-active">
                  <img 
                    class="is-background is-16by9" 
                    src="img/art/sweet-home.jpg">
                </div>
              </div>
              <div class="carousel-navigation is-overlay">
                <div class="carousel-nav-left">
                  <i 
                    class="fa fa-chevron-left" 
                    aria-hidden="true"/>
                </div>
                <div class="carousel-nav-right">
                  <i 
                    class="fa fa-chevron-right" 
                    aria-hidden="true"/>
                </div>
              </div>
            </div>
            <div class="card-content has-text-centered">
              <p class="subtitle is-4">visit</p>
              <p class="title is-2 has-text-weight-light">
                <a 
                  class="is-size-2" 
                  href="http://nafSadh.art">nafSadh.art</a>
              </p>
            </div>
            <div class="card-content has-text-centered">
              <div 
                class="is-divider bg-sky-blue-light" 
                data-content="also on"/>
              <div class="columns is-mobile is-multiline is-centered">
                <div class="column is-narrow has-text-centered">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/7/7b/DeviantArt_Logo.svg" 
                    width="128px"
                    style="padding: 8px 0">
                  <p><a href="https://www.deviantart.com/nafsadh">DeviantArt</a></p>
                </div>
                <div class="column is-narrow has-text-centered side-pad-2">
                  <img 
                    src="~/static/img/behance-logo.png" 
                    width="48px">
                  <p><a href="https://www.behance.net/nafSadh">Bēhance</a></p>
                </div>
              </div>
            </div>
          </div>
          <div class="card bg-white-sky">
            <div class="card-content">
              <div class="level">
                <div class="level-left">
                  <figure class="level-item image is-32x32">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Commons-logo.svg">
                  </figure>
                  <span class="level-item">
                    <div>Creative Commons and Public Domain releases on&nbsp;<a 
                      href="https://commons.wikimedia.org/w/index.php?title=Special:ListFiles/Nafsadh" 
                      target="_blank">Wikimedia Commons</a>
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import bulmaCarousel from 'bulma-carousel/dist/js/bulma-carousel.min.js';
export default {
  mounted: function() {
    new bulmaCarousel(document.getElementById('bulmaCarousel'));
  }
};
</script>

<template>
  <section class="stitched bg-silver-light lux-pad-4">
    <div class="section fuse-bottom">
      <div class="container">
        <div class="columns is-centered slight-pad-1">
          <div class="column is-half-fullhd is-two-thirds-widescreen is-three-quarters is-not-paddingless glass">
            <h1 class="title is-size-2 has-text-weight-light ">photographs</h1>
            <hr class="half-extended bg-silver glassy"/>
          </div>
        </div>
      </div>
    </div>
    <div class="hero fuse-top fuse-bottom">
      <div style="height:240px; min-height: 240px; max-height: 240px;"
                   :auto-init="true"
                   :items="7"
                   :loop="true"
                   :auto-width="true"
                   :slide-by="1"
                   :mouse-drag="true"
                   :autoplay="true"
                   :speed="400"
                   :autoplay-timeout="2000"
                   :arrow-keys="true"
                   :nav="false"
                   :controls="false"
                   :swipe-angle="false"
                   :autoplay-button-output="false"
                   :autoplay-reset-on-visibility="false"
                   class="photo-reel autoWidth"
      >
        <div class="item"><img class="tns-img" src="~/static/img/photos/princeton-lib-wall.jpg" width="320"></div>
        <div class="item"><img class="tns-img" src="~/static/img/photos/color-lamps.jpg" width="320"></div>
        <div class="item"><img class="tns-img" src="~/static/img/photos/red_house.jpg" width="320"></div>
        <div class="item"><img class="tns-img" src="~/static/img/photos/leaf-macro.jpg" width="360"></div>
        <div class="item"><img class="tns-img" src="~/static/img/photos/dandelion.jpg" width="360"></div>
        <div class="item"><img class="tns-img" src="~/static/img/photos/tulip-central.jpg" width="320"></div>
        <div class="item"><img class="tns-img" src="~/static/img/photos/sky-reflect.jpg" width="320"></div>
        <div class="item"><img class="tns-img" src="~/static/img/photos/empire-state-building-fog.jpg" width="320"></div>
        <div class="item"><img class="tns-img" src="~/static/img/photos/shrimp-dish.jpg" width="320"></div>
        <div class="item"><img class="tns-img" src="~/static/img/photos/hudson-sunset.jpg" width="320"></div>
        <div class="item"><img class="tns-img" src="~/static/img/photos/an-american-highway.jpg" width="320"></div>
        <div class="item"><img class="tns-img" src="~/static/img/photos/brooklyn-pub-lib.jpg" width="178"></div>
        <div class="item"><img class="tns-img" src="~/static/img/photos/manhattan-sunset.jpg" width="180"></div>
        <div class="item"><img class="tns-img" src="~/static/img/photos/coffee-cup.jpg" width="320"></div>
        <div class="item"><img class="tns-img" src="~/static/img/photos/grand-central-chandelier.jpg" width="180"></div>
        <div class="item"><img class="tns-img" src="~/static/img/photos/snow-grid.jpg" width="360"></div>
        <div class="item"><img class="tns-img" src="~/static/img/photos/sliver-of-a-river.jpg" width="180"></div>
      </div>
    </div>
    <div class="section fuse-top">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-half-fullhd is-two-thirds-widescreen is-three-quarters is-not-paddingless glass">
            <div class="columns is-mobile is-multiline slight-pad-1">
              <div class="column is-narrow" style="padding-right: 20px">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/240px-Instagram_logo_2016.svg.png"
                  width="36px">
                <p><a href="https://instagram.com/nafsadh/">Instagram</a></p>
              </div>
              <div class="column is-narrow">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/52/Flickr_wordmark.svg" width="72px"
                     style="padding: 12px 0 2px 0">
                <p><a href="https://www.flickr.com/photos/sadh/photo.vue">Flickr</a></p>
              </div>
              <div class="column is-narrow">
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/500px_logo_2016.svg" width="68px"
                     style="padding: 16px 0 0 0">
                <p><a href="https://500px.com/nafsadh">500px</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  export default {
    mounted: function() {
    },
  };
</script>

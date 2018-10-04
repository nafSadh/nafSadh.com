<template>
  <div class="bg-silver-white has-navbar-fixed-top">
    <nuxt/>
    <nav class="navbar is-fixed-top" style="box-shadow: 0 0 3px #ccc" role="navigation" aria-label="main navigation">
      <div class="container">
        <div class="navbar-brand ">
          <a class="navbar-item is-size-4">
            <img src="img/nafsadh.png" style="padding-right: 4px">
            <span>nafSadh</span>
          </a>
        </div>
        <div class="navbar-start">
        </div>
      </div>
    </nav>
    <footer class="footer bg-silver-white" style="box-shadow: 0 0 3px #ccc">
      <div class="container has-text-centered">
        nafSadh &copy; 2010~2018, Khan 'Sadh' Mostafa<br/>
        <small>
          Made with <i class="fas fa-heart"></i> + <i class="fab fa-vuejs"></i> on <i class="fab fa-github"></i>
        </small>
      </div>
    </footer>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        items: [
          {title: 'Home', icon: 'home', to: {name: 'index'}}
        ]
      }
    }
  }
</script>

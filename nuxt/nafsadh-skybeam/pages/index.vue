<template>
  <main>
    <ns7/>
    <about/>
    <arts/>
    <photos/>
    <projects/>
  </main>
</template>

<script>
import Ns7 from './ns/index';
import About from './ns/about';
import Arts from './ns/arts';
import Photos from './ns/photos';
import Projects from './ns/projects';

export default {
  name: 'HomePage',
  components: { Ns7, About, Arts, Photos, Projects },
  data() {
    return {};
  }
};
</script>

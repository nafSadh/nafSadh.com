<template>
  <main>
    <ns7/>
    <about/>
    <arts/>
    <projects/>
  </main>
</template>

<script>
import Ns7 from './ns/index';
import About from './ns/about';
import Arts from './ns/arts';
import Projects from './ns/projects';

export default {
  name: 'HomePage',
  components: { Ns7, About, Arts, Projects },
  data() {
    return {};
  }
};
</script>

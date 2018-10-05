<template>
  <main>
    <ns7/>
    <about/>
    <projects/>
  </main>
</template>

<script>
import ns7 from './ns/index.vue';
import about from './ns/about.vue';
import Projects from './ns/projects';

export default {
  name: 'HomePage',
  components: { Projects, ns7, about },
  data() {
    return {};
  }
};
</script>

<template>
  <main>
    <ns7/>
    <about/>
  </main>
</template>

<script>
import ns7 from '~/pages/ns/index.vue';
import about from '~/pages/ns/about.vue';

export default {
  name: 'HomePage',
  components: { ns7, about },
  data() {
    return {};
  }
};
</script>

<template>
  <section class="section bg-endless-constellation stitched" id="about">
    <div class="container lux-pad-8">
      <div class="columns is-centered">
        <div class="column is-half-fullhd is-two-thirds-widescreen is-three-quarters bg-white-sky glass">
          <div class="content is-medium has-text-justified">
            <h1 class="title is-size-2 has-text-weight-light">about</h1>
            <hr class="half-extended bg-silver-light"/>
            <p>
              Born and raised in
              <a href="https://en.wikipedia.org/wiki/Bangladesh"
                 data-tippy="
                    <img src='https://upload.wikimedia.org/wikipedia/commons/f/f9/Flag_of_Bangladesh.svg' width='128px'>
                    <br/>
                    <b>Bangladesh</b>, to the east of India on the Bay of Bengal, is a South Asian country marked by lush
                    greenery and many waterways.">Bangladesh</a>,
              trained in computer science at
              <a href="http://www.kuet.ac.bd/department/CSE/" data-tippy="
                    <img src='https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Logo_KUET.svg/283px-Logo_KUET.svg.png' width='48px'><br/>
                    <b>Khulna University of Engineering &amp; Technology</b><br/>
                    B.Sc. (Engineering)<br/>
                    Computer Science and Engineering<br/>
                    <i class='fas fa-map-marker-alt'></i> Khulna, Bangladesh">KUET</a>
              and
              <a href="https://www.cs.stonybrook.edu/students/Graduate-Studies/MSProgram" data-tippy="
                    <img
                        src='https://upload.wikimedia.org/wikipedia/en/thumb/b/be/Stonybrook_logo.svg/360px-Stonybrook_logo.svg.png'
                        width='180px'><br/>
                    <b>Stony Brook University</b><br/>
                    MS in Computer Science<br/>
                    <i class='fas fa-map-marker-alt'></i> Stony Brook, New York, USA">Stony Brook</a>,
              I work as a software engineer; now at
              <a class="popover-trigger" href="https://TCIcredit.com" data-tippy="
                    <img src='http://nafsadh.com/img/tci.png' width='96px'/><br/>
                    <strong>Teledata Communications, Inc.</strong><br/>
                    Decision Lender - Loan Origination Solutions<br/>
                   <i class='fas fa-map-marker-alt'></i> Islandia, NY, USA">TCI</a>
              and previously at
              <a class="popover-trigger" href="https://research.samsung.com/srbd" data-tippy="
                    <img src='https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' width='96px'/><br/>
                    <strong>Samsung R&D Institute Bangladesh</strong><br/>
                    A research hub of Samsung Electronics<br/>
                   <i class='fas fa-map-marker-alt'></i> Dhaka, Bangladesh">Samsung</a>.
              I live with my lovely wife
              <a href="http://sampreeti.com">Sampreeti</a>
              in
              <a class="popover-trigger" href="https://en.wikipedia.org/wiki/New_York_metropolitan_area" data-tippy="
                    <img src='https://upload.wikimedia.org/wikipedia/commons/d/d5/I_Love_New_York.svg' width='72px'>
                    <br/>I live in Mineola, within the New York metro area.">New York</a>.
            </p>
            <p>
              I have been involved with several <a href="http://projects.nafSadh.com">projects</a>.
              Some of their sources are in <a href="https://github.com/nafSadh">GitHub</a>. I have explored wide
              range of development stacks including systems, applications, data and web technologies. I dream of
              building a knowledge system that can learn and reason. My other interests include intelligent systems,
              logic, linguistics, and epistemology.
            </p>
            <p>
              I post weblogs on <a href="https://ins.nafsadh.com/">inside the insight</a>.
              I share my Bengali writings on <a href="https://sadhubochon.wordpress.com/">Sadhubôchôn</a>
              and <a href="http://sulol.nafsadh.com/">Sulol Songroho</a>.
              I am also involved as editor and publisher at Bengali literary community
              <a href="http://lekhalikhi.com">Lekhalikhi</a>.
              I love to play with colors, draw pictures and make graphic artworks; you can browse them on my
              <a href="http://arts.nafsadh.com">arts portfolio</a>. I use a Bengali keyboard lay-out named
              <a href="http://nafsadh.com/sonnivo/">Sonnivo</a> which happened to be designed by me.
            </p>
            <p></p>
          </div>
        </div>
      </div>
      <div class="columns is-centered">
        <div class="column is-half-fullhd is-two-thirds-widescreen is-three-quarters bg-white glass">
          <div class="content is-medium has-text-justified">
              <span class="is-size-4">
                  <a href="http://nafSadh.com/bio">bio</a> /
                  <a href="http://re.sadh.me">resume</a> /
                  <a href="timeline.html">timeline</a>
                </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BLogo from '@/components/Logo'

export default {
  name: 'HomePage',
  components: {BLogo},
  data() {
      return {
          features: [
              { icon: 'github-circle', title: 'Free', content: `<span>Open source on <a href="https://github.com/buefy/buefy"> GitHub</a></span>` },
              { icon: 'cellphone-link', title: 'Responsive', content: `<span><b class="has-text-grey">Every</b> component is responsive</span>` },
              { icon: 'alert-decagram', title: 'Modern', content: `<span>Built with <a href="https://vuejs.org/">Vue.js</a> and <a href="http://bulma.io/">Bulma</a></span>` },
              { icon: 'arrange-bring-to-front', title: 'Lightweight', content: `<span>No other internal dependency</span>` }
          ]
      }
  }
}
</script>

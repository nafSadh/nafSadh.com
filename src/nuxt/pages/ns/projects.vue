<template>
  <section class="section stitched">
    <div class="container">
      <div class="columns is-centered fuse-bottom">
        <div class="column is-half-fullhd is-two-thirds-widescreen is-three-quarters is-not-paddingless glass fuse-bottom">
          <h1 class="title is-size-2 has-text-weight-light">projects</h1>
          <hr class="half-extended bg-silver glassy">
        </div>
      </div>
      <div class="columns is-centered fuse-top">
        <div class="column is-half-fullhd is-two-thirds-widescreen is-three-quarters is-paddingless glass fuse-top">
          <div 
            v-for="proj in projects"
            :key="proj.title"
            class="card bg-white-sky">
            <div class="card-content">
              <div class="media fuse-bottom">
                <div class="media-left">
                  <figure 
                    v-if="proj.span!='tiny' && proj.span!='sub'" 
                    class="image is-48x48 is-centered">
                    <img :src="proj.icon">
                  </figure>
                  <figure 
                    v-if="proj.span=='tiny' || proj.span=='sub'" 
                    class="image is-32x32" 
                    style="margin: 8px;">
                    <img :src="proj.icon">
                  </figure>
                </div>
                <div class="media-content">
                  <h3 class="title is-4 fuse-bottom">
                    {{ proj.title }}
                  </h3>
                  <h4 
                    v-if="proj.subtitle" 
                    class="subtitle is-6 fuse-bottom fuse-top" 
                    v-html="proj.subtitle"/>
                  <div 
                    v-if="proj.span!='tiny' && proj.span!='small'" 
                    class="is-6 slight-pad-top-0">
                    <small class="tag is-light"><i class="far fa-calendar-alt fg-silver"/>&nbsp;{{ proj.period }}</small>
                    <small 
                      v-if="proj.org_work" 
                      class="tag is-light"><i class="fas fa-briefcase fg-silver"/>&nbsp;{{ proj.org_work }}</small>
                    <small 
                      v-if="proj.school" 
                      class="tag is-light"><i class="fas fa-graduation-cap fg-silver"/>&nbsp;{{ proj.school }}</small>
                    <small 
                      v-if="proj.org_open" 
                      class="tag is-light"><i class="fas fa-door-open fg-silver"/>&nbsp;{{ proj.org_open }}</small>
                    <small 
                      v-if="proj.collab" 
                      class="tag is-light"><i class="fas fa-hands-helping fg-silver"/>&nbsp; with {{ proj.collab }}</small>
                    <small 
                      v-if="proj.guide" 
                      class="tag is-light"><i class="fas fa-brain fg-silver"/>&nbsp; <small/>{{ proj.guide }}</small>
                  </div>
                </div>
                <div class="media-right">
                  <a 
                    v-if="proj.url" 
                    :href="proj.url" 
                    target="_blank">
                    <i class="fas fa-link"/>
                    <br>
                  </a>
                  <a 
                    v-if="proj.gh" 
                    :href="proj.gh" 
                    target="_blank">
                    <i class="fab fa-github"/>
                    <br>
                  </a>
                  <a 
                    v-if="proj.github" 
                    :href="'https://github.com/'+proj.github" 
                    target="_blank">
                    <i class="fab fa-github"/>
                    <br>
                  </a>
                </div>
              </div>
              <div 
                v-if="proj.description" 
                class="columns">
                <div class="column-narrow is-hidden-mobile">
                  <figure class="image is-48x48 right-gap-1" />
                </div>
                <div class="column">
                  <div 
                    class="has-text-justified fg-ink" 
                    v-html="proj.description"/>
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
export default {
  name: 'Projects',
  data() {
    return {
      projects: [
        {
          period: '2018',
          span: 'tiny',
          type: 'pet',
          title: 'lang-lang',
          subtitle: 'an incomplete list of programming languages',
          url: 'https://lang-lang.github.io/lang-lang/',
          gh: 'https://github.com/lang-lang/lang-lang',
          icon: 'img/lang-lang.svg'
        },
        {
          period: '2018',
          span: 'tiny',
          type: 'pet',
          title: 'hello-lang',
          subtitle: 'Hello World! in different languages',
          url: 'https://github.com/hello-lang',
          gh: 'https://github.com/hello-lang',
          icon: 'img/hello-lang-2.svg'
        },
        {
          period: '2018',
          span: 'tiny',
          type: 'pet',
          org_open: 'Sfaar',
          title: 'Pogolytics',
          subtitle: 'Analysis tool for Pokémon GO',
          url: 'https://nafsadh.github.io/pogolytics/',
          gh: 'https://github.com/nafsadh/pogolytics',
          icon: 'img/pogolytics.svg'
        },
        {
          period: 'Mar 2017 - ',
          span: 'mid',
          type: 'pet',
          org_open: 'Liby.cat',
          title: 'Liby.cat',
          subtitle: '<i>catalog</i> your library',
          url: 'http://dev.liby.cat/',
          gh: 'https://github.com/liby-cat/liby-cat',
          description: 'Liby the cat, lives in your library, keeps a catalog',
          icon: 'img/liby.cat.svg',
          tech: ['Node JS', 'Angular JS', 'LoopBack', 'MongoDB']
        },
        {
          period: '2016',
          span: 'tiny',
          type: 'tool',
          title: 'bootstrap-print-alike',
          subtitle: 'CSS to make your bootstrap print alike',
          github: 'nafsadh/bootstrap-print-alike',
          icon: 'img/comn48.png'
        },
        {
          period: 'Oct 2015 - ',
          span: 'long',
          type: 'job',
          org_work: 'Teledata Communications, Inc.',
          title: 'Decision Lender 4',
          subtitle: 'Loan Origination Software Solution',
          url: 'https://tcicredit.com/editions/',
          description:
            'End to end configurable SaaS catering to lenders for originating (receiving apps, automated decisioning and funding) vehicle, retail and personal finance products. Areas I focus on include collaterals, vehicle valuation services, ACH payment process, reporting framework etc.',
          long_description:
            'Decision Lender 4 is the flagship SaaS product offered by [TCI](https://tcicredit.com).  This is a Loan Origination Software (LOS) solution for US lenders, banks and credit unions.  It is end to end configurable, capable of meeting different client needs and can cater to vehicle lending (cars, boats, RVs), retail, personal finance and accounts opening.  For the lifecycle of loan origin process it can pull and analyze credit reports, make automated decisions and interact with different third party systems. <br/><br/> Areas I focus on include collaterals, vehicle valuation services, ACH payment process, reporting framework etc.',
          icon: 'img/tci.png',
          tech: ['Java', 'MS SQL', 'Angular JS']
        },
        {
          title: 'Decision Lender 3.5',
          description:
            'Decision Lender 3.5 is a now legacy LOS solution that TCI used to offer and now maintains for legacy clients <br/> I was responsible for adding and enhancing feature required to on-board clients.',
          url:
            'https://www.decisionlender.com/DecisionLender35/includes/support/DL35Dealer.pdf',
          tech: ['Java', 'MS SQL'],
          span: 'long',
          type: 'job',
          icon: 'img/tci.png',
          org_work: 'Teledata Communications, Inc.',
          period: 'Feb-Oct 2015'
        },
        {
          title: 'TuneTour.me',
          subtitle: 'follow touring artists and plan stays',
          url: 'http://TuneTour.me',
          github: 'nafSadh/TuneTour.me',
          span: 'hackathon',
          type: 'hackathon',
          icon: 'img/tt.png',
          collab: 'Amitav Paul & M Ruhul Amin',
          period: 'Oct 2014'
        },
        {
          title: 'Lekhalikhi',
          subtitle: 'Bengali literary platform',
          url: 'http://lekhalikhi.com',
          span: 'cont',
          type: 'platform',
          icon: 'img/lekhalikhi.png',
          org_open: 'Lipighor',
          period: '2014',
          description:
            'Online platform for Bengali writers to practice and publish their literary works, poems and prose.'
        },
        {
          title: 'scire',
          subtitle: 'Sadh`s C++ Impromptu Routines Ensemble',
          url: 'http://nafsadh.github.io/scire/doc/',
          github: 'nafSadh/scire',
          span: 'small',
          type: 'pet',
          icon: 'img/scire.png',
          period: '2014-'
        },
        {
          title: 'bnXlit',
          subtitle: 'Bengali Romanization Tool',
          url: 'http://nafsadh.github.io/bnXlit/',
          github: 'nafSadh/bnXlit',
          span: 'tiny',
          type: 'pet',
          icon: 'img/bnXlit.png',
          period: '2014'
        },
        {
          title: 'bnIPA',
          subtitle: 'Utility for using IPA with Bengali',
          url: 'http://nafsadh.github.io/bnIPA/',
          github: 'nafSadh/bnIPA',
          span: 'tiny',
          type: 'pet',
          icon: 'img/bnIPA.png',
          period: '2014'
        },
        {
          title: 'ishika',
          subtitle: 'watercolor paint tool in OpenGL',
          github: 'nafSadh/ishika',
          span: 'mid',
          type: 'grad',
          school: 'Stony Brook Univ',
          icon: 'img/comn48.png',
          period: '2014'
        },
        {
          title: 'SoC verification platform',
          description:
            'Platform for verifying camera and image processing SoC design. ' +
            'Designed a host-target interaction protocol, chalked architecture for the platform (Linux on ARM) and developed a dynamic GUI for verification control from host computer.',
          tech: ['C', 'C++', 'C#', 'Linux', 'WPF'],
          nolink: true,
          span: 'long',
          type: 'job',
          org_work: 'Samsung R&D Institute Bangladesh',
          icon: 'img/samsung-disk.png',
          period: 'Jan 2012-Aug 2013'
        },
        {
          title: 'Camera SoC',
          subtitle: 'Camera SoC verification and device driver development',
          description:
            'R&D project at Samsung with DMC R&D (Suwon, Korea). Carried on engineering sample chip verification and prepared drivers.',
          tech: ['μC/OS-II', 'C'],
          nolink: true,
          span: 'long',
          type: 'job',
          org_work: 'Samsung R&D Institute Bangladesh',
          icon: 'img/samsung-disk.png',
          period: '2011'
        },
        {
          title: 'WaqtScope',
          subtitle: 'Muslim prayer times calculator',
          span: 'cont',
          org_open: 'Sfaar',
          icon: 'img/waqtscope.png',
          period: '2011',
          url: 'http://app.nafsadh.com/waqtscope/',
          github: 'WaqtScope'
        },
        {
          title: 'DSP Software Development',
          subtitle: 'μC/OS-II, BSP, DVB-S, Image codec, Web-P',
          description:
            'As part of exploratory research in areas of digital signal processing at Samsung, ported μC/OS-II to custom targets, worked on DVB-S codec, ported Web-P to re-configurable processors and developed a new image codec.',
          nolink: true,
          span: 'long',
          type: 'job',
          org_work: 'Samsung R&D Institute Bangladesh',
          icon: 'img/samsung-disk.png',
          period: '2010-2011'
        },
        {
          title: 'Phone Development',
          subtitle: "Samsung's feature phones and bada phones",
          nolink: true,
          span: 'mid',
          type: 'job',
          org_work: 'Samsung R&D Institute Bangladesh',
          icon: 'img/samsung-disk.png',
          period: '2010'
        },
        {
          title: 'Sonnivo',
          subtitle: 'Bengali keyboard layout',
          span: 'cont',
          type: 'pet',
          org_open: 'Lipighor',
          icon: 'img/sonnivo.png',
          period: '2010',
          url: 'http://lipighor.github.io/Sonnivo/',
          github: 'Lipighor/Sonnivo'
        },
        {
          title: 'RS2-fx',
          subtitle: 'RDF by Structured Reference to Semantics',
          description:
            '<i>An approach to emerge Semantic Web</i><br/> We suggested a framework (RS2-fx) to convert current html web documents into Semantic Web RDF documents by extracting senses in them backed by support of an existing ontology',
          span: 'long',
          type: 'thesis',
          collab: 'Q. Ratul & S.H. Sourav',
          guide: 'Dr. R. Shams',
          school: 'KUET',
          icon: 'img/rs2-fx.png',
          period: '2009-2010',
          url:
            'https://www.slideshare.net/nafSadh/rs2-fx-the-first-presentation'
        },
        {
          title: 'NLParse',
          subtitle: 'generic parser for natural languages',
          desc:
            'Natural Language parse engine, which can parse text of a language for which a grammar and a dictionary is provided using XML files',
          span: 'sub',
          github: 'nafSadh/NLParse',
          type: 'ug-proj',
          collab: 'Q. Ratul, SH Sourav, N Hasnat, SA Parvez',
          school: 'KUET',
          icon: 'img/nlparse.png',
          period: '2009'
        },
        {
          title: 'Traffic Window',
          subtitle: 'Traffic jam detection system',
          description:
            'An automated traffic jam recognition and alert aided with image processing',
          span: 'long',
          url:
            'http://www.slideshare.net/nafSadh/traffic-jam-detection-system-by-ratul-sadh-shams',
          type: 'ug-proj',
          collab: 'Q. Ratul',
          guide: 'Dr. R. Shams',
          school: 'KUET',
          icon: 'img/trafficjam.png',
          period: '2008'
        },
        {
          title: 'LikhonPad',
          subtitle: 'Transliteration tool',
          span: 'tiny',
          type: 'pet',
          icon: 'img/likhonpad.png',
          period: '2007-08',
          github: 'nafSadh/LikhonPad'
        },
        {
          title: 'Intelligent Home',
          subtitle: 'Smart home solution',
          description:
            'centrally controlled local system of devices and sensors, actuates smartly upon perceptions',
          span: 'long',
          type: 'ug-proj',
          collab: 'Q. Ratul, S.B. Srijon & M.I. Rizel',
          guide: 'Prof MMA Hashem',
          school: 'KUET',
          icon: '/img/intelome.png',
          period: '2007'
        },
        {
          title: 'Bytex',
          subtitle: 'Windows hex-(file)-reader',
          span: 'tiny',
          type: 'pet',
          icon: 'img/comn48.png',
          period: '2007',
          github: 'Sfaar/Bytex'
        },
        {
          title: 'Kakatuya',
          subtitle: 'text narrator tool',
          span: 'tiny',
          url: 'https://sourceforge.net/projects/kakatuya/',
          type: 'pet',
          icon: '/img/kakatuya.png',
          period: '2007',
          github: 'nafSadh/Kakatuya'
        }
      ]
    };
  }
};
</script>

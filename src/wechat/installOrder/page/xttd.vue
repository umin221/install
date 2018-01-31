<template>
  <div>
    <mt-header fixed title="协同团队">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content">
      <!--<mt-cell title="标题文字">
        <span>icon 是图片</span>
        <img slot="icon" src="" width="24" height="24">
      </mt-cell>
      <mt-cell title="标题文字">
        <span>icon 是图片</span>
        <img slot="icon" src=" width="24" height="24">
      </mt-cell>
      <mt-cell title="标题文字">
        <span>icon 是图片</span>
        <img slot="icon" src="" width="24" height="24">
      </mt-cell>
      <mt-cell title="标题文字">
        <span>icon 是图片</span>
        <img slot="icon" src="" width="24" height="24">
      </mt-cell>-->
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script type="application/javascript">
  export default {
    name: 'detail',
    created: () => {
      console.dir(1);
    },
    data: () => {
      return {
        value: '',
        active: 'tab-container'
      };
    },
    beforeRouteEnter(to, from, next) {
      console.dir(2);
      next(vm => {
        let query = vm.$route.query;
        console.dir(query);
      });
    },
    methods: {
      butXttd() {
        var self = this;
        self.$router.go('/xttd');
      }
    }
  };
</script>

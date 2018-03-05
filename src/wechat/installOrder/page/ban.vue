<template>
  <div>
    <mt-header fixed title="修改楼栋名称">
      <fallback slot="left"></fallback>
      <mt-button @click.native="toEditFn" slot="right" >保存</mt-button>
    </mt-header>
    <div class="mint-content ban">
      <mt-field label="楼栋名称1" placeholder="栋1"
                :class="heartVisible"></mt-field>
      <mt-field label="楼栋名称2" placeholder="栋2"
                :class="heartVisible"></mt-field>
      <mt-field label="楼栋名称3" placeholder="栋3"
                :class="heartVisible"></mt-field>
      <mt-field label="楼栋名称4" placeholder="栋4"
                :class="heartVisible"></mt-field>
      <mt-field label="楼栋名称5" placeholder="栋5"
                :class="heartVisible"></mt-field>
    </div>
    <button-group>
      <mt-button type="primary" class="single"
                 @click.native="addFloor">新增房间</mt-button>
    </button-group>
  </div>
</template>
<style lang="scss">
</style>
<script type="application/javascript">
  import buttonGroup from 'public/components/cus-button-group';
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
    },
    components: {buttonGroup}
  };
</script>

<template>
  <div>
    <div class="mint-content">
      <div class="deviceDetail">
        <mt-cell title="产品条形码"></mt-cell>
        <mt-cell title="产品品牌"></mt-cell>
        <mt-cell title="产品型号"></mt-cell>
        <mt-cell title="保修开始时间"></mt-cell>
        <mt-cell title="保修结束时间"></mt-cell>
      </div>
    </div>
  </div>
</template>
<script>
//  import {mapState, mapActions, mapMutations} from 'vuex';
  import menuBox from 'public/components/cus-menu';
//  import { MessageBox } from 'mint-ui';
  const NameSpace = 'index';
  export default {
    name: NameSpace,
    created() {
    },
    data: () => {
      return {
      };
    },
    computed: {
//      ...mapState(NameSpace, [''])
    },
    methods: {
//      ...mapActions(NameSpace, ['']),
//      ...mapMutations(NameSpace, []),
      submit() {
        this.$router.push('myRepair');
      }
    },
    components: {menuBox}
  };
</script>
<style lang="scss">
  .deviceDetail{
    background-color: #ffffff;
  }
</style>

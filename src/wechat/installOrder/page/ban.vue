<template>
  <div>
    <mt-header fixed title="修改楼栋名称">
      <fallback slot="left"></fallback>
      <mt-button @click.native="toEdit" slot="right" >保存</mt-button>
    </mt-header>
    <div class="mint-content ban">
      <mt-field v-for="(item, index) in buildingList"  :key="index" label="楼栋名称" v-model="item.val"></mt-field>
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script type="application/javascript">
  import {mapState, mapActions} from 'vuex';
  const NameSpace = 'buildingInfo';
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
    computed: {
      ...mapState(NameSpace, ['buildingList']),
      // * 是否显示
      editClass() {
        return this.type === '' ? '' : 'editClass';
      }
    },
    methods: {
      ...mapActions(NameSpace, ['toEditFn']),
      toEdit() {
        this.toEditFn();
      }
    }
  };
</script>

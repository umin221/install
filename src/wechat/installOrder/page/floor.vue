<template>
  <div>
    <mt-header fixed title="楼层信息">
      <fallback slot="left"></fallback>
      <mt-button @click.native="toEditFn" slot="right" >保存</mt-button>
    </mt-header>
    <div class="mint-content building">
      <mt-field label="楼层名称" v-model="roomList.val"></mt-field>
      <div style="height: 5px"></div>
      <mt-field label="房间1" v-for="(item, index) in roomList.roomList"  :key="index" v-model="item.val"></mt-field>
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
  import {mapState, mapActions} from 'vuex';
  const NameSpace = 'buildingInfo';
  export default {
    name: 'detail',
    created() {
      console.dir(1);
      let param = this.$route.query;
      this.layerIndex = param.layerIndex;
      this.layer(this.layerIndex);
    },
    data: () => {
      return {
        layerIndex: '',
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
      ...mapState(NameSpace, ['roomList', 'index']),
      // * 是否显示
      editClass() {
        return this.type === '' ? '' : 'editClass';
      }
    },
    methods: {
      ...mapActions(NameSpace, ['layerFn']),
      layer(index) {
        this.layerFn(index);
      }
    },
    components: {buttonGroup}
  };
</script>

<template>
  <div>
    <mt-header fixed title="修改楼栋名称">
      <fallback slot="left"></fallback>
      <mt-button @click.native="saveFn" slot="right" >保存</mt-button>
    </mt-header>
    <div class="mint-content ban">
      <mt-cell-swipe v-for="(item, index) in assets"
                     title="楼栋名称"
                     :right="[{
                        content: '删除',
                        style: { background: 'red', color: '#fff' },
                        handler: () => removeFn(item, index)
                      }]"
                     :key="index">
        <input type="text" class="mint-field-core" v-model="item['BuildingName']"/>
      </mt-cell-swipe>
    </div>
  </div>
</template>
<style lang="scss">
  .mint-field-core {
    text-align: right;
  }
</style>
<script type="es6">
  import {mapState, mapActions, mapMutations} from 'vuex';

  const ASSETS = 'assets';
  const NAMESPACE = 'building';
  export default {
    name: NAMESPACE,
    data: () => {
      return {
      };
    },
    computed: {
      ...mapState(ASSETS, ['assets'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['save']),
      ...mapActions(ASSETS, ['removeBuilding']),
      ...mapMutations(ASSETS, ['remove']),
      // 保存楼栋信息
      saveFn() {
        this.save();
      },
      // 删除整栋
      removeFn(item, index) {
        let me = this;
        MessageBox.confirm('删除后无法撤销', '请确认').then(() => {
          let id = me.$route.query.id;
          me.removeBuilding({
            data: {
              'Object Id': id,
              'BuildingNum': item['BuildingNum']
            },
            success: data => {
              me.remove(index);
              Toast('删除成功');
            }
          });
        });
      }
    }
  };
</script>

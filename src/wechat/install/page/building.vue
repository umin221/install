<template>
  <div>
    <mt-header fixed title="修改楼栋名称">
      <fallback slot="left"></fallback>
      <mt-button @click.native="saveFn" slot="right" >保存</mt-button>
    </mt-header>
    <div class="mint-content ban">
      <mt-cell-swipe v-for="(item, index) in building"
                     title="楼栋名称"
                     :right="[{
                        content: '删除',
                        style: { background: 'red', color: '#fff' },
                        handler: () => removeFn(item, index)
                      }]"
                     :key="index">
        <input type="text" class="mint-field-core" v-model="item['BuildingName']"/>
      </mt-cell-swipe>

      <button-group>
        <mt-button class="single"
                   @click.native="addBuildingFn">新增一栋</mt-button>
      </button-group>
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
  import buttonGroup from 'public/components/cus-button-group';

  let tempBuilding;
  const ASSETS = 'assets';
  const NAMESPACE = 'building';
  export default {
    name: NAMESPACE,
    created() {
      tempBuilding = JSON.stringify(this.building);
    },
    data: () => {
      return {
      };
    },
    computed: {
      ...mapState(ASSETS, ['building'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['updateBuildingName', 'addBuilding']),
      ...mapActions(ASSETS, ['removeBuilding']),
      ...mapMutations(ASSETS, ['remove']),
      // 更新楼栋名称
      saveFn() {
        let temp = KND.Util.parse(tempBuilding);
        let id = this.$route.query.id;
        let upArr = [];
        for (let t in temp) {
          if (temp[t].BuildingName !== this.building[t].BuildingName) upArr.push(this.building[t]);
        }
        this.updateBuildingName({
          upArr: upArr,
          id: id
        });
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
      },
      // 添加楼栋
      addBuildingFn() {
        let room = KND.Util.parse(this.$route.query.room);
        this.addBuilding({
          'OrderId': room['Original Order Id'],
          'City': room['City'],
          'DetailAddress': room['Street Address'],
          'Country': room['Country'],
          'TaskId': room['KL Activity Id'],
          'Province': room['Province']
        });
      }
    },
    components: {buttonGroup}
  };
</script>

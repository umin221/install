<template>
  <div class="searchTrans">
    <cus-search v-model="value" :show="true">
      <!--<mt-checklist
        v-if="result.length"
        :options="arr"
        v-model="name">
      </mt-checklist>-->
      <cus-cell class="multiple"
                v-for="item in result"
                :key="item.id"
                :title="'配件名称:'+ item['KL Product Name Join']"
                @click.native="selectFn(item)">
        <div class="mint-cell-sub-title" slot="title">配件代码: {{item['Product Name']}}</div>
        <div class="mint-cell-sub-title" slot="title">数量: {{item['KL Inventory Qty']}}</div>
        <div class="mint-cell-sub-title" slot="title">配件描述:{{item["KL Product Description"]}} </div>
        <div v-show="showSelect(item)" class="selectIcon" slot="title">
          <i class="xs-icon icon-select"></i>
        </div>
      </cus-cell>
    </cus-search>
    <button-group>
      <mt-button class="single" @click.native="selectEnter">确认</mt-button>
    </button-group>
  </div>
</template>
<style lang="scss">
  .selectIcon{
    position: absolute;
    right: 10px;
    top: 2px;
  }
</style>
<script type="es6">
  import {mapState, mapActions, mapMutations} from 'vuex';
  import cusLoadmore from 'public/components/cus-loadmore';
  import cusSearch from 'public/components/cus-search';
  import cusCell from 'public/components/cus-cell';

  const NAMESPACE = 'searchTrans';
  export default {
    name: NAMESPACE,
    created() {
      let me = this;
      me.getProduct({
        callback: function() {
          /* for (let i = 0; i < me.result.length;i++) {
            let name = me.result[i]['KL Product Name Join'] + me.result[i]['Product Name'];
            me.arr.push({
              label: name,
              value: me.result[i]
            });
          }*/
        }
      });
    },
    components: {cusLoadmore, cusSearch, cusCell},
    data: () => {
      return {
        value: '',
        name: [],
        number: [],
        selectName: {},
        topStatus: '',
        arr: []
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['result', 'selected', 'returnSelect'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['getProduct']),
      ...mapMutations(NAMESPACE, ['count', 'saveModelData', 'initSelected']),
      ...mapMutations('saveFault', ['selectProduct']),
//      ...mapMutations('comEnter', ['successCall']),
      showSelect(item) {
        return this.selectName[item['Product Name']];
      },
      /**
       *修改是否选中
       */
      selectFn(item) {
        let flag = !this.selectName[item['Product Name']];
        if (flag) {
          this.$set(this.selectName, item['Product Name'], item);
        } else {
          this.$set(this.selectName, item['Product Name'], null);
          delete this.selectName[item['Product Name']];
        }
      },
      selectEnter() {
        let me = this;
        let select = this.selectName;
        // var objList = [];
        for (let i in select) {
          var obj = {
            Name: select[i]['Product Name'],
            num: 1,
            'KL Translated Name': select[i]['KL Product Name Join'],
            'List Price': select[i]['KL Price'],
            Id: select[i]['Id']
          };
          me.selectProduct(obj);
        }
        me.$router.go(-1);
      },
      searchFn(val) {
        let me = this;
        me.getProduct({
          val: val,
          callback: function() {
            me.arr = [];
            me.name = [];
            for (let i = 0; i < me.result.length;i++) {
              let name = me.result[i]['KL Product Name Join'] + me.result[i]['Product Name'];
              me.arr.push({
                label: name,
                value: me.result[i]
              });
            }
          }
        });
      }
//      options() {
//        let me = this;
//        for (let i = 0; i < me.result.length;i++) {
//          let name = me.result[i]['KL Product Name Join'] + me.result[i]['Product Name'];
//          me.arr.push({
//            label: name,
//            value: me.result[i]
//          });
//        };
//        return me.arr;
//      },
//      loadBottomFn() {
//      },
//      select(index, isShow) {
//        this.count({index, isShow});
//      },
    }
  };
</script>

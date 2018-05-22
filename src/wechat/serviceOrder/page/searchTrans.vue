<template>
  <div class="searchTrans">
    <cus-search v-model="value" :show="true">
      <mt-checklist
        v-if="result.length"
        :options="arr"
        v-model="name">
      </mt-checklist>
    </cus-search>
    <button-group>
      <mt-button class="single" @click.native="selectEnter">确认</mt-button>
    </button-group>
  </div>
</template>
<style lang="scss">
  .selectIcon {
    position: absolute;
    top: 0;
    right: 0;
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
          for (let i = 0; i < me.result.length;i++) {
            let name = me.result[i]['KL Product Name Join'] + me.result[i]['Product Name'];
            me.arr.push({
              label: name,
              value: me.result[i]
            });
          }
        }
      });
    },
    components: {cusLoadmore, cusSearch, cusCell},
    data: () => {
      return {
        value: '',
        name: [],
        number: [],
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
      },
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
      selectEnter() {
        let me = this;
        for (let i = 0; i < me.result.length; i++) {
          if (me.name[i]) {
            me.name[i].num = 1;
            me.selectProduct({
              Name: me.name[i]['Product Name'],
              num: 1,
              'KL Translated Name': me.name[i]['KL Product Name Join'],
              'List Price': me.name[i]['KL Price'],
              Id: me.name[i]['Id']
            });
          }
        }
        me.$router.go(-1);
      }
    }
  };
</script>

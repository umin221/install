<!--搜索交接单-->
<template>
  <div class="search">
    <cus-search v-model="value"
                :show="true"
                placeholder="请输入配件代码或配件描述">

      <cus-loadmore ref="result"
                    @loadBottom="loadBottomFn"
                    :emptyTips="false"
                    :refresh="false">
        <cus-cell class="multiple"
                  :key="item.id"
                  :title="'配件名称:'+ item['KL Translated Name']"
                  @click.native="selectFn(item)"
                  v-for="item in result">
          <div class="mint-cell-sub-title" slot="title">配件代码: {{item.Name}}</div>
          <div class="mint-cell-sub-title" slot="title">价格:{{item["List Price"]}} </div>
          <div class="mint-cell-sub-title" slot="title">配件描述:{{item["KL Translated Description"]}} </div>
          <div v-show="showSelect(item)" class="selectIcon" slot="title">
            <i class="xs-icon icon-select"></i>
          </div>
        </cus-cell>
      </cus-loadmore>
      <button-group>
        <mt-button class="single"
                   @click.native="submitFn">确认</mt-button>
      </button-group>
    </cus-search>
  </div>
</template>
<style>
  .selectIcon{
    position: absolute;
    right: 10px;
    top: 2px;
  }
  .mint-search-list {
    padding-bottom: 40px!important;
  }
</style>
<script type="es6">
  import {mapState, mapActions, mapMutations} from 'vuex';
  import cusLoadmore from 'public/components/cus-loadmore';
  import cusSearch from 'public/components/cus-search';
  import cusCell from 'public/components/cus-cell';
  //
  let loader = function(...args) {
    let me = this;
    let event = args.pop();
    let name = me.value;
    let param = {
      data: {
        'name': name
      },
      more: args.pop(),
      callback: (data) => {
        me.$refs.result[event](data.length);
      }
    };
    // 获取团队列表
    me.getSearchProduct(param);
  };

  const NAMESPACE = 'searchPart';
  export default {
    name: NAMESPACE,
    components: {cusLoadmore, cusSearch, cusCell},
    data: () => {
      return {
        value: '',
        selectName: {},
        topStatus: ''
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['result'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['getSearchProduct']),
      ...mapMutations('add', ['selectProduct']),
      /**
       * 搜索回调
       * @param {String} val 搜索值
       */
      searchFn(val) {
        loader.call(this, 'onBottomLoaded');
      },
      showSelect(item) {
        return this.selectName[item['Name']];
      },
      /**
       *修改是否选中
       */
      selectFn(item) {
        let flag = !this.selectName[item['Name']];
        if (flag) {
          this.$set(this.selectName, item['Name'], item);
        } else {
          this.$set(this.selectName, item['Name'], null);
          delete this.selectName[item['Name']];
        }
      },
      submitFn() {
        let me = this;
        let select = this.selectName;
        // var objList = [];
        for (let i in select) {
          var obj = {};
          obj = select[i];
          obj['num'] = 1;
          me.selectProduct(obj);
        }
        me.$router.go(-1);
      },
      /**
       * Load more
       */
      loadBottomFn() {
        loader.call(this, {
          more: true
        }, 'onBottomLoaded');
      }
    }
  };
</script>

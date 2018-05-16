<!--选择门厂-->
<template>
  <div>
    <cus-search placeholder="请输入门厂名称"
                v-model="value"
                :show="true">

      <cus-loadmore ref="result"
                    :refresh="false"
                    @loadBottom="loadBottomFn">
        <mt-cell class="multiple"
                 v-for="item in result"
                 @click.native="selectFn(item)"
                 :key="item.id"
                 is-link>
          <div class="mint-cell-title co-flex" slot="title">
            <span class="co-f1">名称: {{item['Name']}}</span>
          </div>
          <div class="mint-cell-sub-title" slot="title">联系电话: {{item['Main Phone Number']}}</div>
        </mt-cell>
      </cus-loadmore>

    </cus-search>
  </div>
</template>

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
      more: args.pop(),
      data: {
        'Name': name
      },
      callback: (data) => {
        me.$refs.result[event](data.length);
      }
    };
    // 获取门厂列表
    me.findFactory(param);
  };

  const NAMESPACE = 'doorFactory';
  export default {
    name: NAMESPACE,
    // 获取默认数据
    created() {
      loader.call(this, 'onBottomLoaded');
    },
    components: {cusLoadmore, cusSearch, cusCell},
    data: () => {
      return {
        value: ''
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['result', 'select'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['findFactory']),
      ...mapMutations(NAMESPACE, ['selFactory']),
      /**
       * 搜索回调
       * @param {String} val 搜索值
       */
      searchFn(val) {
        loader.call(this, 'onBottomLoaded');
      },
      /**
       * select
       * @param {Object} item 用户选择结果
       */
      selectFn(item) {
        this.selFactory(item);
        this.$router.back();
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

<style lang="scss">
  .mint-cell {
    .mint-cell-title {
      width: auto;
    }
  }
</style>

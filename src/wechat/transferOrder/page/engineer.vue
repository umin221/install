<!--选择联系人-->
<template>
  <div>
    <cus-search placeholder="请输入姓名"
                v-model="value"
                :show="true">

      <cus-loadmore ref="result"
                  :loadBottom="loadBottomFn"
                  :topStatus="topStatus">
        <mt-cell class="multiple"
                  v-for="item in result"
                  :key="item.id"
                  @click.native="selectFn(item)"
                  is-link>
          <div class="mint-cell-title" slot="title">姓名: {{item['Last Name']}}</div>
          <div class="mint-cell-sub-title" slot="title">工号: {{item['Emp #']}}</div>
          <div class="mint-cell-sub-title" slot="title">部门: {{item['KL Primary Division Name']}}</div>
        </mt-cell>
      </cus-loadmore>

    </cus-search>
  </div>
</template>

<script type="application/javascript">
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
        'position': '产品安装工程师||产品安装主管',
        'Last Name': name
      },
      callback: (data) => {
        me.$refs.result[event](data.length);
      }
    };
    // 获取团队列表
    me.findEngineer(param);
  };

  const NAMESPACE = 'engineer';
  export default {
    name: 'search',
    // 获取默认数据
    created() {
      loader.call(this, 'onBottomLoaded');
    },
    components: {cusLoadmore, cusSearch, cusCell},
    data: () => {
      return {
        value: '',
        topStatus: ''
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['result', 'select'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['findEngineer']),
      ...mapMutations(NAMESPACE, ['selEngineer']),
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
        this.selEngineer(item);
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

<template>
  <div class="search">
    <cus-search v-model="value"
                placeholder="请输入服务单编号">

        <cus-loadmore ref="result"
                      :loadBottom="loadBottomFn"
                      :topStatus="topStatus">
          <cus-cell class="multiple"
                    :key="item.id"
                    :title="'服务单编号:'+ item['SR Number']"
                    @click.native="toDetailFn(item['SR Number'],item['Contact Id'])"
                    v-for="item in result"
                    is-link>
            <div class="mint-cell-sub-title" slot="title">申请时间: {{item.Created}}</div>
            <div class="mint-cell-sub-title" slot="title">优先级: {{item.Priority}}</div>
            <div class="mint-cell-sub-title" slot="title">地址:{{item['KL Personal Province']}} {{item['Personal City']}} {{item['Personal Street Address']}}</div>
          </cus-cell>
        </cus-loadmore>

    </cus-search>
  </div>
</template>

<script type="es6">
  import {mapState, mapActions} from 'vuex';
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
        'Owner': me.loginMeg['Emp #'],
        'SR Number': name
      },
      more: args.pop(),
      callback: (data) => {
        me.$refs.result[event](data.length);
      }
    };
    // 获取团队列表
    me.getList(param);
  };

  const NAMESPACE = 'searchList';
  export default {
    name: 'search',
    components: {cusLoadmore, cusSearch, cusCell},
    data: () => {
      return {
        value: '',
        topStatus: ''
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['result']),
      ...mapState('index', ['loginMeg'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['getList']),
      /**
       * 搜索回调
       * @param {String} val 搜索值
       */
      searchFn(val) {
        this.value = val;
        loader.call(this, 'onBottomLoaded');
      },
      /**
       * To detail
       * @param {Object} item 行内容
       */
      toDetailFn(type, name) {
        this.$router.push({
          name: 'serviceDetail',
          query: {
            type: type,
            id: name
          }
        });
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

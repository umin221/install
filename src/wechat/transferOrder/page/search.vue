<!--搜索交接单-->
<template>
  <div class="search">
    <cus-search v-model="value"
                placeholder="请输入项目名称或负责人">

        <cus-loadmore ref="result"
                      :loadBottom="loadBottomFn"
                      :topStatus="topStatus">
          <cus-cell class="multiple"
                    :key="item.id"
                    :title="'合作伙伴名称:'+ item.Name"
                    @click.native="toDetailFn(item)"
                    v-for="item in result"
                    is-link>
            <div class="mint-cell-sub-title" slot="title">合作伙伴负责人: {{item['KL Partner Owner Name']}}</div>
            <div class="mint-cell-sub-title" slot="title">联系电话: {{item['Main Phone Number']}}</div>
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
        'Lead Name': name + '*',
        'Setter': name + '*'
      },
      more: args.pop(),
      callback: (data) => {
        me.$refs.result[event](data.length);
      }
    };
    // 获取团队列表
    me.getTransferOrder(param);
  };

  const NAMESPACE = 'index';
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
      ...mapState(NAMESPACE, ['result'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['getTransferOrder']),
      /**
       * 搜索回调
       * @param {String} val 搜索值
       */
      searchFn(val) {
        loader.call(this, 'onBottomLoaded');
      },
      /**
       * To detail
       * @param {Object} item 行内容
       */
      toDetailFn(item) {
        this.$router.push({
          name: 'detail',
          query: {
            // detail
            type: 'read',
            id: item.Id
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

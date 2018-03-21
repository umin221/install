<template>
  <div>
    <cus-search v-model="value"
                :show="true"
                placeholder="请输入合作伙伴名称">

        <cus-loadmore ref="result"
                      :loadBottom="loadBottomFn"
                      :emptyTips="false"
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
        'Name': name
      },
      more: args.pop(),
      callback: (data) => {
        me.$refs.result[event](data.length);
      },
      // 结果渲染列表
      lst: 'result'
    };
    if (!this.isManager) {
      param.data['KL Partner Status'] = '待审批';
    }
    // 获取团队列表
    me.getPartners(param);
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
      ...mapState(NAMESPACE, ['result']),
      ...mapState('index', ['isManager'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['getPartners']),
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
            state: config.mapp.k2v[item['KL Partner Status']],
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

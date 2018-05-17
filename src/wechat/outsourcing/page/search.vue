<template>
  <div>
    <cus-search v-model="value"
                :show="true"
                placeholder="请输入合作伙伴名称">

        <cus-loadmore ref="result"
                      :emptyTips="false"
                      :refresh="false"
                      @loadBottom="loadBottomFn">
          <cus-cell class="multiple"
                    v-for="item in result"
                    :key="item.id"
                    :title="'合作伙伴名称:'+ item.Name"
                    @click.native="toDetailFn(item)"
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
  let loader = function(more) {
    let me = this;
    let name = me.value;
    let param = {
      type: 'result',
      name,
      more,
      callback: (data) => {
        me.$refs.result['onBottomLoaded'](data.length);
      }
    };
    // 获取团队列表
    me.getPartners(param);
  };

  const NAMESPACE = 'index';
  export default {
    name: 'search',
    components: {cusLoadmore, cusSearch, cusCell},
    data: () => {
      return {
        value: ''
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
        loader.call(this);
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
        loader.call(this, true);
      }
    }
  };
</script>

<!--搜索交接单-->
<template>
  <div class="search">
    <cus-search v-model="value"
                :show="true"
                placeholder="请输入工程名称或合同编号">

        <cus-loadmore ref="result"
                      @loadBottom="loadBottomFn"
                      :emptyTips="false"
                      :refresh="false">
            <cus-cell class="multiple"
                      :key="item.id"
                      :title="'合同编号:'+ item['Agree Number']"
                      @click.native="toDetailFn(item)"
                      v-for="item in result"
                      is-link>
              <div class="mint-cell-sub-title" slot="title">工程: {{item['Lead Name']}}</div>
              <div v-if="isTeam" class="mint-cell-sub-title" slot="title">负责人: {{item['Project Owner Name']}}</div>
              <div class="mint-cell-sub-title" slot="title">更新日期: {{new Date(item['Updated']).format('yyyy-MM-dd hh:mm:ss')}}</div>
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
    let exp = `*${me.value}*`;
    let param = {
      type: 'result',
      data: {
        'Agree Number': exp, // 项目编号
        'Opportunity Name': exp // 项目名称
      },
      more,
      callback: (data) => {
        me.$refs.result['onBottomLoaded'](data.length);
      }
    };
    // 负责人
    if (me.isTeam) param.data['Project Owner Name'] = exp;
    // 获取团队列表
    me.getTransferOrder(param);
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
      ...mapState(NAMESPACE, ['result', 'isTeam'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['getTransferOrder']),
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

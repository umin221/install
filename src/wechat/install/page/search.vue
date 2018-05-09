<template>
  <div>
    <cus-search v-model="value"
                :show="true"
                placeholder="请输入项目名称">

      <cus-cell class="multiple"
                v-for="item in result"
                :key="item.id"
                :title="'订单批次:'+ item.Id"
                @click.native="toDetailFn(item.Id)"
                is-link>
        <div class="mint-cell-sub-title" slot="title">项目名称: {{item['KL Agreement Opportunity Name']}}</div>
        <div class="mint-cell-sub-title" slot="title">创建日期: {{item['Created']}}</div>
      </cus-cell>

    </cus-search>
  </div>
</template>

<script type="es6">
  import {mapState, mapMutations} from 'vuex';
  import cusLoadmore from 'public/components/cus-loadmore';
  import cusSearch from 'public/components/cus-search';
  import cusCell from 'public/components/cus-cell';
  //
  const NAMESPACE = 'index';
  export default {
    name: 'search',
    components: {cusLoadmore, cusSearch, cusCell},
    created() {
      this.setTask({installTask: [], list: 'result'});
    },
    data: () => {
      return {
        value: '',
        topStatus: ''
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['pending', 'result'])
    },
    methods: {
      ...mapMutations(NAMESPACE, ['setTask']),
      /**
       * 搜索回调
       * @param {String} val 搜索值
       */
      searchFn(val) {
        let me = this;
        let installTask = Array.prototype.filter.call(me.pending, item => item['KL Agreement Opportunity Name'].indexOf(val) !== -1);
        me.setTask({installTask, list: 'result'});
      },
      /**
       * To detail
       * @param {Object} item 行内容
       */
      toDetailFn(id) {
        this.$router.push({
          name: 'assets',
          query: {
            TaskId: id
          }
        });
        // 标记楼栋资产刷新
        KND.Session.set('refreshAssets', true);
      }
    }
  };
</script>

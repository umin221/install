/**
* @file 选择项目
* @author  石
* @date  2018/3/16
*/
<template>
  <div id='select-project'>
    <!-- <mt-header fixed :title="headTitle">
      <fallback slot="left"></fallback>
    </mt-header> -->
    <cus-search ref="search" placeholder="请输入项目关键字" @input='searchFn' :show="isShwo" v-model="value">
        <div class="mint-content">
        <cus-loadmore ref="pending"
                @loadTop='pendingLoadTopFn'
                @loadBottom="pendingLoadBottomFn"
                :topStatus="topStatus">     
                <cus-radio :list="list" @change="handleChange"></cus-radio>
          </cus-loadmore>
    </div>
    </cus-search>
    
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex';
  import cusLoadmore from 'public/components/cus-loadmore';
  import cusSearch from 'public/components/cus-search';
  import cusRadio from '../components/cus-radio';

  const NAMESPACE = 'detail';
  
  export default {
    components: {cusLoadmore, cusSearch, cusRadio},
    name: 'selectProject',
    data() {
      return {
        headTitle: '选择安装订单',
        topStatus: 'loading',
        isShwo: true, // 显示搜索列表
        value: '', // 搜索参数
        list: [
          {
            id: 1,
            type: '脑白金礼品',
            name: '上门配送免费'
          },
          {
            id: 2,
            type: '旺旺大礼品',
            name: '包邮'
          }
        ]
      };
    },
    created() {
    },
    computed: {
      ...mapState(NAMESPACE, ['projectDate'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['setProject']),
      // 点击选择
      handleChange(item, index) {
        this.setProject(item);
        this.$router.go(-1);
      },
      // 顶部
      pendingLoadTopFn() {
        console.log('top');
        this.topStatus = 'drop';
      },
      // 底部
      pendingLoadBottomFn() {
        console.log('bottom');
      },
      // 搜索
      searchFn(val) {
        console.log(val, this.value);
      }
    }
  };

</script>

<style scoped lang="scss">
*{
    margin: 0;
    padding: 0;
}
.mint-content{
    background: #fff;
}

</style>

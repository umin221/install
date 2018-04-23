/**
* @file 选择项目
* @author  石
* @date  2018/3/26
*/
<template>
  <div id='select-project'>
    <!-- <mt-header fixed :title="headTitle">
      <fallback slot="left"></fallback>
    </mt-header> -->
    <cus-search ref="search" placeholder="请输入关键字" :show="true" v-model="value">
      <div class="mint-content">
        <mt-cell class='border-bottom'
                 :title="item['KL Agreement Opportunity Name']"
                 v-for='(item,index) in installList'
                 :key='index'
                 @click.native="handleChange(item)"></mt-cell>
      </div>
    </cus-search>
  </div>
</template>
<script>
  import {mapActions, mapState} from 'vuex';
  import cusLoadmore from 'public/components/cus-loadmore';
  import cusSearch from 'public/components/cus-search';

  const NAMESPACE = 'selectProject';
  let userInfo = {};
  export default {
    components: {cusLoadmore, cusSearch},
    name: 'selectProject',
    data() {
      return {
        topStatus: 'loading',
        isShwo: true, // 显示搜索列表
        value: '', // 搜索参数
        selected: []
      };
    },
    created() {
      KND.Native.getUserInfo((info) => {
        userInfo = info;
        let PositionId = userInfo['Primary Position Id'];
        this.getinstall({id: PositionId});
      });
    },
    computed: {
      ...mapState(NAMESPACE, ['installList'])
    },
    methods: {
      ...mapActions('add', ['setProject']),
      ...mapActions(NAMESPACE, ['getinstall']),
      // 点击
      handleChange(item) {
        this.setProject(item);
        this.$router.go(-1);
      },
      // 搜索
      searchFn(val) {
        let me = this;
        let PositionId = userInfo['Primary Position Id'];
        me.getinstall({id: PositionId, name: val});
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
.mint-cell-wrapper {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}
.line-text{
    white-space: nowrap;
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
}
.mint-cell-title {
  line-height: 25px;
  overflow: hidden;
}
.mint-cell-label{
    font-size: 14px;
}
.border-bottom{
  border-bottom: 1px solid #eee;
}
</style>

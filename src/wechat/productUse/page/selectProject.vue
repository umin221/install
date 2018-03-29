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
    <cus-search ref="search" placeholder="请输入关键字" @input='searchFn' :show="isShwo" v-model="value">
        <div class="mint-content">
        <cus-loadmore ref="pending" @loadTop='pendingLoadTopFn' @loadBottom="pendingLoadBottomFn" :param="{status:'all'}">
            <mt-cell class='border-bottom' :title="item.name" v-for='(item,index) in list' :key='index' @click.native="handleChange(item)"></mt-cell>
          </cus-loadmore>
    </div>
    </cus-search>
  </div>
</template>
<script>
  import api from '../api/api';
  import { mapActions } from 'vuex';
  import cusLoadmore from 'public/components/cus-loadmore';
  import cusSearch from 'public/components/cus-search';

  // const NAMESPACE = 'selectProject';

  let loader = function(...args) {
    let me = this;
    let event = args.pop();
    let list = args.pop();
    let param = Object.extend(true, {
      callback: (data) => {
        me.$refs[list][event](data.length);
      }
    }, args.pop() || {});
    // 获取数据
    me.getList(param);
  };
  export default {
    components: {cusLoadmore, cusSearch},
    name: 'selectProject',
    data() {
      return {
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
            name: '包邮1'
          },
          {
            id: 3,
            type: '苹果',
            name: '包邮2'
          },
          {
            id: 4,
            type: '香蕉',
            name: '包邮3'
          },
          {
            id: 5,
            type: '西瓜',
            name: '包邮4'
          }
        ],
        selected: []
      };
    },
    created() {
    },
    computed: {
    },
    methods: {
      ...mapActions('add', ['setProject']),
      // 获取数据
      getList() {
        api.get({
          key: 'getProjectList',
          success: data => {
            console.log(data);
          }
        });
      },
      // 点击
      handleChange(item) {
        this.setProject(item);
        this.$router.go(-1);
      },
      // 顶部
      pendingLoadTopFn(param) {
        loader.call(this, {
          data: {
            'Status': param.status
          }
        }, param.list, 'onTopLoaded');
      },
      // 底部
      pendingLoadBottomFn(param) {
        loader.call(this, {
          data: {
            'Status': param.status
          },
          more: true
        }, param.list, 'onBottomLoaded');
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

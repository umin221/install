/**
* @file 选择配件
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
            <div class="mint-cell-wrapper" v-for='(item,index) in list' :key='index'>
                <div class="mint-cell-value">
                    <check-box :index='index' :item='item' :checked="isChecked(item)" @change="handleChange" :style="{margin:'0 10px'}"></check-box>
                </div>
                <div class="mint-cell-title">
                    <span class="mint-cell-text line-text">配件编码：{{item.type}}</span>
                    <span class="mint-cell-label line-text">配件名称：{{item.name}}</span>
                </div>
            </div>
          </cus-loadmore>
    </div>
    </cus-search>
    <button-group class="singBtn">
        <mt-button class="submitBtn" type="primary" @click.native="handleSave">确定</mt-button>
    </button-group>
  </div>
</template>
<script>
  import api from '../api/api';
  import {mapState, mapActions} from 'vuex';
  import cusLoadmore from 'public/components/cus-loadmore';
  import cusSearch from 'public/components/cus-search';
  import checkBox from '../components/checkbox';
  import buttonGroup from 'public/components/cus-button-group';

  // const NAMESPACE = 'selectParts';

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
    components: {cusLoadmore, cusSearch, checkBox, buttonGroup},
    name: 'selectParts',
    data() {
      return {
        topStatus: 'loading',
        isShwo: true, // 显示搜索列表
        value: '', // 搜索参数
        list: [
          {
            id: 1,
            type: '脑白金礼品',
            name: '上门配送免费',
            sum: 1
          },
          {
            id: 2,
            type: '旺旺大礼品',
            name: '包邮1',
            sum: 1
          },
          {
            id: 3,
            type: '苹果',
            name: '包邮2',
            sum: 1
          },
          {
            id: 4,
            type: '香蕉',
            name: '包邮3',
            sum: 1
          },
          {
            id: 5,
            type: '西瓜',
            name: '包邮4',
            sum: 1
          }
        ],
        selected: []
      };
    },
    created() {
      this.selected = [...this.partList];
    },
    computed: {
      ...mapState('add', ['partList'])
    },
    methods: {
      ...mapActions('add', ['setPartList']),
      // 获取数据
      getList() {
        api.get({
          key: 'getPartList',
          success: data => {
            console.log(data);
          }
        });
      },
      // 是否选中
      isChecked(item) {
        var flag = false;
        this.partList.forEach((l, i) => {
          if (item.id === l.id) {
            flag = true;
          }
        });
        return flag;
      },
      // 点击选择
      handleChange(item, index, isChecked) {
        var self = this;
        if (!isChecked) {
          self.selected.forEach((l, i) => {
            if (item.id === l.id) {
              self.selected.splice(i, 1);
            }
          });
        } else {
          this.selected.push(item);
        }
      },
      // 点击底部确定按钮
      handleSave() {
        this.setPartList(this.selected);
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
</style>

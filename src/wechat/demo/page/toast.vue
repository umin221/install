<template>
  <div>
    <mt-header fixed title="Toast">
    </mt-header>
    <div style="margin-top: 100px;">
      <mt-button type="default" @click.native="handleClick(1)">点击弹出</mt-button>
      <mt-button type="default" @click.native="handleClick(2)">点击弹出带有 icon 的 Toast</mt-button>
      <mt-button type="default" @click.native="handleClick(3)">自定义 Toast 位置</mt-button>
    </div>
  </div>
</template>

<script type="application/javascript">
  import api from '../api/api';
  import {mapState, mapActions} from 'vuex';
  import { Toast } from 'mint-ui';
  const NameSpace = 'index';
  export default {
    name: NameSpace,
    created: () => {
      api.get({
        key: 'toastClick1',
        callback: function(data) {
          console.dir(data);
        }
      });
    },
    data: () => {
      return {
        active: 'tab-container1'
      };
    },
    computed: {
      ...mapState(NameSpace, ['value'])
    },
    methods: {
      ...mapActions(NameSpace, ['handleClick']),
      handleClick(status) {
        if (status === 1) {
          Toast({
            message: '提示',
            position: 'bottom',
            duration: 5000
          });
        } else if (status === 2) {
          Toast({
            message: '操作成功',
            iconClass: 'icon icon-success'
          });
        } else if (status === 3) {
          Toast({
            message: '自定义 Toast 位置',
            position: 'bottom'
          });
        }
      }
    }
  };
</script>
<style>
  .mint-button--normal {
    display: inline-block;
    padding: 0 12px;
    width: 96%;
    margin: 15px 10px;
  }
  .icon-success {
    font-family: "mintui";
    content: '\E602';
    font-size: 20px;
  }
</style>

<template>
  <div>
    <mt-header fixed title="Action sheet">
    </mt-header>
    <div style="margin-top: 100px;">
      <mt-button type="default" @click.native="handleClick(1)">点击上拉 action sheet</mt-button>
      <mt-button type="default" @click.native="handleClick(2)">不带取消按钮的 action sheet</mt-button>
      <mt-actionsheet
        :actions="actions"
        v-model="sheetVisible">
      </mt-actionsheet>
    </div>
  </div>
</template>

<script type="application/javascript">
  import api from '../api/api';
  import {mapState, mapActions} from 'vuex';
  // import { Actionsheet } from 'mint-ui';
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
        active: 'tab-container1',
        actions: [
          {
            title: '拍照'
          },
          {
            title: '从相册中选择'
          }
        ]
      };
    },
    computed: {
      ...mapState(NameSpace, ['value'])
    },
    methods: {
      ...mapActions(NameSpace, ['handleClick']),
      handleClick(status) {
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

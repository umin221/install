<template>
  <div>
    <mt-header fixed title="Message box">
      <fallback slot="left"></fallback>
    </mt-header>
    <div style="margin-top: 100px;" class="messageCon">
      <mt-button type="default" @click.native="handleClick(1)">打开 alter 提示框</mt-button>
      <mt-button type="default" @click.native="handleClick(2)">打开 confirm 提示框</mt-button>
      <mt-button type="default" @click.native="handleClick(3)">打开 prompt 提示框</mt-button>
    </div>
  </div>
</template>

<script type="application/javascript">
  import {mapState, mapActions} from 'vuex';
  const NameSpace = 'index';
  export default {
    name: NameSpace,
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
          MessageBox('提示', '操作成功');
        } else if (status === 2) {
          MessageBox({
            title: '',
            message: '确定执行此操作?',
            showCancelButton: true
          }).then(action => {
            if (action === 'confirm') {
              console.log('abc');
            }
          }).catch(err => {
            if (err === 'cancel') {
              console.log('123');
            }
          });
        } else if (status === 3) {
          MessageBox.prompt('请输入姓名').then(({ value, action }) => {
          });
        }
      }
    }
  };
</script>
<style lang="scss">
  .messageCon {
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
  }
</style>

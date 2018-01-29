<template>
  <div>
    <mt-header fixed title="Action sheet">
      <fallback slot="left"></fallback>
    </mt-header>
    <div style="margin-top: 100px;" class="actionCon">
      <mt-button type="default" @click.native="sheetVisible = true">点击上拉 action sheet</mt-button>
      <mt-button type="default" @click.native="sheetVisible2 = true">不带取消按钮的 action sheet</mt-button>
      <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
      <mt-actionsheet :actions="actions2" v-model="sheetVisible2" cancel-text=""></mt-actionsheet>
    </div>
  </div>
</template>

<script type="application/javascript">
  import api from '../api/api';
  import {mapState, mapActions} from 'vuex';
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
        sheetVisible: false,
        sheetVisible2: false,
        actions: [{
          name: '拍照',
          method: 'takePhoto'
        }, {
          name: '从相册中选择',
          method: this.openAlbum
        }],
        actions2: [{
          name: '确定'
        }, {
          name: '返回上一步',
          method: this.goBack
        }]
      };
    },
    computed: {
      ...mapState(NameSpace, ['value'])
    },
    methods: {
      ...mapActions(NameSpace, ['handleClick']),
      takePhoto() {
        console.log('taking photo');
      },
      openAlbum() {
        console.log('opening album');
      },
      goBack() {
        history.go(-1);
      }
    }
  };
</script>
<style lang="scss">
  .actionCon {
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

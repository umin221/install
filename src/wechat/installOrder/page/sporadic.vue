<template>
  <div>
    <mt-header fixed title="真锁安装">
      <fallback slot="left"></fallback>
      <mt-button slot="right" @click.native="submit"  v-show="type">提交</mt-button>
    </mt-header>
    <div class="mint-content">
      <mt-cell v-for="item in objList" :key="item.id" is-link @click.native="scavenging">
        <div slot="title" class="list-text"><span>产品型号:</span><span>{{item.code}}</span></div>
        <div slot="title" class="list-text"><span>产品条形码:</span><span>{{item.savrsNo}}</span></div>
        <div slot="title" class="list-text"><span></span><span>{{item.name}}</span></div>
      </mt-cell>
      <button-group>
        <mt-button class="single"
                   v-show="type"
                   @click.native="scavenging">扫码安装</mt-button>
      </button-group>
    </div>
  </div>
</template>

<script type="application/javascript">
  // import api from '../api/api';
  import buttonGroup from 'public/components/cus-button-group';
  import {mapState, mapActions} from 'vuex';
  import { Toast } from 'mint-ui';
  import api from '../api/api';

  const NameSpace = 'sporadic';
  export default {
    name: NameSpace,
    created() {
      let param = this.$route.query;
      this.type = param.type;
      this.id = param.item.Id;
      this.orderID = param.orderID;
      this.getSporadic();
    },
    data: () => {
      return {
        type: false, // 是否可以编辑
        searchKey: false,
        searchValue: '',
        selected: '1',
        allLoaded: '',
        topStatus: '',
        objList: [
          {id: '1', code: 'SZ100', savrsNo: 'AZ201706010001001', name: 'XXXXXXX'},
          {id: '2', code: 'SZ200', savrsNo: 'AZ201706010001002', name: 'ZZZZZZ'},
          {id: '3', code: 'SZ300', savrsNo: 'AZ201706010001003', name: 'QQQQQQQ'}
        ]
      };
    },
    computed: {
      ...mapState(NameSpace, ['value'])
    },
    methods: {
      ...mapActions(NameSpace, ['getList']),
      submit() {
        var self = this;
        if (self.objList.length === 0) {
          Toast('请先扫码安装，再提交！');
          return;
        }
        MessageBox({
          title: '提示',
          message: ' 确认提交？一经提交不可修改',
          showCancelButton: true
        }).then(action => {
          if (action === 'confirm') {
            api.get({ // 更改按钮状态
              key: 'getUPStatus',
              method: 'POST',
              data: {
                'body': {
                  'ProcessName': 'KL Install Task Submit For Approval Workflow',
                  'RowId': self.id
                }
              },
              success: function(data) {
                if (!data.ERROR) {
                  Toast('提交成功');
                  KND.Util.back();
                }
              }
            });
          }
        });
      },
      scavenging() {
        var self = this;
        self.$router.push({
          name: 'scanCode',
          query: {
            type: self.type,
            id: self.id,
            orderID: self.orderID
          }
        });
      },
      getSporadic() {
        var self = this;
        api.get({ // 更改按钮状态
          key: 'getSporadic',
          data: {
            id: self.id
          },
          success: function(data) {
            if (data) {
            }
          }
        });
      }
    },
    components: {buttonGroup}
  };
</script>
<style>
  .mint-search {
    height: 8vh!important;
  }
  .list-img {
    color: #A2BBFC;
  }
  .list-text {
    line-height: 30px;
  }
</style>

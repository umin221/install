<template>
  <div>
    <mt-header fixed title="真锁安装">
      <fallback slot="left"></fallback>
      <mt-button slot="right" @click.native="submit"  v-show="type" v-if="objList.length > 0">提交</mt-button>
    </mt-header>
    <div class="mint-content">
      <!-- :right="getSwipeBtn(item, index)"-->
      <mt-cell-swipe
        v-for="(item, index) in objList"
        :key="item.id"
        is-link ref="body"
        @click.stop.native="scavenging(item, '')">
        <span v-show="type" class="icon-copy" @click.stop="scavenging(item,'copy')"></span>
        <div slot="title" class="list-text"><span>面板型号:</span><span>{{item['KL Product Model No Panel']}}</span></div>
        <div slot="title" class="list-text"><span>锁体型号:</span><span>{{item['KL Product Model No Lock Body']}}</span></div>
        <div slot="title" class="list-text">
          <span>产品条形码:</span><span>{{item['Serial Number']}}</span>
        </div>
        <div slot="title" class="list-text"><span></span><span>{{item.Province}}{{item.City}}{{item['Street Address']}}{{item['Street Address 2']}}{{item['Street Address 3']}}{{item['Street Address 4']}}</span></div>
      </mt-cell-swipe>
      <button-group>
        <mt-button class="single"
                   v-show="type"
                   @click.native="scavenging('','')">扫码安装</mt-button>
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
  let userInfo = {};
  const NameSpace = 'sporadic';
  export default {
    name: NameSpace,
    created() {
      var self = this;
      this.id = this.itemTask.Id;
      this.orderID = this.orderId;
      this.getSporadic(this.id);
      KND.Native.getUserInfo((info) => {
        userInfo = info;
        console.log(userInfo);
      });
      if (userInfo['Person UId'] === self.itemTask['Primary Owner Id'] && (self.itemTask['Calculated Activity Status'] === 'In Progress' || self.itemTask['Calculated Activity Status'] === 'Approved' || self.itemTask['Calculated Activity Status'] === 'Declined' || self.itemTask['Calculated Activity Status'] === 'Close Reject')) {
        this.type = true;
      }
    },
    data: () => {
      return {
        type: false, // 是否可以编辑
        topStatus: ''
      };
    },
    computed: {
      ...mapState(NameSpace, ['objList']),
      ...mapState('detail', ['orderId', 'itemTask'])
    },
    methods: {
      ...mapActions(NameSpace, ['getSporadic', 'delete']),
      getSwipeBtn(line, index) {
        return this.type ? [{
          content: '删除',
          style: { background: 'red', color: '#fff', 'font-size': '15px', 'line-height': '54px' },
          handler: () => this.deleteFn(line, index)
        }] : [];
      },
      deleteFn(line, index) {
        var self = this;
        self.delete({
          line: line,
          index: index
        });
      },
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
                  'ProcessName': 'KL Install Task Complete Action Workflow',
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
      scavenging(item, copy) {
        var self = this;
        self.$router.push({
          name: 'scanCode',
          query: {
            type: self.type,
            item: item,
            id: self.id,
            copy: copy,
            orderID: self.orderID
          }
        });
      }
    },
    components: {buttonGroup}
  };
</script>
<style lang="scss">
  .mint-search {
    height: 8vh!important;
  }
  .list-img {
    color: #A2BBFC;
  }
  .icon-copy {
    position: absolute;
    left: 10px;
    font-family: "kinlong-icon" !important;
    font-style: normal;
    font-size: 1rem;
  }
  .list-text {
    line-height: 30px;
    padding-left: 30px;
  }
</style>

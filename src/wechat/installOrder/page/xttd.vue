<template>
  <div>
    <mt-header fixed title="协同团队">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content">
      <mt-cell  v-for="(item, index) in xttdDetailData" :key="index" :title="item['Active Last Name']" v-if="item['SSA Primary Field'] === 'N'">
        <span>{{item['Position Type']}}</span>
      </mt-cell>
      <mt-cell :title="isPrimaryMVGName" v-if="!isUpPrimary">
        <span>{{isPrimaryMVGPosition}}</span>
      </mt-cell>
      <mt-cell :title="isPrimaryMVGName" is-link @click.native="upPerson()" v-if="isUpPrimary">
        <span>{{isPrimaryMVGPosition}}</span>
      </mt-cell>
    </div>
    <button-group v-show="isUpPrimary">
      <mt-button class="single"
                 @click.native="submitFn">确认分配</mt-button>
    </button-group>
  </div>
</template>
<style lang="scss">
</style>
<script type="application/javascript">
  import api from '../api/api';
  import {mapState} from 'vuex';
  import buttonGroup from 'public/components/cus-button-group';
  const NAMESPACE = 'xttd';
  let userInfo = {};
  export default {
    name: NAMESPACE,
    created() {
      let me = this;
      me.userInfo = me.$route.query.userInfo;
      KND.Native.getUserInfo((info) => {
        userInfo = info;
        console.log(userInfo);
      });
      /* if (userInfo['KL Primary Position Type LIC'] === 'Field Service Manager') { // 主管可以修改负责人
        me.isUpPrimary = true;
      }*/
      me.id = me.$route.query.id;
      api.get({
        key: 'getXttd',
        method: 'POST',
        data: {
          'body': {
            'OutputIntObjectName': 'KL Install Order Sales Team',
            'SearchSpec': '[Order Entry - Orders.Id]=' + '\'' + me.id + '\''
          }
        },
        success: function(data) {
          me.xttdDetail = data.SiebelMessage['Order Entry - Orders'];
          me.xttdDetailData = KND.Util.toArray(me.xttdDetail['Position']);
          if (me.select.Id) { // 选择团队选回来的负责人
            me.isPrimaryMVGName = me.select['Last Name']; // 主要负责人名字
            me.isPrimaryMVGPosition = me.select['KL Primary Position Type'];  // 主要负责人职位
          } else {  // 接口数据回来的负责人
            if (me.xttdDetailData.length > 0) {
              for (var i = 0; i < me.xttdDetailData.length; i++) {
                if (me.xttdDetailData[i]['SSA Primary Field'] === 'Y') { // ['SSA Primary Field']==Y 表示责任人
                  me.isPrimaryMVGName = me.xttdDetailData[i]['Active Last Name']; // 主要负责人名字
                  me.isPrimaryMVGPosition = me.xttdDetailData[i]['Position Type'];  // 主要负责人职位
                }
              }
            }
          }
        }
      });
    },
    data: () => {
      return {
        id: '',
        value: '',
        userInfo: '',
        isUpPrimary: false, // 是否有权限修改安装工程师 false==没有
        isPrimaryMVGName: '', // 主要负责人名字
        isPrimaryMVGPosition: '安装工程师',  // 主要负责人职位
        xttdDetail: '',
        xttdDetailData: '',
        active: 'tab-container'
      };
    },
    beforeRouteEnter(to, from, next) {
      console.dir(2);
      next(vm => {
        let query = vm.$route.query;
        console.dir(query);
      });
    },
    computed: {
      ...mapState('engineer', ['select'])
    },
    components: {buttonGroup},
    methods: {
      upPerson() { // 选择安装工程师
        var me = this;
        me.$router.push('engineer');
      },
      submitFn() {
        var self = this;
        if (self.select.Id) { // 是否修改过安装工程师
          var obj = {}; // 取原来负责人
          for (var i = 0; i < self.xttdDetailData.length; i++) {
            if (self.xttdDetailData[i]['SSA Primary Field'] === 'Y') { // ['SSA Primary Field']==Y 表示责任人
              obj.Id = self.xttdDetailData[i].Id;
            }
          }
          var perObj = {};
          perObj.Id = self.select['Primary Position Id']; // 现在负责人ID
          api.get({
            key: 'upPerson',
            method: 'POST',
            data: {
              'body': {
                'ProcessName': 'KL Update Installation Task Owner Workflow',
                'Object Id': self.id,
                'Pre Position Id': obj.Id,
                'New Position Id': perObj.Id
              }
            },
            success: function(data) {
              if (!data.ERROR) {
                Toast('分配成功！');
                KND.Util.back();
              }
            }
          });
        }
      }
    }
  };
</script>

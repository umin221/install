<template>
  <div>
    <mt-header fixed title="协同团队">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content">
      <mt-cell  v-for="(item, index) in xttdDetailData" :key="index" :title="item['Active Last Name']" v-if="item['SSA Primary Field'] === 'N'">
        <span>{{item['Position Type']}}</span>
      </mt-cell>
      <mt-cell :title="isPrimaryMVGName" is-link @click.native="upPerson()">
        <span>{{isPrimaryMVGPosition}}</span>
      </mt-cell>
    </div>
    <button-group>
      <mt-button type="primary" class="single"
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
  const NAMESPACE = 'engineer';
  export default {
    name: NAMESPACE,
    created() {
      let me = this;
      me.userInfo = me.$route.query.userInfo;
      if (this.select.Id) { // 选择团队选回来的负责人
        this.isPrimaryMVGName = this.select['Last Name']; // 主要负责人名字
        this.isPrimaryMVGPosition = this.select['KL Primary Position Type'];  // 主要负责人职位
      } else {  // 接口数据回来的负责人
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
            console.dir(data);
            console.dir(data.SiebelMessage);
            me.xttdDetail = data.SiebelMessage['Order Entry - Orders'];
            me.xttdDetailData = KND.Util.toArray(me.xttdDetail['Position']);
            console.dir('=====');
            console.dir(me.taskData);
            if (me.xttdDetailData.length > 0) {
              for (var i = 0; i < me.xttdDetailData.length; i++) {
                if (me.xttdDetailData[i]['SSA Primary Field'] === 'Y') { // ['SSA Primary Field']==Y 表示责任人
                  me.isPrimaryMVGName = me.xttdDetailData[i]['Active Last Name']; // 主要负责人名字
                  me.isPrimaryMVGPosition = me.xttdDetailData[i]['Position Type'];  // 主要负责人职位
                }
              }
            }
          }
        });
      }
    },
    data: () => {
      return {
        id: '',
        value: '',
        userInfo: '',
        isPrimaryMVGName: 'XXX', // 主要负责人名字
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
      ...mapState(NAMESPACE, ['select'])
    },
    components: {buttonGroup},
    methods: {
      upPerson() { // 选择安装工程师
        var me = this;
        if (me.userInfo['KL Primary Position Type LIC'] === 'Field Service Manager') { // 安装主管才能修改安装工程师
          this.$router.push('engineer');
        }
      },
      submitFn() {
        var self = this;
        if (self.select.Id) { // 是否修改过安装工程师
          var list = []; // 构造数据  后台需要把所有人员传后台而不是只传修改的那个人ID
          for (var i = 0; i < self.xttdDetailData.length; i++) {
            if (self.xttdDetailData[i]['SSA Primary Field'] === 'N') { // ['SSA Primary Field']==Y 表示责任人
              var obj = {};
              obj.Id = self.xttdDetailData[i].Id;
              list.push(obj);
            }
          }
          var perObj = {};
          perObj.Id = self.select['Primary Position Id']; // 取职位ID
          list.push(perObj);
          api.get({
            key: 'upPerson',
            method: 'POST',
            data: {
              'Id': self.id,
              'personList': list
            },
            success: function(data) {
            }
          });
        }
      }
    }
  };
</script>

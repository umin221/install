<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content journal">
      <div class="crm-zyList" v-for="(item, index) in processDate" :key="index">
        <ul class="content">
          <li class="bd-radius">
            <span class="icon"></span>
          </li>
          <li style="color: #888;line-height: 40px;font-size: 0.9rem;">{{new Date(item['Install Date']).format('yyyy-MM-dd')}}
            <span class="journalName">{{item['Contact Login Name']}}</span>
          </li>
          <div class="content-div">
            <span class="content-div-span" @click="addJounal(item)" v-show="journalVal">抽样</span>
            <div>安装人员：<span style="color: #0772c1">{{item['Contact Login Name']}}</span></div>
            <div>完成数量：<span style="color: #0772c1">{{item['Completed Install Amount']}}</span></div>
            <div>合格数量/异常数量：{{item['Qualified Amount']}}/{{item['Unqualified Amount']}}</div>
            <div>异常处理数量：{{item['Unqualified Solve Amount']}}</div>
            <div>异常描述：{{item['Unqualified Desc']}}</div>
            <div>异常跟进描述：{{item['Unqualified Solve Desc']}}</div>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  .journal {
    background: white;
    /*流程*/
    .crm-zyList {
      overflow: hidden;
    }
    .crm-zyList ul {
      padding-left: 0;
    }
    .crm-zyList ul li {
      list-style: none;
    }
    .crm-zyList .content {
      position: relative;
      border-left: 1px solid #dddddd;
      padding-bottom: 10px;
      margin: 0 30px;
      padding-left: 20px;
    }
    .crm-zyList .journalName {
      position: absolute;
      right: 0px;
    }
    .crm-zyList .content .bd-radius {
      background: #fff;
      position: absolute;
      left: -20px;
      top: 0px;
    }
    .crm-zyList .icon{
      border-radius: 26px;
      background: #8bc17c;
      color: #fff;
      padding: 1px 7px;
      margin-left: 13px;
      font-size: 12px;
      top: 10px;
    }
    .crm-zyList .content {
      margin-top: 5px;
      line-height: 27px;
    }
    .content-div {
      border-radius: 5px;
      padding-left: 10px;
      font-size: 0.7rem;
    }
    .content-div-span {
      position: absolute;
      right: 10px;
      color: #0772c1;
    }
  }
</style>
<script type="application/javascript">
  import api from '../api/api';
  import {mapState} from 'vuex';
  const NameSpace = 'journalLIS';
  let right = [{
    content: '删除',
    style: { background: 'red', color: '#fff', 'font-size': '15px', 'line-height': '54px' },
    handler: () => this.$messagebox('delete')
  }];
  export default {
    name: NameSpace,
    created() {
      var self = this;
      self.titleVal = '日志';
      let param = this.$route.query;
      this.id = this.itemTask.Id;
      this.type = param.type;
      if (this.type) {
        this.journalVal = true;
      } else {
        this.journalVal = false;
      }
      this.getJournal();
    },
    data: () => {
      return {
        value: '',
        journalVal: true, // journalVal==true 显示updateDoor的日志  ，否则显示updateDoorNext的日志
        processDate: [],
        titleVal: '日志',
        attach: { // 附件
          list: [],
          edit: false,
          title: '附件'
        }
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
      ...mapState('detail', ['itemTask']),
      // 表单只读
      read() {
        return this.type === 'read';
      },
      right() {
        return this.state === 'valid' ? right : [];
      },
      // * 是否显示
      heartVisible() {
        return this.type === 'read' ? '' : 'require';
      },
      /**
       * 根据当前状态和类型判断标题展示
       * 新建&重新启用界面复用 仅标题不一样
       * 查看&编辑标题一致
       */
      title() {
      }
    },
    methods: {
      getJournal() {
        var self = this;
        api.get({ // 获取日志
          key: 'getJournal',
          method: 'POST',
          data: {
            'body': {
              'OutputIntObjectName': 'Base KL Installation Detail',
              'SortSpec': 'Created (DESCENDING)',
              'PageSize': '100',
              'SearchSpec': '[KL Installation Detail.Activity Id]=' + '"' + self.id + '"'
            }
          },
          success: function(data) {
            self.processDate = KND.Util.toArray(data.SiebelMessage['KL Installation Detail']);
            console.dir(self.processDate);
          }
        });
      },
      addJounal(item) {
        var self = this;
        self.$router.push({
          name: 'updateLIS',
          query: {
            type: 'add',
            amount: item['Completed Install Amount'],
            anName: item['Contact Login Name'],
            id: item.Id
          }
        });
      }
    }
  };
</script>

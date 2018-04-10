<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content journal">
      <div class="crm-zyList" v-for="(item, index) in processDate" :key="index" v-show="journalVal">
        <ul class="content">
          <li class="bd-radius">
            <span class="icon"></span>
          </li>
          <li style="color: #888;line-height: 40px;font-size: 0.9rem;">{{new Date(item['Install Date']).format('yyyy-MM-dd')}}
            <span class="journalName">{{item['Contact Login Name']}}</span>
          </li>
          <div class="content-div">
            <div>已开孔数量：<span style="color: #0772c1">{{item['Completed Install Amount']}}</span></div>
            <div>合格数量/异常数量：{{item['Qualified Amount']}}/{{item['Unqualified Amount']}}</div>
            <div>异常处理数量：{{item['Unqualified Solve Amount']}}</div>
            <div>异常描述：{{item['Unqualified Desc']}}</div>
            <div>异常跟进描述：{{item['Unqualified Solve Desc']}}</div>
          </div>
        </ul>
      </div>
      <div class="crm-zyList" v-for="(item, index) in processDate" :key="index" v-show="!journalVal">
        <ul class="content">
          <li class="bd-radius">
            <span class="icon"></span>
          </li>
          <li style="color: #888;line-height: 40px;font-size: 0.9rem;">{{new Date(item['Install Date']).format('yyyy-MM-dd')}}
            <span class="journalName">{{item['Contact Login Name']}}</span>
          </li>
          <div class="content-div">
            <div>已全检数量：<span style="color: #0772c1">{{item['Completed Install Amount']}}</span></div>
            <div>备注说明：{{item['Unqualified Solve Desc']}}</div>
          </div>
          <attach :attach="attach.list"
                  :edit="read"
                  :title="title">
          </attach>
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
  }
</style>
<script type="application/javascript">
  import api from '../api/api';
  import {mapState} from 'vuex';
  const NameSpace = 'journal';
  let right = [{
    content: '删除',
    style: { background: 'red', color: '#fff', 'font-size': '15px', 'line-height': '54px' },
    handler: () => this.$messagebox('delete')
  }];
  export default {
    name: 'journal',
    created() {
      var self = this;
      self.titleVal = '日志';
      let param = this.$route.query;
      this.id = param.id;
      this.type = param.type;
      if (this.type === 'updateDoorNext') {
        this.journalVal = false;
      } else {
        this.journalVal = true;
      }
      this.getJournal();
    },
    data: () => {
      return {
        value: '',
        journalVal: true, // journalVal==true 显示updateDoor的日志  ，否则显示updateDoorNext的日志
        processDate: [],
        titleVal: '日志'
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
      ...mapState(NameSpace, ['form', 'attach']),
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
        api.get({ // 提交数据
          key: 'getJournalData',
          data: {
            id: self.id
          },
          success: function(data) {
            if (data.items) {
              self.processDate = KND.Util.toArray(data.items);
            } else {
              self.processDate = KND.Util.toArray(data); // 一条数据时只返回对象
            }
          }
        });
      }
    }
  };
</script>

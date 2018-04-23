<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content journal editable">
      <div class="lock-line" :class="{'disable': !editable}">
        <div class="crm-zyList" v-for="(itemTask, index) in clockDate" :key="index">
          <ul class="content">
            <li class="bd-radius">
              <span class="icon"></span>
            </li>
            <li style="color: #888;line-height: 40px;font-size: 0.8rem;">{{itemTask.Time}}
              <span class="journalName">{{new Date(itemTask['End Working Time']).format('yyyy-MM-dd')}}</span>
            </li>
            <div class="content-div">
              <div>{{itemTask['Employee Full Name']}}</div>
            </div>
            <div class="content-div">
              <div>{{itemTask['Address']}}</div>
            </div>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  .journal {
    background: white;
    .lock-line {
      margin-top: 10px;

      .lock-line-cell {
        background-color: $bg-light;
      }
      .co-flex {
        line-height: 30px;
      }
    }
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
      font-size: 0.7rem;
    }
  }
</style>
<script type="application/javascript">
  import api from '../api/api';
  import lockLine from '../components/cusLockLine';
  export default {
    name: 'clock',
    created() {
      var self = this;
      self.titleVal = '打卡记录';
      let param = this.$route.query;
      this.id = param.id;
      this.getClock();
    },
    data: () => {
      return {
        value: '',
        clockDate: [],
        editable: false,
        titleVal: ''
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
    },
    components: {lockLine},
    methods: {
      getClock() {
        var self = this;
        /* api.get({ // 提交数据
          key: 'getClock',
          method: 'GET',
          data: {
            id: self.id
          },
          success: function(data) {
            if (data.items) {
              self.clockDate = KND.Util.toArray(data.items);
            }
          }
        });*/
        api.get({ // 获取日志
          key: 'getJournal',
          method: 'POST',
          data: {
            'body': {
              'OutputIntObjectName': 'Base KL Order Employee Clock',
              'SortSpec': 'Created (DESCENDING)',
              'PageSize': '100',
              'SearchSpec': '[KL Order Employee Clock.Parent Row Id]=' + '"' + self.id + '"'
            }
          },
          success: function(data) {
            self.clockDate = KND.Util.toArray(data.SiebelMessage['KL Order Employee Clock']);
            console.dir(self.clockDate);
          }
        });
      }
    }
  };
</script>

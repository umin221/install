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
          <li style="margin-right: 8px">{{item.option}}</li>
          <div class="content-div">
            <div>111</div>
            <div>222</div>
            <div>333</div>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  .journal {
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
    .crm-zyList .content :nth-of-type(2) {
      font-size: 14px;
      margin-top: 5px;
      color: #999;
      line-height: 27px;
    }
    .content-div {
      border-radius: 5px;
      padding: 10px;
      font-size: 0.15rem;
    }
  }
</style>
<script type="application/javascript">
  export default {
    name: 'detail',
    created: () => {
      console.dir(1);
      var self = this;
      self.titleVal = '日志';
    },
    data: () => {
      return {
        value: '',
        titleVal: '日志',
        processDate: [{
          option: '开孔锁签收'
        }, {
          option: '图纸签收'
        }, {
          option: '开孔批次'
        }, {
          option: '门厂发运'
        }, {
          option: '挂门验收'
        }]
      };
    },
    beforeRouteEnter(to, from, next) {
      console.dir(2);
      next(vm => {
        let query = vm.$route.query;
        console.dir(query);
      });
    }
  };
</script>

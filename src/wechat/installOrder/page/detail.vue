<template>
  <div>
    <mt-header fixed title="安装订单详情">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content mint-content-datail">
        <div class="readonly">
          <mt-field label="订单编码" :value="detailData['Order Number']"></mt-field>
          <mt-field label="项目名称" :value="detailData['KL Agreement Opportunity Name']"></mt-field>
          <mt-field label="销售类型" :value="detailData['KL Delivery Sales Type']"></mt-field>
          <mt-field label="安装数量" :value="detailData['KL Install Amount'] || 0"></mt-field>
          <div slot="title" class="mint-content-div"><div class="mint-content-xt" @click="butXttd">协同团队</div></div>
      </div>
      <toggle>
        <div style="height: 0.5rem;background: #eaeaea;"></div>
        <div class="mint-content-info">
          <mt-cell>
            <div slot="title" class="list-text"><span class="list-text-span">锁芯部分</span></div>
          </mt-cell>
          <div class="mint-sx-div">
            <mt-cell   @click.native="getLock(item.Id, item['KL Product Type'], item)" is-link v-for="item in taskDataST" :key="item.id" v-if="item['KL Product Type']=='锁芯'"  :title="item['KL Product Series Code']">
              <span style="width: 120px">开向：{{item['KL Hole Direction']}}</span>
              <span>数量：{{item['Quantity Requested']}}</span>
            </mt-cell>
          </div>
          <mt-cell>
            <div slot="title" class="list-text"><span class="list-text-span">锁体部分* 真锁</span></div>
          </mt-cell>
          <div class="mint-sx-div">
            <mt-cell  @click.native="getLock(item.Id, item['KL Product Type'], item)" is-link v-for="item in taskDataST" :key="item.id" v-if="item['KL Product Type']=='锁体'"  :title="item['KL Product Series Code']">
              <span style="width: 120px">开向：{{item['KL Hole Direction']}}</span>
              <span>数量：{{item['Quantity Requested']}}</span>
            </mt-cell>
          </div>
        </div>
      </toggle>
      <div style="height: 0.5rem;background: #eaeaea;"></div>
      <div class="content-lc" style="margin-top: 15px">
        <div class="stage_li">
          <div  class="mui-scroll-wrapper mui-segmented-control" style="height: 72px;">
            <div class="mui-scroll" style="height: 65px;overflow: -webkit-paged-x;">
              <a v-for="(item, index) in taskData"  :key="index">
                <div class="icon" @click="updateState(item.Status, item.Id, index)">
                  <span v-show="index!=0"  class="left line l_grey"></span>
                  <span class="point mui-icon"><span></span></span>
                  <span  class="right line l_grey"></span>
<!--
                  <span v-if="item.length!= index" class="right mui-icon l_grey"></span>
-->
                </div>
                <div class="name present" @click="updateTask(index)">{{item['KL Detail Type']}}</div>
              </a>
              <!--<a>
                <div class="icon">

                  <span class="point mui-icon"><span></span></span>
                  <span class="right line l_grey"></span>
                </div>
                <div class="name present">2222
                </div>
              </a><a>
              <div class="icon">
                <span class="left line l_grey"></span>
                <span class="point mui-icon p_grey"><span></span></span>
                <span class="right line l_grey"></span>
              </div>
              <div class="name grey">
                投标阶段
              </div>
            </a>
              <a>
              <div class="icon">
                <span class="left line l_grey"></span>
                <span class="point mui-icon close"><span></span></span>
                <span class="right line l_grey"></span>
              </div>
              <div class="name grey">
                投标阶段
              </div>
            </a>
              <a>
              <div class="icon">
                <span class="left line l_grey"></span>
                <span class="point mui-icon p_grey"><span></span></span>

              </div>
              <div class="name grey">
                商务谈判
              </div>
            </a>-->
            </div>
          </div>
        </div>
      </div>
      <div class="mint-content-info">
        <div class="crm-zyList" v-for="(item, index) in taskDataList" :key="index">
          <ul class="content" @click.nataive="routerPage(index, item, '')">
            <li class="bd-radius">
              <span class="icon"></span>
            </li>
            <li style="margin-right: 8px">{{item['KL Detail Type']}}</li>
            <div class="content-div"  v-if="index===2"  @click.nataive="sporadic(index)">
              <!--v-for="(itemTask, index) in item['KL Installation Task']" :key="index"-->
                <div>批次</div>
                <div>已开孔/开孔批次</div>
                <div>时间</div>
            </div>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  .mint-content-datail {
    /*.mint-cell-wrapper {
      font-size: 0.7rem!important;
    }*/
    background: white;
    .mint-cell-title {
    }
    .list-text-span {
      color: #a9acb1;
      margin-right: 0.5rem;
    }
    .mint-content-xl {
      text-align: center;
      color: #0772c1;
      font-size: 0.15rem;
    }
    .xl::before {
      font-family: "mintui";
      content: '\E601';
      font-size: 1rem;
    }
    .mint-content-div{
      width: 98%;
      height: 30px;
      margin-top: 5px;
      text-align: right;
    }
    .mint-content-xt {
      border: 1px solid #cccccc;
      padding: 0.45rem 0.5rem;
      width: 3rem;
      display: initial;
      text-align: center;
      border-radius: 0.25rem;
      color: #0772c1;
      font-size: 0.15rem;
    }
    .mint-sx-div {
      margin-left: 0.5rem;
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
      border: 1px solid #81B92C;
      border-radius: 5px;
      padding: 10px;
      font-size: 0.5rem;
    }
    /*横线滚动*/
    .stage_li {
      width: 100%;
      position: relative;
    }

    .stage_li > p.title {
      margin: 0;
      padding: 16px 0 17px 15px;
      color: #333;
      font-size: 15px;
      line-height: 15px;
    }

    .stage_li > span.bu_stage {
      position: absolute;
      top: 10px;
      right: 10px;
      color: #d61518;
      font-size: 14px;
      padding-right: 15px;
    }

    .stage_li > span.bu_stage > span {
      font-size: 12px;
      line-height: 20px;
      position: absolute;
      right: 0;
    }

    .stage_li > .mui-scroll-wrapper a {
      display: inline-block !important;
      margin: 0 !important;
      height: 50px;
      width: 74px;
    }

    .stage_li > .mui-scroll-wrapper a > div {
      text-align: center;
    }

    .stage_li > .mui-scroll-wrapper a > div.date {
      font-size: 10px;
      color: #777;
      line-height: 10px;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon {
      height: 28px;
      padding: 7px 0;
      position: relative;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.point {
      width: 14px;
      height: 14px;
      background: #8bc17c;
      border-radius: 7px;
      -webkit-border-radius: 7px;
      -moz-border-radius: 7px;
      font-size: 8px;
      position: absolute;
      left: 30px;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.point > span {
      position: absolute;
      width: 12px;
      height: 12px;
      background: #8bc17c;
      border-radius: 6px;
      -webkit-border-radius: 6px;
      -moz-border-radius: 6px;
      top: 1px;
      left: 1px;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.close {
      background: #d61518 !important;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.close > span {
      background: #fff;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.close > span:before {
      color: #d61518;
      position: absolute;
      top: 2px;
      left: 2px;
      font-size: 8px;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.finish > span:before {
      content: "\A131";
      color: #8bc17c;
      position: absolute;
      top: 2px;
      left: 1px;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.present {
      background: #8bc17c;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.present > span {
      background: #fff;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.p_grey {
      background: #efefef;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.p_grey > span {
      background: #efefef;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.l_grey {
      background: #efefef !important;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.line {
      position: absolute;
      width: 30px;
      height: 2px;
      display: inline-block;
      background: #8bc17c;
      top: 13px;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.left {
      left: 0;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.right {
      right: 0;
    }

    .stage_li > .mui-scroll-wrapper a > div.name {
      font-size: 12px;
      color: #333;
      line-height: 12px;
    }

    .stage_li > .mui-scroll-wrapper a > div.present {
      color: #8bc17c;
      margin: 0px 6px 0px 6px;
      padding-bottom: 10px;
      border-bottom: 1px solid #0772c1;
    }

    .stage_li > .mui-scroll-wrapper a > div.close {
      color: #d61518;
    }

    .stage_li > .mui-scroll-wrapper a > div.grey {
      color: #cccccc;
    }
  }
</style>
<script type="application/javascript">
  import api from '../api/api';
  import { MessageBox, Toast } from 'mint-ui';
  import toggle from 'public/components/cus-toggle';
  export default {
    name: 'detail',
    components: {toggle},
    created() {
      let me = this;
      me.id = me.$route.query.id;
      api.get({
        key: 'getDetail',
        method: 'POST',
        data: {
          'body': {
            'OutputIntObjectName': 'Base Order Entry (Sales)',
            'SearchSpec': '[Order Entry - Orders.Id]=' + '\'' + me.id + '\''
            // 'SearchSpec': '[Order Entry - Orders.Id]="1-2BSATYIN"'
          }
        },
        success: function(data) {
          console.dir(data.SiebelMessage);
          me.detailData = data.SiebelMessage['Order Entry - Orders'];
          me.taskData = KND.Util.toArray(me.detailData['KL Installation Task']);
          console.dir('=====');
          console.dir(me.taskData);
          me.taskDataList = KND.Util.toArray(me.taskData[0]['KL Installation Task']);
          me.taskDataST = KND.Util.toArray(me.detailData['Order Entry - Line Items']);
          console.dir(me.taskDataST);
        }
      });
    },
    data: () => {
      return {
        type: 'read', // add 新增 / edit 编辑 / read 只读
        id: '',
        detailData: '', // 详情整体数据
        taskData: '', // 任务集
        taskDataList: '', // 任务集子任务
        taskDataST: '', // 锁芯锁体
        // is_show_sx: false, // 是否显示锁芯锁体
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
    methods: {
      updateTask(index) { // 点击任务切换子任务
        let me = this;
        me.taskDataList = KND.Util.toArray(me.taskData[index]['KL Installation Task']);
        console.dir(me.taskDataList);
      },
      /* is_show_fun() { // 是否显示锁体锁芯
        var self = this;
        if (self.is_show_sx) {
          self.is_show_sx = false;
        } else {
          self.is_show_sx = true;
        }
      },*/
      getLock(id, type, item) { // 锁芯锁体详情事件
        // 跳转锁芯锁体详情
        this.$router.push({
          name: 'lock',
          query: {
            id: id,
            type: type,
            item: item
          }
        });
      },
      butXttd() { // 跳转协同团队
        let me = this;
        this.$router.push({
          name: 'xttd',
          query: {
            id: me.id
          }
        });
      },
      updateState(status, id, index) { // 任务事件 ；1.还没开始先开始 ； 2.已开始就跳转关闭页面
        var self = this;
        if (status === '未开始') {
        // if (index === 0) {
          console.dir('===');
          MessageBox({
            title: '提示',
            message: ' 确认开始进行?',
            showCancelButton: true
          }).then(action => {
            if (action === 'confirm') {
              console.log('abc');
              api.get({
                key: 'getTaskAdd',
                method: 'POST',
                data: {
                  'body': {
                    'ProcessName': 'KL Install Task Start Action Workflow',
                    'RowId': id
                  }

                },
                success: function(data) {
                  Toast({
                    message: '已发起安装替代锁申请，销售审批通过后进行安装。',
                    duration: 5000
                  });
                }
              });
            }
          });
        } else {
          self.$router.push('updateState');
          // 跳转关闭页面更新状态
          this.$router.push({
            name: 'updateState',
            query: {
              id: id
            }
          });
        }
      },
      routerPage(index, item, state) { // 子任务事件
        // var self = this;
        if (index === 0) {
          if (index === 0) {
            // 新曾
            this.$router.push({
              name: 'sign',
              query: {
                type: 'read',
                state: state,
                item: item
              }
            });
          } else {
            // 跳转详情
            this.$router.push({
              name: 'sign',
              query: {
                item: item
              }
            });

          }
        } else if (index === 2) {
         // self.$router.push('batch');
          // 跳转详情
          this.$router.push({
            name: 'batch',
            query: {
              item: item
            }
          });
        } else if (index === 4) {
          // 详情
          if (index === 4) {
            this.$router.push({
              name: 'updateDoor',
              query: {
                item: item
              }
            });
          } else { // 新曾
            this.$router.push({
              name: 'updateDoor',
              query: {
                type: 'read',
                state: state,
                item: item
              }
            });
          }
        }
      },
      sporadic(index) { // 子任务数据集事件
        var self = this;
        if (index === 0) {
        } else {
          self.$router.push('sporadic');
        }
      }
    }
  };
</script>

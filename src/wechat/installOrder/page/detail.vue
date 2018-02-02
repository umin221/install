<template>
  <div>
    <mt-header fixed title="安装订单详情">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content mint-content-datail">
      <div class="mint-content-info">
        <mt-cell>
          <div slot="title" class="list-text"><span class="list-text-span">订单编码</span><span>AZ11111000</span></div>
          <div slot="title" class="list-text"><span class="list-text-span">项目名称</span><span>西南药都生态城-龙泉花园</span></div>
          <div slot="title" class="list-text"><span class="list-text-span">销售类型</span><span>工程</span></div>
          <div slot="title" class="list-text"><span class="list-text-span">安装数量</span><span>500</span></div>
          <div slot="title" class="mint-content-div"><div class="mint-content-xt" @click="butXttd">协同团队</div></div>
          <div slot="title" class="mint-content-xl" @click="is_show_fun">收起</div>
          <div slot="title" class="mint-content-xl xl" @click="is_show_fun"></div>
        </mt-cell>
      </div>
      <div style="height: 0.5rem;background: #eaeaea;" v-show="is_show_sx"></div>
      <div class="mint-content-info" v-show="is_show_sx">
        <mt-cell>
        <div slot="title" class="list-text"><span class="list-text-span">锁芯部分</span></div>
      </mt-cell>
        <div class="mint-sx-div">
          <mt-cell title="SZ6010指纹锁"  @click.native="getList" is-link>
            <span style="width: 120px">开向：左内开</span>
            <span>数量：200</span>
          </mt-cell>
          <mt-cell title="SZ6011指纹锁"  @click.native="getList" is-link>
            <span style="width: 120px">开向：左内开</span>
            <span>数量：100</span>
          </mt-cell>
        </div>
        <mt-cell>
          <div slot="title" class="list-text"><span class="list-text-span">锁体部分* 真锁</span></div>
        </mt-cell>
        <div class="mint-sx-div">
          <mt-cell title="SZ6010指纹锁"  @click.native="" is-link>
            <span style="width: 120px">开向：左内开</span>
            <span>数量：200</span>
          </mt-cell>
        </div>
      </div>
      <div style="height: 0.5rem;background: #eaeaea;"></div>
      <div class="content-lc">
        <div class="stage_li">
          <div  class="mui-scroll-wrapper mui-segmented-control" style="height: 72px;">
            <div class="mui-scroll" style="height: 65px;overflow: -webkit-paged-x;">
              <a>
                <div class="icon">

                  <span class="point mui-icon"><span></span></span>
                  <span class="right line l_grey"></span>
                </div>
                <div class="name present">
                  商机确认
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
            </a><a>
              <div class="icon">
                <span class="left line l_grey"></span>
                <span class="point mui-icon p_grey"><span></span></span>
                <span class="right line l_grey"></span>
              </div>
              <div class="name grey">
                投标阶段
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
            </a><a>
              <div class="icon">
                <span class="left line l_grey"></span>
                <span class="point mui-icon p_grey"><span></span></span>
                <span class="right line l_grey"></span>
              </div>
              <div class="name grey">
                需求调研
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
            </a>
            </div>
          </div>
        </div>
      </div>
      <div class="mint-content-info" @click.nataive="updateState">
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
  </div>
</template>
<style lang="scss">
  .mint-content-datail {
    .mint-cell-title {
    }
    .list-text-span {
      color: #a9acb1;
      margin-right: 0.5rem;
    }
    .mint-content-xl {
      text-align: center;
      color: #A2BBFC;
      font-size: 0.15rem;
    }
    .xl::before {
      font-family: "mintui";
      content: '\E601';
      font-size: 1rem;
    }
    .mint-content-div{
      width: 100%;
      height: 30px;
      text-align: right;
    }
    .mint-content-xt {
      border: 1px solid #cccccc;
      padding: 0.45rem 0.5rem;
      width: 3rem;
      display: initial;
      text-align: center;
      border-radius: 0.25rem;
      color: #A2BBFC;
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
      padding-bottom: 40px;
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
      background: #2485E2;
      color: #fff;
      padding: 3px 9px;
      margin-left: 11px;
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
      border: 1px solid red;
      border-radius: 5px;
      padding: 10px;
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
      content: "\A148";
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
  export default {
    name: 'detail',
    created: () => {
      console.dir(1);
    },
    data: () => {
      return {
        value: '',
        is_show_sx: false,
        active: 'tab-container',
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
    },
    methods: {
      is_show_fun() {
        var self = this;
        if (self.is_show_sx) {
          self.is_show_sx = false;
        } else {
          self.is_show_sx = true;
        }
      },
      butXttd() {
        var self = this;
        self.$router.push('xttd');
      },
      updateState() {
        var self = this;
        self.$router.push('updateState');
      }
    }
  };
</script>

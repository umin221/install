<template>
  <div class="service-continer">
    <div class="mint-content service-detail">
      <div class="detail-title">
        <div class="mt-Detail-title">服务单编号：ST201706060001<span class="user-state">已接单</span></div>
        <div class="mt-Detail-title">维修工程师：刘伟江</div>
        <div class="mt-Detail-title">联系电话：<a href="javascript:void(0);" class="detail-call">13999998888</a></div>
      </div>
      <div class="detail-content">
        <mt-navbar v-model="active">
          <mt-tab-item v-for="tab in tabList" :id="tab.id" :key="tab.id">{{tab.name}}</mt-tab-item>
        </mt-navbar>
        <mt-tab-container v-model="active">
          <mt-tab-container-item id="tab-container1">
            <div class="mt-Detail-info">
              <div>产品条形码：<a href="javascript:void(0);" class="detail-call"></a></div>
              <div>产品型号：</div>
              <div>申请时间：</div>
              <div>客户预约时间：</div>
              <div>实际预约时间：</div>
              <div>地址：</div>
              <div>用户故障说明：</div>
              <div>问题说明：
                <div></div>
              </div>
              <div>相关照片：</div>
            </div>
          </mt-tab-container-item>
          <mt-tab-container-item id="tab-container2">
            <div class="crm-zyList" >
              <ul class="content">
                <li class="bd-radius">
                  <span class="icon"></span>
                </li>
                <li style="margin-right: 8px"></li>
                <div class="content-div">
                  <div>暂无数据</div>
                </div>
              </ul>
            </div>
          </mt-tab-container-item>
        </mt-tab-container>
      </div>
    </div>
    <button-group>
      <mt-button class="single" @click.native="toComment">点评</mt-button>
    </button-group>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex';
  import toggle from '../components/detail-toggle';
  //
  const NameSpace = 'detail';
  //
  export default {
    name: NameSpace,
    created() {
    },
    data: () => {
      return {
        active: 'tab-container1'
      };
    },
    computed: {
      ...mapState(NameSpace, ['tabList'])
    },
    methods: {
      ...mapActions(NameSpace, ['']),
      toComment() {
        this.$router.push('commentOn');
      }
    },
    components: {toggle}
  };
</script>
<style lang="scss">
  @mixin remove-decoration (){
    text-decoration: none;
    color: lightblue;
  }
  .service-continer {
    position: relative;
    height: 100%;
    .service-detail {
      height: 84%;
      .detail-title {
        position: relative;
        padding: 0.5rem;
        font-size: $font-size-default;
        background: white;
        .mt-Detail-title {
          line-height: 1.5rem;
          .user-state {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            color: red;
          }
          .detail-call {
            @include remove-decoration();
          }
        }
      }
      .detail-content {
        position: relative;
        margin-top: 0.5rem;
        font-size: $font-size-default;
        height: 100%;
        background-color: #ffffff;
        overflow: auto;
        .mint-tab-container {
          .mint-tab-container-wrap {
            .mint-tab-container-item {
              padding: 0.5rem;
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
                top: 0;
              }
              .crm-zyList .icon {
                border-radius: 26px;
                background: #2485E2;
                color: #fff;
                padding: 1px 9px;
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
                border-radius: 5px;
                padding: 10px;
                font-size: 0.15rem;
              }
              .mt-Detail-info {
                div {
                  line-height: 1.5rem;
                  .detail-call {
                    @include remove-decoration();
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>

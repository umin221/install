<template>
  <div>
    <div class="continer">
      <mt-header fixed :title="headTitle">
        <fallback slot="left"></fallback>
      </mt-header>
      <div class="mint-content service-detail">
        <div class="detail-title">
          <div class="mt-Detail-title">产品编号：ST101721213<span class="user-state">用户已提交</span></div>
          <div class="mt-Detail-title">产品类型：指纹锁</div>
          <div class="mt-Detail-title">联系人：李先生</div>
          <div class="mt-Detail-title">联系电话：<a href="javascript:void(0);" class="detail-call">13823456789</a></div>
        </div>
        <div class="detail-content">
          <mt-navbar v-model="active">
            <mt-tab-item v-for="tab in tabList" :id="tab.id" :key="tab.id">{{tab.name}}</mt-tab-item>
          </mt-navbar>
          <mt-tab-container v-model="active">
            <mt-tab-container-item id="tab-container1">
              <div class="mt-Detail-info">
                <div>产品条形码：<a href="javascript:void(0);" class="detail-call">ST101721213</a></div>
                <div>产品型号：指纹锁</div>
                <div>申请时间：2017-06-06</div>
                <div>客户预约时间：2017-06-06 14:00:00</div>
                <div>实际预约时间：2017-06-06 14:00:00</div>
                <div>地址：广东省 深圳市 南山区 xxx</div>
                <div>问题说明：
                  <div>门锁打不开</div>
                </div>
                <div>相关照片：
                  <div><img src="" alt="" height="100"></div>
                </div>
              </div>
            </mt-tab-container-item>
            <mt-tab-container-item id="tab-container2">
              <div class="service-record">
                暂无数据
              </div>
            </mt-tab-container-item>
            <mt-tab-container-item id="tab-container3">
              <mt-cell v-for="n in 6" :title="'选项 ' + n" />
            </mt-tab-container-item>
          </mt-tab-container>
        </div>
      </div>
      <div class="submitButton">
        <router-link  to="dateControl" slot="right">
          <mt-button size="normal" type="danger" >派单</mt-button>
        </router-link>
      </div>
      <!--<datecontrol :Visible="popupVisible" ></datecontrol>-->
    </div>
  </div>
</template>
<style lang="scss">
  @mixin disFlex (){
    display: flex;
    justify-content:center;
    align-items: center;
  }
  @mixin remove-decoration (){
    text-decoration: none;
    color: lightblue;
  }
  .continer{
    position: relative;
    height:100%;
    .service-detail{
      background: #F2F2F2;
      .detail-title{
        position: relative;
        padding: 0.5rem;
        height: 6rem;
        font-size: 0.7rem;
        background: white;
        .mt-Detail-title{
          line-height: 1.5rem;
          .user-state{
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            color: red;
          }
          .detail-call{
            @include remove-decoration();
          }
        }
      }
      .detail-content{
        position: relative;
        margin-top: 0.5rem;
        font-size: 0.7rem;
        .mint-tab-container{
          .mint-tab-container-wrap{
            .mint-tab-container-item{
              background: white;
              padding: 0.5rem;

              .mt-Detail-info{
                div{
                  line-height: 1.5rem;
                  .detail-call{
                    @include remove-decoration();
                  }
                }
              }
              .service-record{
                height: 5rem;
                line-height: 5rem;
                text-align: center;
              }
            }
          }
        }
      }
    }
    /*底部按钮*/
    .submitButton {
      @include disFlex();
      position: absolute;
      bottom: 1rem;
      width: 100%;
      button {
        width: 200px;
        border-radius: 1rem;
      }
    }
  }


</style>
<script>
  import datecontrol from 'public/components/cus-datecontrol';
  export default {
    name: 'serviceDetail',
    data: () => {
      return {
        active: 'tab-container1',
        headTitle: '维修工单详情',
        popupVisible: false,
        tabList: [
          {name: '基础信息', id: 'tab-container1'},
          {name: '维修记录', id: 'tab-container2'},
          {name: '流程记录', id: 'tab-container3'}
        ]
      };
    },
    methods: {
      clickShow() {
        console.log(this.popupVisible);
        this.popupVisible = true;
      }
    },
    components: {
      datecontrol
    }
  };
</script>

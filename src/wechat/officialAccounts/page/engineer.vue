<template>
  <div class="service-continer">
    <div class="mint-content service-detail">
      <div class="detail-title">
        <div class="mt-Detail-title">服务单编号：{{serviceDetail['SR Number']}}
          <span class="user-state" v-if="serviceDetail.Action">{{serviceDetail.Status}}</span>
          <span class="user-state" v-else>暂未派工</span>
        </div>
        <div class="mt-Detail-title">维修工程师：{{serviceDetail['KL Owner Full Name']}}</div>
        <div class="mt-Detail-title">联系电话：<a href="javascript:void(0);" class="detail-call">{{serviceDetail['Owner Phone']}}</a></div>
      </div>
      <div class="detail-content">
        <mt-navbar v-model="active">
          <mt-tab-item v-for="tab in tabList" :id="tab.id" :key="tab.id">{{tab.name}}</mt-tab-item>
        </mt-navbar>
        <mt-tab-container v-model="active">
          <mt-tab-container-item id="tab-container1">
            <div class="mt-Detail-info">
              <div>产品条形码：{{serviceDetail['KL SN']}} <a href="javascript:void(0);" class="detail-call"></a></div>
              <div>产品型号：{{serviceDetail['KL Product Model']}}</div>
              <div>申请时间：{{serviceDetail['Created']}}</div>
              <div>预约时间：{{serviceDetail['CEM Planned Start Date']}}</div>
              <div>
                <div>地址：</div>
                <p style="color: grey;font-size: 14px;line-height: 0">
                  {{serviceDetail['KL Personal Province']}},{{serviceDetail['Personal City']}},
                  {{serviceDetail['KL Personal Town']}},{{serviceDetail['Personal Street Address']}}
                </p>
              </div>
              <div>问题说明：
                <p style="color: grey;font-size: 14px;line-height: 0">
                  {{serviceDetail['Complaint Description']}}
                </p>
              </div>
              <attach ioName="KL Service Request Attachment IO" ref="attach"
                      :attach="attach.list"
                      :edit="attach.edit"
                      title="相关照片">
              </attach>
            </div>
          </mt-tab-container-item>
          <mt-tab-container-item id="tab-container2" style="margin-bottom: 2rem;">
            <div class="crm-zyList"  v-for="(item, index) in note" :key="index">
              <ul class="content">
                <li class="bd-radius">
                  <span class="icon"></span>
                </li>
                <li style="margin-right: 8px">{{item.Note}}</li>
                <div class="content-div">
                  <div>{{item.Created}}</div>
                </div>
              </ul>
            </div>
          </mt-tab-container-item>
        </mt-tab-container>
      </div>
    </div>
    <button-group v-if="serviceDetail.Action">
      <mt-button class="single"
                 @click.native="toComment"
                  v-if="action['Status'] === '完成' && survey">点评</mt-button>
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
      let me = this;
      me.srNumber = me.$route.query.srNumber;
      me.getServiceDetail({search: 'SR Number', value: me.srNumber});
      me.queryMedias({
        data: {
          'IOName': 'KL Service Request Attachment IO',
          'SearchSpec': {
            'Service Request Attachment.Activity Id': me.$route.query.srId
          }
        },
        success: data => {
          me.attach.list = KND.Util.toArray(data['SiebelMessage']['Service Request Attachment']);
        }
      });
    },
    data: () => {
      return {
        active: 'tab-container1',
        attach: { // 附件
          list: [],
          edit: false,
          title: '相关照片'
        }
      };
    },
    computed: {
      ...mapState(NameSpace, ['tabList', 'serviceDetail', 'action', 'note', 'survey'])
    },
    methods: {
      ...mapActions('app', ['queryMedias']),
      ...mapActions(NameSpace, ['getServiceDetail']),
      toComment() {
        let me = this;
        me.$router.push({
          name: 'commentOn',
          query: {
            id: me.serviceDetail.Id
          }
        });
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
                font-size: 0.75rem;
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

<!--详情、新增、编辑等页面复用-->
<template>
  <div>
    <!--header-->
    <mt-header fixed :title="title">
      <fallback slot="left"></fallback>
      <mt-button v-show="read && isValid && isManager" slot="right"
                 @click="type = 'edit'">编辑</mt-button>
      <mt-button v-show="!read && isValid" slot="right"
                 @click="updateFn">完成</mt-button>
    </mt-header>

    <!--create detail edit-->
    <div class="mint-content wide-form">
      <div :class="{'readonly':read}">
        <cus-field label="合作伙伴名称" placeholder="请输入名称" tag="名称"
                   @change="checkNameExistFn"
                   :edit=!read
                   v-valid.require
                   v-model="form['Name']"></cus-field>
        <cus-field label="合作伙伴负责人" placeholder="请输入负责人" tag="负责人"
                   :edit=!read
                   v-valid.require
                   v-model="form['KL Partner Owner Name']"></cus-field>
        <cus-field label="联系电话" placeholder="请输入电话" type="tel" tag="电话"
                   :edit=!read
                   v-valid.require.phone
                   v-model="form['Main Phone Number']"></cus-field>
        <cus-field label="详细地址" placeholder="请输入地址" tag="地址"
                   :edit=!read
                   v-valid.require
                   v-model="form['Primary Address Street']"></cus-field>
      </div>

      <attach ioName="KL Channel Partner Attachments" title="合同附件" ref="attach"
              :attach="attach.list"
              :edit="!read">
      </attach>

      <!--pending -->
      <div class="records"
           v-show="state === 'pending'">
        <title-group>审批记录</title-group>
        <empty v-show="!record"></empty>
        <mt-cell class="multiple"
                       v-for="item in records"
                       :key="item.state">
          <div class="mint-cell-title" slot="title">{{item['Party Name'] +' '+ item['Action']}}</div>
          <div class="mint-cell-sub-title" slot="title">{{item['Created']}}</div>
        </mt-cell>
      </div>

      <!--valid invalid && read-->
      <div v-show="read && state !== 'pending'">
        <title-group>联系人列表</title-group>
        <empty v-show="!form.User || !form.User.length"></empty>
        <mt-cell-swipe class="multiple"
                 v-for="item in form.User"
                 :key="item.Id"
                 :right="swiperBtn"
                 @click.native="toContact(item)"
                 is-link>
          <div class="mint-cell-title" slot="title">姓名: {{item['Last Name']}}</div>
          <div class="mint-cell-sub-title" slot="title">登录账号: {{item['Login Name']}}</div>
        </mt-cell-swipe>
      </div>
    </div>

    <!--buttons-->
    <button-group>
      <mt-button v-show="isSubmit"
        @click.native="submitFn">提交</mt-button>
      <mt-button v-show="isValid"
        v-text="read ? '新增联系人' : '失效'"
        @click.native="multipleFn"></mt-button>
      <mt-button v-show="read && state === 'invalid'"
        @click="type = 'edit'">重新启用</mt-button>
    </button-group>
  </div>
</template>

<script type="es6">
  import {mapState, mapActions, mapMutations} from 'vuex';
  import Vue from 'vue';
  import vp from 'public/plugin/validator';
  import titleGroup from 'public/components/cus-title-group';
  import buttonGroup from 'public/components/cus-button-group';
  import cusField from 'public/components/cus-field';
  // use plugin
  Vue.use(vp);

  // Swiper button
  let _swiperBtn = [{
    content: '删除',
    style: { background: 'red', color: '#fff', 'font-size': '15px', 'line-height': '54px' },
    handler: () => this.$messagebox('delete')
  }];

  /**
   * 附件上传
   * @param {Array} serverIds 企业微信临时素材id => mediaId
   * @param {String} id 业务id
   */
  let _upload = function(serverIds, id) {
    // 成功回调
    let callback = data => {
      tools.success(data, {
        back: true,
        successTips: '提交成功'
      });
    };
    // 上传附件
    serverIds ? this.upload({
      data: {
        MediaId: serverIds,
        Id: id,
        IOName: 'KL Channel Partner Attachments'
      },
      success: callback
    }) : callback(id);
  };

  const NAMESPACE = 'detail';
  export default {
    name: NAMESPACE,
    components: {titleGroup, buttonGroup, cusField},
    // 初始化
    created() {
      let me = this;
      let param = me.$route.query;
      me.state = param.state;
      me.type = param.type;
      // 获取详情
      if (param.id) {
        me.findPartnerById(param.id);
        me.queryApprovalList({
          data: {id: param.id},
          success: data => {
            this.records = KND.Util.toArray(data.SiebelMessage['UInbox Item']);
          }
        });
        me.queryMedias({
          data: {
            'IOName': 'KL Channel Partner Attachments',
            'SearchSpec': {
              'KL Channel Partner Attachment.Account Id': param.id
            }
          },
          success: data => {
            this.attach.list = KND.Util.toArray(data['SiebelMessage']['KL Channel Partner Attachment']);
          }
        });
      } else {
        me.clear();
      }
    },
    data: () => {
      return {
        type: 'add', // add 新增 / edit 编辑 / read 只读
        state: 'pending', // pending 待审批 / valid 已生效 / invalid 未生效
        button: {
          list: [{
            text: '提交'
          }]
        },
        attach: { // 附件
          list: [],
          edit: false
        },
        records: '' // 审批记录
      };
    },
    computed: {
      ...mapState('index', ['isManager']),
      ...mapState(NAMESPACE, ['form']),
      // 表单只读
      read() {
        return this.type === 'read';
      },
      // 已生效
      isValid() {
        return this.state === 'valid';
      },
      // 提交按钮
      isSubmit() {
        let type = this.type;
        return type === 'add' || (type === 'edit' && this.state === 'invalid');
      },
      swiperBtn() {
        return this.state === 'valid' ? _swiperBtn : [];
      },
      /**
       * 根据当前状态和类型判断标题展示
       * 新建&重新启用界面复用 仅标题不一样
       * 查看&编辑标题一致
       */
      title() {
        return this.type === 'add' ? '创建委外团队'
          : this.type === 'edit' && this.state === 'invalid' ? '补充委外合约' : '委外团队详情';
      }
    },
    methods: {
      ...mapMutations(NAMESPACE, ['clear']),
      ...mapActions('app', ['upload', 'queryMedias']),
      ...mapActions(NAMESPACE, ['findPartnerById', 'findPartner', 'addPartner', 'update', 'pushMedia', 'queryApprovalList']),
      toContact(contact) {
        this.$router.push({
          name: 'contact',
          query: contact
        });
      },
      // Check whether the name is repeated
      checkNameExistFn() {
        this.findPartner({
          data: {
            Name: this.form.Name
          },
          loading: false,
          success: data => {
            // 查询已存在相同名称记录
            if (data.items) {
              console.log(data);
              Toast('伙伴名称已存在');
            }
          },
          error: error => {
            console.log(error);
          }
        });
      },
      // Partner create & restart
      submitFn() {
        let me = this;
        tools.valid.call(me, () => {
          // 提交图片
          let uploadAttach = id => {
            _upload.call(me, me.$refs.attach.getServerIds(), id);
          };
          // 重新启用委外团队
          if (me.state === 'invalid') {
            // me.update({
            //  data: {
            //    'KL Partner Status': '待审批'
            //  },
            //  success: data => {
            //    uploadAttach(data.items.Id);
            //  }
            // });
          } else {
            // 创建委外团队
            me.addPartner(data => {
              uploadAttach(data.PrimaryRowId);
            });
          }
        });
      },
      // Partner update
      updateFn() {
        let me = this;
        tools.valid.call(me, () => {
          me.update({
            success: data => {
              _upload.call(me, me.$refs.attach.getServerIds(), data.items.Id);
              // 标记列表刷新
              KND.Session.set('refresh', 'valid');
            }
          });
        });
      },
      // To contact or fail out partner
      multipleFn() {
        let me = this;
        if (me.read) {
          me.$router.push('contact');
        } else {
          // fail out partner
          me.update({
            data: {
              'KL Partner Status': '失效'
            }
          });
        }
      }
    }
  };
</script>

<style lang="scss">
  .wide-form {
    .mint-cell-title {
      width: 130px;
    }

    .multiple {
      .mint-cell-title {
        font-size: $font-size-small;
      }
    }
  }

  .records .mint-cell:before {
    background-color: $theme-color;
  }
</style>

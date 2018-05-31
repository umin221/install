<!--详情、新增、编辑等页面复用-->
<template>
  <div>
    <!--header-->
    <mt-header fixed :title="title">
      <fallback slot="left"></fallback>
      <mt-button v-show="read && isReject" slot="right"
                 @click="type = 'edit'">编辑</mt-button>
      <!--<mt-button v-show="!read && isReject" slot="right"-->
                 <!--@click="updateFn">完成</mt-button>-->
    </mt-header>

    <!--create detail edit-->
    <div class="mint-content wide-form">
      <div class="normal-form" :class="{'readonly': read}">
        <cus-field label="合作伙伴名称" placeholder="请输入名称" tag="名称"
                   @change="findPartnerFn"
                   :edit=!read
                   v-valid.require
                   v-model="form['Name']"></cus-field>
        <cus-field label="公司/个人"
                   :edit=!read
                   v-model="form['KL Partner Type 2']"
                   @click.native="showLovFn('KL Partner Type 2')"
                   :is-link="!read"></cus-field>
        <cus-field label="电话" placeholder="主要联系人电话" type="tel" tag="电话"
                   :edit=!read
                   v-valid.require.phone
                   @change="findContactFn"
                   v-model="contact['Cellular Phone #']"></cus-field>
        <cus-field label="联系人" placeholder="主要联系人" tag="联系人"
                   v-valid.require
                   v-model="contact['Last Name']"></cus-field>
        <cus-field label="证件类型" tag="证件类型"
                   :edit=!read
                   v-valid.require
                   v-model="form['KL Partner Credentials Type']"
                   @click.native="showLovFn('KL Partner Credentials Type')"
                   :is-link="!read"></cus-field>
        <cus-field label="证件号码" placeholder="请输入证件号码" tag="证件号码" type="number"
                   :edit=!read
                   v-valid.require
                   v-model="form['KL Partner Credentials Number']"></cus-field>
        <cus-field label="省市区" tag="省市区"
                   @click.native="showCity++"
                   placeholder="请选择"
                   :value="city"
                   v-valid.require
                   :is-link="!read"></cus-field>
        <cus-field label="详细地址" placeholder="请输入地址" tag="地址"
                   :edit=!read
                   v-valid.require
                   v-model="form['CUT Address']['Street Address']"></cus-field>
        <cus-field label="规模"
                   :edit=!read
                   v-model="form['KL Partner Scale']"
                   @click.native="showLovFn('KL Partner Scale')"
                   :is-link="!read"></cus-field>
      </div>

      <attach ioName="KL Channel Partner Attachments" title="资质附件" ref="qualified"
              :attach="attach.qualified"
              :edit="!read">
      </attach>

      <attach ioName="KL Channel Partner Attachments" title="合同附件" ref="contract"
              :attach="attach.contract"
              :edit="!read">
      </attach>

      <!--pending -->
      <div class="records"
           v-show="isPending || isReject">
        <title-group>审批记录</title-group>
        <empty v-show="!records"></empty>
        <mt-cell class="multiple"
                       v-for="item in records"
                       :key="item.state">
          <div class="mint-cell-title" slot="title">审批人：{{item['Task Owner Full Name']}}</div>
          <div class="mint-cell-sub-title" slot="title">审批状态：{{item['Action']}}</div>
          <div class="mint-cell-sub-title" slot="title">审批意见：{{item['KL Request Description']}}</div>
          <div class="mint-cell-sub-title" slot="title">{{new Date(item['Created']).format('yyyy-MM-dd hh:mm')}}</div>
        </mt-cell>
      </div>

      <!--valid invalid && read-->
      <div v-show="read && isValid">
        <title-group>联系人列表</title-group>
        <empty v-show="!form.User || !form.User.length"></empty>
        <mt-cell class="multiple"
                 v-for="(item, index) in form.User"
                 :key="item.Id"
                 @click.native="toContact(item)"
                 is-link>
          <!--:right="isValid ? [{-->
          <!--content: item['KL Status'] === '失效' ? '活动' : '失效',-->
          <!--style: { background: 'red', color: '#fff', 'font-size': '15px', 'line-height': '54px' },-->
          <!--handler: () => deleteUser({item, index})-->
          <!--}] : []"-->

          <div class="mint-cell-title co-flex" slot="title">
            <span class="co-f1">姓名: {{item['Last Name']}}</span>
            <span class="co-f1" style="text-align: right;">{{item['KL Status']}}</span>
          </div>
          <div class="mint-cell-sub-title" slot="title">登录账号: {{item['Login Name']}}</div>
        </mt-cell>
      </div>

      <!--buttons-->
      <button-group v-if="!disableSubmit">
        <mt-button v-show="isSubmit || (!read && isReject)"
                   @click.native="submitFn">提交</mt-button>
        <mt-button v-show="isValid"
                   v-text="read ? '新增联系人' : '失效'"
                   @click.native="multipleFn"></mt-button>
      </button-group>
    </div>

    <cus-city :showCity="showCity" @input="setCityFn"></cus-city>

    <!--popup-->
    <mt-popup v-model="showBox" position="bottom">
      <menu-box vk="Value"
                @my-enter="enter"
                @my-cancel="showBox=false"
                :type="lovType"
                :slots="slots"></menu-box>
    </mt-popup>

  </div>
</template>

<script type="es6">
  import {mapState, mapActions} from 'vuex';
  import Vue from 'vue';
  import vp from 'public/plugin/validator';
  import titleGroup from 'public/components/cus-title-group';
  import cusField from 'public/components/cus-field';
  import menuBox from 'public/components/cus-menu.vue';
  import cusCity from 'public/components/cus-select-city';
  // use plugin
  Vue.use(vp);
  let mapp = config.mapp;
  // 当前时间戳
  let now = KND.Util.now();

  let getLov = function() {
    let me = this;
    let lovs = mapp.lovs;

    for (let l in lovs) {
      me.getLov({
        type: lovs[l],
        success: data => {
          mapp.option[l] = data.items;
        }
      });
    };
  };

  /**
   * 附件上传
   * @param {String} data.MediaId 企业微信临时素材id => mediaId
   * @param {String} data.Comment 附件类型
   * @param {String} data.Id 业务id
   */
  let _upload = function(data, callback) {
    data.IOName = 'KL Channel Partner Attachments';
    // 上传附件
    data.MediaId ? this.upload({
      data: data,
      success: callback
    }) : callback(data.Id);
  };

  const NAMESPACE = 'detail';
  export default {
    name: NAMESPACE,
    components: {titleGroup, cusField, cusCity, menuBox},
    // 初始化
    created() {
      let me = this;
      let param = me.$route.query;

      me.state = param.state;
      me.type = param.type;
      // 获取详情
      if (param.id) {
        me.findPartnerById(param.id);
        // 已生效不抓取审批流程
        if (!this.isValid) {
          me.queryApprovalList({
            data: {id: param.id},
            success: data => {
              this.records = KND.Util.toArray(data.SiebelMessage['UInbox Item']['UInbox Item Task']);
            }
          });
        };
        // 查询附件列表
        me.queryMedias({
          data: {
            'IOName': 'KL Channel Partner Attachments',
            'SearchSpec': {
              'KL Channel Partner Attachment.Account Id': param.id
            }
          },
          success: data => {
            let qualified = [];
            let contract = [];
            let list = KND.Util.toArray(data['SiebelMessage']['KL Channel Partner Attachment']);
            Array.prototype.map.call(list, i => {
              i['Comment'] === '资质文件' ? qualified.push(i) : contract.push(i);
            });
            this.attach.qualified = qualified;
            this.attach.contract = contract;
          }
        });
      }
      // 拉取lov列表
      getLov.call(this);
    },
    data: () => {
      return {
        showCity: 1,
        type: 'add', // add 新增 / edit 编辑 / read 只读
        state: 'pending', // pending 待审批 / valid 已生效 / invalid 未生效
        button: {
          list: [{
            text: '提交'
          }]
        },
        attach: { // 附件
          // 资质附件
          qualified: [],
          // 合同附件
          contract: [],
          edit: false
        },
        slots: [
          {flex: 1, values: [], className: 'slot1', textAlign: 'center'}
        ],
        showBox: false,
        lovType: '',
//        审批记录
        records: '',
//        禁用提交
        disableSubmit: false,
        contact: {
          'Id': now,
          'Cellular Phone #': '', // app登陆账号
          'First Name': '.', // 固定
          'KL Type': '委外人员', // 固定 联系人类型
          'User Type': '委外人员', // 固定 用户类型
          'SSA Primary Field': 'Y', // 主要联系人
          'KL Outsource Password': '' // 密码
        }
      };
    },
    watch: {
      form(n, o) {
        let me = this;
        me.contact['Cellular Phone #'] = n['KL Primary Contact Cellular Phone'];
        me.contact['Last Name'] = n['KL Primary Contact Last Name'];
      }
    },
    computed: {
      ...mapState('index', ['isManager']),
      ...mapState('engineer', ['select']), // 责任人选择结果
      ...mapState(NAMESPACE, ['form']),
      // 表单只读
      read() {
        return this.type === 'read';
      },
      // 已生效
      isValid() {
        return this.state === 'valid';
      },
//      待审批
      isPending() {
        return this.state === 'pending';
      },
//      已驳回
      isReject() {
        return this.state === 'reject';
      },
      // 提交按钮
      isSubmit() {
        let type = this.type;
        return type === 'add' || (type === 'edit' && this.state === 'invalid');
      },
      /**
       * 根据当前状态和类型判断标题展示
       * 新建&重新启用界面复用 仅标题不一样
       * 查看&编辑标题一致
       */
      title() {
        return this.type === 'add' ? '创建委外团队'
          : this.type === 'edit' && this.state === 'invalid' ? '补充委外合约' : '委外团队详情';
      },
      // 省市区
      city() {
        let add = this.form['CUT Address'] || {};
        return `${add['Province']} ${add['City']} ${add['County']}`.replace(/undefined/g, '');
      }
    },
    methods: {
      ...mapActions('app', ['upload', 'queryMedias', 'getLov']),
      ...mapActions('contact', ['findContact']),
      ...mapActions(NAMESPACE, ['findPartnerById', 'findPartner', 'addPartner', 'updateSyn', 'pushMedia', 'queryApprovalList', 'deleteUser']),
      toContact(contact) {
        this.$router.push({
          name: 'contact',
          query: contact
        });
      },
      // Check whether the name is repeated
      findPartnerFn(val) {
        let me = this;
        me.findPartner({
          data: {
            Name: val
          },
          loading: false,
          success: data => {
            // 查询已存在相同名称记录
            if (data.items) {
              console.log(data);
              Toast('伙伴名称已存在');
              me.disableSubmit = true;
            }
          },
          error: error => {
            console.log(error);
            me.disableSubmit = false;
          }
        });
      },
      // 通过电话号码查询联系人 查询到则直接关联用户
      findContactFn() {
        this.findContact({
          data: {'Login Name': this.contact['Cellular Phone #']},
          success: result => {
            let me = this;
            me.contact = result.items;
            me.contact['SSA Primary Field'] = 'Y';
            delete me.contact.Link;
          },
          error: err => {
            console.error(err);
            this.contact.Id = now;
          }
        });
      },
      // Partner create & restart
      submitFn() {
        let me = this;
        tools.valid.call(me, () => {
          // 提交图片
          let uploadAttach = id => {
            let tasks = [
              // 上传资质文件
              new Promise((resolve, reject) => {
                _upload.call(me, {
                  MediaId: me.$refs.qualified.getServerIds(), Comment: '资质文件', Id: id
                }, resolve);
              }),
              // 上传合同文件
              new Promise((resolve, reject) => {
                _upload.call(me, {
                  MediaId: me.$refs.contract.getServerIds(), Comment: '合同文件', Id: id
                }, resolve);
              })
            ];
            // 启动上传任务
            Promise.all(tasks).then(result => {
              // 成功回调
              tools.success(result, {
                back: true,
                successTips: '提交成功'
              });
              // 标记列表刷新
              KND.Session.set('refresh', 'pending,valid,reject');
            }).catch(err => {
              Toast('附件上传失败');
              console.error(err);
            });
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
            me.contact['Login Name'] = me.contact['Cellular Phone #'];
            me.form.ListOfUser = {
              User: me.contact
            };
            // 创建委外团队
            me.addPartner(data => {
              uploadAttach(data['Object Id']);
            });
          }
        });
      },
      // To contact or fail out partner
      multipleFn() {
        let me = this;
        if (me.read) {
          me.$router.push('contact');
        } else {
          // fail out partner
          me.updateSyn({
            data: {
              'KL Partner Status': '失效'
            }
          });
        }
      },
      // Set city
      setCityFn(value) {
        let address = this.form['CUT Address'];
        address['Id'] = address.Id || KND.Util.now();
        address['Province'] = value.KL_PROVINCE;
        address['City'] = value.KL_CITY;
        address['County'] = value.KL_TOWN;
      },
      // Select person in charge
      selectEngineerFn() {
        this.$router.push('engineer');
      },
      // 选择对话框
      showLovFn(type) {
        this.lovType = type;
        this.showBox = true;
        // 选择产品的 value-key 为 KL Product Model No ， 其他为 Value
        this.slots[0].values = mapp.option[type];
      },
      // 选择确认
      enter(values, type) {
        this.showBox = false;
        // 选择填充
        this.form[type] = values[0]['Value'];
      }
    }
  };
</script>

<style lang="scss">
  .wide-form {
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

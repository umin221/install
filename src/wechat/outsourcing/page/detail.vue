<!--详情、新增、编辑等页面复用-->
<template>
  <div>
    <!--header-->
    <mt-header fixed :title="title">
      <fallback slot="left"></fallback>
      <mt-button v-show="read && isValid" slot="right"
                 @click="type = 'edit'">编辑</mt-button>
      <mt-button v-show="!read && isValid" slot="right"
                 @click="updateFn">完成</mt-button>
    </mt-header>

    <!--create detail edit-->
    <div class="mint-content wide-form">
      <div :class="{'readonly':read}">
        <cus-field label="合作伙伴名称" placeholder="请输入名称"
          :class="heartVisible"
          :edit=!read
          @change="checkNameExistFn"
          v-model="form['Name']"></cus-field>
        <cus-field label="合作伙伴负责人" placeholder="请输入负责人"
          :class="heartVisible"
          :edit=!read
          v-model="form['KL Partner Owner Name']"></cus-field>
        <cus-field label="联系电话" placeholder="请输入电话" type="tel"
          :class="heartVisible"
          :edit=!read
          v-model="form['Main Phone Number']"></cus-field>
        <cus-field label="详细地址" placeholder="请输入地址"
          :class="heartVisible"
          :edit=!read
          v-model="form['Primary Address Street']"></cus-field>
        <!--<mt-field v-show="!read" class="require" :readonly="read" label="合同附件"></mt-field>-->
      </div>

      <attach :attach="attach.list"
              :edit="!read"
              :title="title">
      </attach>

      <!--pending -->
      <div class="records"
           v-show="state === 'pending'">
        <title-group>审批记录</title-group>
        <empty v-show="!record"></empty>
        <mt-cell class="multiple"
                       v-for="item in record"
                       :key="item.state">
          <div class="mint-cell-title" slot="title">{{item['state']}}</div>
          <div class="mint-cell-sub-title" slot="title">{{item['time']}}</div>
        </mt-cell>
      </div>

      <!--valid invalid && read-->
      <div v-show="read && state !== 'pending'">
        <title-group>联系人列表</title-group>
        <empty v-show="!form.User.length"></empty>
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
      <mt-button type="primary" class="single"
        v-show="isSubmit"
        @click.native="submitFn">提交</mt-button>
      <mt-button type="primary" class="single"
        v-show="isValid"
        v-text="read ? '新增联系人' : '失效'"
        @click.native="multipleFn"></mt-button>
      <mt-button type="primary" class="single"
        v-show="read && state === 'invalid'"
        @click="type = 'edit'">重新启用</mt-button>
    </button-group>
  </div>
</template>

<script type="es6">
  import {mapState, mapActions, mapMutations} from 'vuex';
  import titleGroup from 'public/components/cus-title-group';
  import buttonGroup from 'public/components/cus-button-group';
  import cusField from 'public/components/cus-field';

  // Swiper button
  let swiperBtn = [{
    content: '删除',
    style: { background: 'red', color: '#fff', 'font-size': '15px', 'line-height': '54px' },
    handler: () => this.$messagebox('delete')
  }];

  const NAMESPACE = 'detail';
  export default {
    name: NAMESPACE,
    components: {titleGroup, buttonGroup, cusField},
    // 初始化
    created() {
      let param = this.$route.query;
      this.state = param.state;
      this.type = param.type;
      // 获取详情
      if (param.id) {
        this.findPartnerById(param.id);
      } else {
        this.clear();
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
        }
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['form', 'attach','record']),
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
        return this.state === 'valid' ? swiperBtn : [];
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
        return this.type === 'add' ? '创建委外团队' :
          this.type === 'edit' && this.state === 'invalid' ? '补充委外合约' : '委外团队详情';
      }
    },
    methods: {
      ...mapMutations(NAMESPACE, ['clear']),
      ...mapActions(NAMESPACE, ['findPartnerById', 'findPartner', 'addPartner', 'update']),
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
          }, error: error => {}
        });
      },
      // Partner create & restart
      submitFn() {
        // restart
        if (this.state === 'invalid') {
          this.update({
            'KL Partner Status': '待审批'
          });
        } else {
          // create
          this.addPartner();
        }
      },
      // Partner update
      updateFn() {
        this.update();
      },
      // To contact or fail out partner
      multipleFn() {
        let me = this;
        if (me.read) {
          me.$router.push('contact');
        } else {
          // fail out partner
          me.update({
            'KL Partner Status': '失效'
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

  .mint-content {
    margin-bottom: 2.8rem;
  }
</style>

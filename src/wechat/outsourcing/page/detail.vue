<!--详情、新增、编辑等页面复用-->
<template>
  <div>
    <mt-header fixed :title="title">
      <fallback slot="left"></fallback>
      <mt-button v-show="read && isValid" slot="right"
                 @click="type = 'edit'">编辑</mt-button>
      <mt-button v-show="!read && isValid" slot="right"
                 @click="type = 'read'">完成</mt-button>
    </mt-header>

    <div class="mint-content wide-form">
      <div :class="{'readonly':read}">
        <mt-field label="合作伙伴名称" placeholder="请输入名称"
          :class="heartVisible"></mt-field>
        <mt-field label="合作伙伴负责人" placeholder="请输入负责人"
          :class="heartVisible"></mt-field>
        <mt-field label="联系电话" placeholder="请输入电话" type="tel"
          :class="heartVisible"></mt-field>
        <mt-field label="详细地址" placeholder="请输入地址"
          :class="heartVisible"></mt-field>
        <!--<mt-field v-show="!read" class="require" :readonly="read" label="合同附件"></mt-field>-->
      </div>

      <attach :attach="attach.list"
              :edit="!read"
              :title="title">
      </attach>

      <div v-show="read && state !== 'pending'">
        <title-group>联系人列表</title-group>
        <mt-cell-swipe class="multiple"
                 v-for="item in contact.list"
                 :key="item.id"
                 :right="right"
                 is-link>
          <div class="mint-cell-title" slot="title">姓名: {{item.name}}</div>
          <div class="mint-cell-sub-title" slot="title">登录账号: {{item.loginID}}</div>
        </mt-cell-swipe>
      </div>
    </div>

    <button-group>
      <mt-button type="primary" class="single"
        v-show="type==='add'"
        @click.native="submitFn">提交</mt-button>
      <mt-button type="primary" class="single"
        v-show="state==='valid'"
        v-text="read? '新增联系人' : '失效'"
        @click.native="submitFn"></mt-button>
      <mt-button type="primary" class="single"
        v-show="read && state==='invalid'"
        @click="type='add'">重新启动</mt-button>
    </button-group>
  </div>
</template>

<script type="es6">
  import titleGroup from 'public/components/cus-title-group';
  import buttonGroup from 'public/components/cus-button-group';

  // Right button
  let right = [{
    content: '删除',
    style: { background: 'red', color: '#fff', 'font-size': '15px', 'line-height': '54px' },
    handler: () => this.$messagebox('delete')
  }];

  export default {
    // 初始化
    created() {
      let param = this.$route.query;
      this.state = param.state;
      this.type = param.type;
    },
    data: () => {
      return {
        type: 'add', // add 新增 / edit 编辑 / read 只读
        state: 'pending', // pending 待审批 / valid 已生效 / invalid 未生效
        attach: {
          list: [{id:1}, {id:2}, {id:3}, {id:4}, {id:4}],
          edit: false,
          title: '合同附件'
        }, // 附件
        contact: {
          list: [{ // 联系人列表
            id: '1',
            name: '张晓明',
            loginID: 'zhangxm'
          },{
            id: '2',
            name: '张晓飞',
            loginID: 'zhangxf'
          },{
            id: '2',
            name: '张晓飞',
            loginID: 'zhangxf'
          }]
        },
        button: {
          list: [{
            text: '提交'
          }]
        }
      };
    },
    computed: {
      // 表单只读
      read() {
        return this.type === 'read';
      },
      // 已生效
      isValid() {
        return this.state === 'valid';
      },
      right() {
        return this.state === 'valid' ? right : [];
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
        let type = this.type;
        return type === 'add' ? (this.state === 'invalid' ? '补充委外合约' : '创建委外团队') : '委外团队详情';
      }
    },
    methods: {
      submitFn() {
        // pending
        this.state = this.state === 'add' ? 'edit' : 'read';
      }
    },
    components: {titleGroup, buttonGroup}
  };
</script>

<style lang="scss">
  .wide-form {
    .mint-cell-title {
      width: 130px;
    }
  }

  .mint-content {
    margin-bottom: 2.8rem;
  }
</style>

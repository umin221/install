<template>
  <div>
    <mt-header fixed :title="title">
      <fallback slot="left"></fallback>
    </mt-header>

    <div class="mint-content">
      <div>
        <mt-field label="联系电话" placeholder="请输入电话" type="number" tag="电话"
                  v-model="contact['Login Name']"
                  v-valid.require.phone
                  @change="findContactFn"></mt-field>
        <mt-field label="姓名" placeholder="请输入姓名" tag="姓名"
                  v-valid.require
                  v-model="contact['Last Name']"></mt-field>
        <mt-field label="登陆账号" class="readonly" placeholder="与电话一致(自动)"
                  :value="contact['Login Name']"></mt-field>
        <mt-field label="登陆密码" placeholder="请输入密码" tag="密码"
                  v-valid.require
                  v-model="contact['KL Outsource Password']"></mt-field>

       <!-- <mt-cell title="是否启用">
          <mt-switch v-model="enable"></mt-switch>
        </mt-cell>-->
      </div>

      <button-group>
        <mt-button class="single" :class="{disable: disable}"
                   @click.native="saveFn">保存</mt-button>
      </button-group>
    </div>
  </div>
</template>

<script type="es6">
  import {mapActions} from 'vuex';
  import buttonGroup from 'public/components/cus-button-group';
  import cusField from 'public/components/cus-field';

  let now = KND.Util.now();
  let NAMESPACE = 'contact';
  export default {
    name: NAMESPACE,
    components: {buttonGroup, cusField},
    created() {
      let contact = this.$route.query;
      if (contact['Last Name']) {
        this.contact = contact;
        this.title = '编辑委外联系人';
      }
    },
    data() {
      return {
        title: '新建委外联系人',
        contact: {
          'Id': now,
          'Login Name': '', // 电话号码
          'First Name': '.', // 固定
          'KL Type': '委外人员', // 固定 联系人类型
          'User Type': '委外人员', // 固定 用户类型
          'KL Outsource Password': '', // 密码
          'KL Status': '活动'
        },
        disable: false
      };
    },
    computed: {
      // 联系人启用/失效
      enable: {
        get() {
          return this.contact['KL Status'] === '活动';
        },
        set(flag) {
          this.contact['KL Status'] = flag ? '活动' : '失效';
        }
      }
    },
    methods: {
      ...mapActions(NAMESPACE, ['findContact', 'upsertContact']),
      // 通过电话号码查询联系人 查询到则直接关联用户
      findContactFn() {
        this.findContact({
          data: {'Login Name': this.contact['Login Name']},
          success: result => {
            this.contact = result.items;
          },
          error: err => {
            console.error(err);
            this.contact.Id = now;
          }
        });
      },
      // 创建&编辑联系人
      saveFn() {
        tools.valid.call(this, () => {
          let c = this.contact;
          c['Cellular Phone #'] = c['Login Name'];
          // 保存联系人
          this.upsertContact(this.contact);
        });
      }
    }
  };
</script>

<style lang="scss"></style>

<template>
  <div>
    <mt-header fixed :title="title">
      <fallback slot="left"></fallback>
    </mt-header>

    <div class="mint-content">
      <div>
        <mt-field label="姓名" placeholder="请输入姓名"
                  :value="contact['Last Name']"></mt-field>
        <mt-field label="联系电话" placeholder="请输入电话"
                  :value="contact['Work Phone #']"></mt-field>
        <mt-field label="登陆账号" placeholder="请输入账号" type="tel"
                  :value="contact['Work Phone #']"></mt-field>
        <mt-field label="登陆密码" placeholder="请输入密码"
                  :value="contact['Work Phone #']"></mt-field>
      </div>
    </div>

    <button-group>
      <mt-button type="primary" class="single"
                 @click.native="saveFn">保存</mt-button>
    </button-group>
  </div>
</template>

<script type="es6">
  import buttonGroup from 'public/components/cus-button-group';

  let NameSpace = 'contact';
  export default {
    name: NameSpace,
    components: {buttonGroup},
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
        contact: ''
      }
    },
    methods: {
      saveFn() {

      }
    }
  }
</script>

<style lang="scss"></style>

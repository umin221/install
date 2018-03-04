<template>
  <div>
    <mt-header fixed :title="title">
      <fallback slot="left"></fallback>
    </mt-header>

    <div class="mint-content">
      <div>
        <mt-field label="姓名" placeholder="请输入姓名"
          v-model="contact['Last Name']"
          @blur="checkNameFn"></mt-field>
        <mt-field label="联系电话" placeholder="请输入电话"
          v-model="contact['Work Phone #']"></mt-field>
        <mt-field label="登陆账号" placeholder="请输入账号"
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
  import {mapActions} from 'vuex';
  import buttonGroup from 'public/components/cus-button-group';
  import cusField from 'public/components/cus-field';

  let NameSpace = 'contact';
  export default {
    name: NameSpace,
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
        contact: {}
      }
    },
    methods: {
      ...mapActions(NameSpace, ['']),
      // 检测名字，不可重复
      checkNameFn() {

      },
      saveFn() {
        // 保存联系人
        console.log(this.contact);
      }
    }
  }
</script>

<style lang="scss"></style>

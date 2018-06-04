<template>
  <div>
    <mt-header fixed :title="title">
      <fallback slot="left"></fallback>
    </mt-header>

    <div class="mint-content">
      <div>
        <mt-field label="联系人电话" placeholder="请输入电话" type="number" tag="电话"
                  v-model="contact['KL Contact Mobile Phone']"
                  v-valid.require.phone
                  @change="findContactFn"></mt-field>
        <mt-field label="联系人姓名" placeholder="请输入姓名" tag="姓名"
                  v-valid.require
                  v-model="contact['Contact Last Name']"></mt-field>
        <mt-radio
          title="性别"
          v-model="value"
          :options="['男', '女']">
        </mt-radio>
      </div>

      <button-group>
        <mt-button class="single"
                   @click.native="saveFn">保存</mt-button>
      </button-group>
    </div>
  </div>
</template>

<script type="es6">
  // import {mapActions} from 'vuex';
  import buttonGroup from 'public/components/cus-button-group';
  import cusField from 'public/components/cus-field';
  import Vue from 'vue';
  import vp from 'public/plugin/validator';
  Vue.use(vp);

  let now = KND.Util.now();
  let NAMESPACE = 'contact';
  export default {
    name: NAMESPACE,
    components: {buttonGroup, cusField},
    created() {
      let contact = this.$route.query.item;
      if (contact['Contact Last Name']) {
        this.contact = contact;
        this.title = '编辑联系人';
      }
    },
    data() {
      return {
        title: '新建委外联系人',
        value: '男',
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
      // ...mapActions(NAMESPACE, ['findContact', 'upsertContact']),
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
          c['Phone #'] = c['Login Name'];
          // 保存联系人
          this.upsertContact(this.contact);
        });
      }
    }
  };
</script>

<style lang="scss"></style>

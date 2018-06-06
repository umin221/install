<template>
  <div>
    <mt-header fixed :title="title">
      <fallback slot="left"></fallback>
    </mt-header>

    <div class="mint-content">
      <div>
        <mt-field label="联系人电话" placeholder="请输入电话" type="number" tag="电话"
                  v-model="contact['KL Contact Mobile Phone']"
                  v-valid.require.phone></mt-field>
        <mt-field label="联系人姓名" placeholder="请输入姓名" tag="姓名"
                  v-valid.require
                  v-model="contact['Contact Last Name']"></mt-field>
        <mt-radio
          title="性别"
          v-model="contact['KL Contact M/F']"
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
  import api from '../api/api';
  import Vue from 'vue';
  import vp from 'public/plugin/validator';
  Vue.use(vp);

  let NAMESPACE = 'contact';
  export default {
    name: NAMESPACE,
    components: {buttonGroup, cusField},
    created() {
      var self = this;
      self.contact = this.$route.query.item;
      this.title = '编辑联系人';
    },
    data() {
      return {
        title: '新建委外联系人',
        contact: {},
        disable: false
      };
    },
    computed: {
    },
    methods: {
      // ...mapActions(NAMESPACE, ['findContact', 'upsertContact']),
      // 创建&编辑联系人
      saveFn() { // 1.查询后台是否存在改联系人 2.有联系人修改 3.没有联系人新增
        var self = this;
        tools.valid.call(this, () => {
          api.get({ // 查询联系人是否存在
            key: 'selectContact',
            method: 'POST',
            data: self.contact,
            success: function(data) {
              var obj = KND.Util.toArray(data.SiebelMessage['Contact']);
              if (obj.length > 0) {
                console.dir('0');
                self.contact['Contact Id'] = obj[0].Id;
              } else {
                self.contact['Contact Id'] = '0001';
              }
              api.get({ // 联系人信息保存
                key: 'saverContact',
                method: 'POST',
                data: self.contact,
                success: function(dataObj) {
                  var contactObj = KND.Util.toArray(data.SiebelMessage['Contact']);
                  if (contactObj.length > 0) {
                    api.get({ // 联系人关联服务单
                      key: 'contact',
                      method: 'POST',
                      data: {
                        contactId: self.contact['Contact Id'],
                        contactName: self.contact['Contact Last Name'],
                        itemId: self.contact.Id
                      },
                      success: function(data) {
                        Toast('保存成功！');
                        KND.Util.back();
                      }
                    });
                  }
                }
              });
            }
          });
        });
      }
    }
  };
</script>

<style lang="scss"></style>

<template>
  <div style="background-color: #ebebeb;">
    <div class="mint-content">
      <empty v-show="!cutAddress.length && !localAddress.length"></empty>
      <div class="addressC" v-for="(item, index) in cutAddress" :key="index">
        <cus-cell class="addressT" @click.native="select(item)">
          <div class="mint-cell-sub-title" slot="title">
            省市区：{{item['Province']}}{{item['City']}}{{item['County']}}
          </div>
          <div class="mint-cell-sub-title" slot="title">
            地址：{{item['Street Address']}}{{item['Street Address 2']}}{{item['Street Address 3']}}{{item['Street Address 4']}}
          </div>
        </cus-cell>
        <div class="editDetail">
          <div class="default"
               v-show="item['SSA Primary Field'] === 'Y'">默认地址</div>
          <div class="setDefault"
               v-show="item['SSA Primary Field'] === 'N'"
                @click="setDefault(item.Id)">设为默认</div>
          <mt-badge class="xs-icon icon-delete"
                    style="color: #ffffff;"
                    type="error"
                    @click.native="deleteAddr(item.Id)">删除</mt-badge>
          <mt-badge class="xs-icon icon-edit"
                    type="success"
                    @click.native="editAddr(item.Id)">编辑</mt-badge>
        </div>
      </div>
      <div class="addressC"
           v-if="!cutAddress.length"
           v-for="(item, index) in localAddress"
           :key="index">
        <cus-cell class="addressT" @click.native="select(item)">
          <div class="mint-cell-sub-title" slot="title">
            省市区：{{item['Province']}}{{item['City']}}{{item['County']}}
          </div>
          <div class="mint-cell-sub-title" slot="title">
            地址：{{item['Street Address']}}{{item['Street Address 2']}}{{item['Street Address 3']}}{{item['Street Address 4']}}
          </div>
        </cus-cell>
        <div class="editDetail">
          <mt-badge class="xs-icon icon-delete"
                    style="color: #ffffff;"
                    type="error"
                    @click.native="deleteAddr(item.Id)">删除</mt-badge>
          <mt-badge class="xs-icon icon-edit"
                    type="success"
                    @click.native="editAddr(item.Id, index+1)">编辑</mt-badge>
        </div>
      </div>
      <!--新增保存在本地-->
      <button-group>
        <mt-button class="single" @click.native="toAddAddress" >
          <i class="xs-icon icon-add"></i>
          新建地址
        </mt-button>
      </button-group>
    </div>
  </div>
</template>
<script type="es6">
  import {mapState, mapActions, mapMutations} from 'vuex';
  import menuBox from 'public/components/cus-menu.vue';
  import cusCell from 'public/components/cus-cell';
  const NAMESPACE = 'address';
  const INDEX = 'index';

  export default {
    name: NAMESPACE,
    created() {
      let me = this;
      // 用户信息
      me.getContact(result => {
        me.contact = result;
      });
    },
    data: () => {
      return {
        isActive: '',
        contact: ''
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['localAddress']),
      cutAddress() {
        return KND.Util.toArray(this.contact['CUT Address']);
      }
    },
    methods: {
      ...mapActions(NAMESPACE, ['deleteAddress', 'setDefaultAddress']),
      ...mapActions(INDEX, ['getContact']),
      ...mapMutations(INDEX, ['addressBack']),
      toAddAddress() {
        let me = this;
        me.$router.push({
          name: 'addAddress',
          query: {
            ContactId: me.contact.Id,
            type: 'add'
          }
        });
//        this.$router.push('addAddress');
      },
      select(item) {
        let me = this;
        me.addressBack(item);
        me.$router.back();
      },
      editAddr(Id, index) {
        let me = this;
        me.$router.push({
          name: 'addAddress',
          query: {
            Id: Id,
            type: 'edit',
            index: index
          }
        });
      },
      deleteAddr(Id) {
        MessageBox.confirm('确认删除该地址', '提示').then(action => {
          let me = this;
          me.deleteAddress({
            Id,
            cb() {
              me.getContact(result => {
                me.contact = result;
              });
            }
          });
        });
      },
      setDefault(Id) {
        let me = this;
        me.setDefaultAddress({
          contactId: me.contact.Id,
          addressId: Id,
          success: data => {
            me.getContact(result => {
              Toast('设置成功');
              me.contact = result;
            });
          }
        });
      }
    },
    components: {menuBox, cusCell}
  };
</script>
<style lang="scss">
  .addressC{
    margin-top: 20px;
    .addressT{
      font-size: $font-size-large;
      div{
        line-height: 1.2rem;
      }
    }
    .editDetail{
      background: #ffffff;
      position: relative;
      margin: -10px 10px;
      height: 30px;
      .default{
        float: left;
        font-size: 14px;
        line-height: 1.5rem;
        margin-left: 10px;
        color: red;
      }
      .setDefault{
        float: left;
        width: 3rem;
        height: 1.2rem;
        font-size: 12px;
        line-height: 1.2rem;
        text-align: center;
        margin-left: 10px;
        background-color: $theme-color;
        color: #ffffff;
      }
      span{
        float: right;
      }
    }
  }
</style>

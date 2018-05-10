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
                    @click.native="deleteAddr(item.Id, 'cutAddr')">删除</mt-badge>
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
                    @click.native="deleteAddr(item.Id, 'local')">删除</mt-badge>
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
<script>
  import {mapState, mapActions, mapMutations} from 'vuex';
  import menuBox from '../../../public/components/cus-menu.vue';
  import cusCell from 'public/components/cus-cell';
  const NameSpace = 'address';
  export default {
    name: NameSpace,
    created() {
      let me = this;
      me.getContact();
    },
    data: () => {
      return {
        isActive: ''
      };
    },
    computed: {
      ...mapState(NameSpace, ['cutAddress', 'Contact', 'localAddress'])
    },
    methods: {
      ...mapActions(NameSpace, ['getContact', 'deleteAddress', 'setDefaultAddress']),
      ...mapMutations('index', ['addressBack']),
      toAddAddress() {
        let me = this;
        me.$router.push({
          name: 'addAddress',
          query: {
            ContactId: me.Contact ? me.Contact.Id : '',
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
      deleteAddr(Id, type) {
        MessageBox.confirm('确认删除该地址', '提示').then(action => {
          let me = this;
          me.deleteAddress({Id, type});
        });
      },
      setDefault(Id) {
        let me = this;
        me.setDefaultAddress({contactId: me.Contact.Id, addressId: Id});
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

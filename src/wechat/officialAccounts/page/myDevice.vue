<template>
  <div style="background-color: #ebebeb;">
    <div class="mint-content">
      <div class="myDevice">
        <empty v-show="!ContactAsset.length"></empty>
        <cus-cell class="myDeviceList"
                  v-for="(item, index) in ContactAsset"
                  @click.native="toDetail(item['KL Asset Id'])"
                  :key="index"
                  is-link>
          <div class="mint-cell-sub-title" slot="title">产品序列号：{{item['KL Asset SN']}}</div>
          <div class="mint-cell-sub-title" slot="title">产品名称：{{item['KL Asset Product Name']}}</div>
          <div class="mint-cell-sub-title" slot="title">产品型号：{{item['KL Asset Product Model']}}</div>
        </cus-cell>
      </div>
      <button-group>
        <mt-button class="single" @click.native="addDevice">添加</mt-button>
      </button-group>
    </div>
  </div>
</template>
<script type="es6">
  import {mapActions} from 'vuex';
  import menuBox from '../../../public/components/cus-menu.vue';
  import cusCell from 'public/components/cus-cell';

  const NAMESPACE = 'myDevice';
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
        contact: ''
      };
    },
    computed: {
      ContactAsset() {
        return KND.Util.toArray(this.contact.Contact_Asset);
      }
    },
    methods: {
      ...mapActions('index', ['getContact']),
      toDetail(Id) {
        console.log(Id);
        let me = this;
        me.$router.push({
          name: 'deviceDetail',
          query: {
            id: Id
          }
        });
      },
      addDevice() {
        let me = this;
        me.$router.push({
          name: 'addDevice',
          query: {
            id: me.contact.Id
          }
        });
      }
    },
    components: {menuBox, cusCell}
  };
</script>
<style lang="scss">
  .myDeviceList{
    div{
      line-height: 1.5rem;
    }
  }
</style>

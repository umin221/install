<template>
  <div style="background-color: #ebebeb;">
    <div class="mint-content">
      <div class="addform">
        <mt-cell title="省市区"
                 @click.native="showLovFn('KL_PROVINCE')"
                 placeholder="请选择"
                 is-link
                 v-model="provinces"></mt-cell>
        <cus-field class="block"
                   label="详细地址"
                   v-model= 'street_Address'
                   type="textarea"
                   placeholder="请输入详细地址"></cus-field>
        <!--<cus-field label="联系人" type="text" placeholder="请输入联系人姓名"></cus-field>-->
        <!--<cus-field label="联系电话" type="number" placeholder="请输入联系人电话"></cus-field>-->
      </div>
    </div>
    <!--下拉菜单-->
    <mt-popup v-model="showBox" position="bottom">
      <menu-box @my-enter="enter"
                @my-cancel="showBox = false"
                @my-change="onValuesChange"
                @my-change1="onValuesChange1"
                :slots="slots"
                :slots1="slots1"
                :slots2="slots2"></menu-box>
    </mt-popup>

    <button-group>
      <mt-button class="single" @click.native="saveAddress">保存</mt-button>
    </button-group>
  </div>
</template>
<script>
  import {mapState, mapActions, mapMutations} from 'vuex';
  import menuBox from '../components/cus-menu';
  import cusField from 'public/components/cus-field';
  //  import { MessageBox } from 'mint-ui';
  let isMunicipality = function(...args) {
    let me = this;
    let city = args.pop();
    let isMun = true;
    for (let i = 0;i < me.Municipality.length; i++) {
      if (city === me.Municipality[i]) {
        isMun = false;
      }
    }
    return isMun;
  };
  const NameSpace = 'addAddress';

//  let mapp = config.mapp;
  export default {
    name: NameSpace,
    created() {
      let me = this;
      me.type = me.$route.query.type;
      me.ContactId = me.$route.query.ContactId;
      if (me.type === 'edit') {
        me.addrId = me.$route.query.Id;
        me.searchAddrId({
          addrId: me.addrId,
          callback: function(data) {
            if (data) {
              me.KL_PROVINCE = data['Province'];
              me.KL_CITY = data['City'];
              me.KL_TOWN = data['County'];
              me.street_Address = data['Street Address'];
              me.provinces = data['Province'] + data['City'] + data['County'];
            }
          }
        });
      }
    },
    data: () => {
      return {
        slots: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}],
        slots1: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}],
        slots2: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}],
        showBox: false,
        provinces: '',
        KL_PROVINCE: '',
        KL_CITY: '',
        KL_TOWN: '',
        street_Address: '',
        addrId: '',
        ContactId: ''
      };
    },
    computed: {
      ...mapState(NameSpace, ['Municipality'])
    },
    methods: {
      ...mapActions(NameSpace, ['addressManage', 'searchAddrId', 'upDateAddress']),
      ...mapActions('index', ['getLov']),
      ...mapMutations('address', ['setLocalAddress']),
//      submit() {
//        this.$router.push('myRepair');
//      },
      // 选择对话框
      showLovFn(type) {
        let me = this;
        me.slots[0].values = [];
        me.showBox = true;
        me.getLov({
          type: 'KL_PROVINCE',
          parent: '中国',
          success: data => {
            let datas = KND.Util.toArray(data.items) ;
            for (let i = 0;i < datas.length; i++) {
              me.slots[0].values.push(datas[i].Value);
            }
          }
        });
      },
      enter(values) {
        let me = this;
        let isMun = isMunicipality.call(this, values['KL_PROVINCE']);
        me.showBox = false;
        me.KL_PROVINCE = values['KL_PROVINCE'];
        me.KL_CITY = values['KL_CITY'];
        me.KL_TOWN = values['KL_TOWN'];
        if (isMun) {
          me.provinces = values['KL_PROVINCE'] + values['KL_CITY'] + values['KL_TOWN'];
        } else {
          me.provinces = values['KL_CITY'] + values['KL_TOWN'];
        }
      },
      onValuesChange(value) {
        let me = this;
        me.slots1[0].values = [];
        if (value[0]) {
          me.getLov({
            type: 'KL_CITY',
            parent: value[0],
            success: data => {
              let datas = KND.Util.toArray(data.items) ;
              for (let i = 0;i < datas.length; i++) {
                me.slots1[0].values.push(datas[i].Value);
              }
            }
          });
        }
      },
      onValuesChange1(value) {
        let me = this;
        me.slots2[0].values = [];
        if (value[0]) {
          me.getLov({
            type: 'KL_TOWN',
            parent: value[0],
            success: data => {
              let datas = KND.Util.toArray(data.items) ;
              for (let i = 0;i < datas.length; i++) {
                me.slots2[0].values.push(datas[i].Value);
              }
            }
          });
        }
      },
      saveAddress() {
        let me = this;
        let form = {};
        if (me.type === 'add') {
          form = {
            'Province': me.KL_PROVINCE,
            'City': me.KL_CITY,
            'County': me.KL_TOWN,
            'Street Address': me.street_Address,
            'contactId': me.ContactId,
            success: function(data) {
              if (!me.ContactId && data) {
                me.setLocalAddress({data: data.items});
              }
              me.$router.back();
            }
          };
          console.log(form);
          me.addressManage(form);
        } else {
          form = {
            'Province': me.KL_PROVINCE,
            'City': me.KL_CITY,
            'County': me.KL_TOWN,
            'Street Address': me.street_Address,
            'contactId': me.ContactId,
            'addrId': me.addrId,
            callback: function(data) {
              if (me.$route.query.index) {
                me.setLocalAddress({
                  data: data.items,
                  index: me.$route.query.index
                });
              }
              me.$router.back();
            }
          };
          me.upDateAddress(form);
        }
      }
    },
    components: {menuBox, cusField}
  };
</script>
<style lang="scss">
  .block{

    .mint-cell>.mint-cell-wrapper{
      display: block;
    }
  }
</style>

<template>
  <div style="background-color: #ebebeb;">
    <div class="mint-content">
      <div class="addform">
        <mt-cell title="省市区"
                 @click.native="showLovFn('KL_PROVINCE')"
                 placeholder="请选择"
                 is-link
                 v-model="provinces"></mt-cell>
        <cus-field class="block" label="详细地址" type="textarea" placeholder="请输入详细地址"></cus-field>
        <cus-field label="联系人" type="text" placeholder="请输入联系人姓名"></cus-field>
        <cus-field label="联系电话" type="number" placeholder="请输入联系人电话"></cus-field>
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
      <mt-button class="single">保存</mt-button>
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
    },
    data: () => {
      return {
        slots: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}],
        slots1: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}],
        slots2: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}],
        showBox: false,
        provinces: ''
      };
    },
    computed: {
      ...mapState(NameSpace, ['addAddress', 'Municipality'])
    },
    methods: {
      ...mapActions('index', ['getLov']),
      ...mapMutations(NameSpace, []),
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
        console.log(values['KL_PROVINCE']);
        console.log(isMun);
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

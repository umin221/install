<template>
  <div style="background-color: #ebebeb;">
    <div class="mint-content">
      <div class="addform">
        <mt-cell title="产品品牌" placeholder="请选择" is-link></mt-cell>
        <mt-field label="产品条形码" placeholder="请输入条形码"></mt-field>
        <mt-cell title="详细地址" placeholder="请选择" to="address" is-link></mt-cell>
        <mt-field label="联系人" type="number" placeholder="请输入联系人"></mt-field>
        <mt-field label="联系电话" type="number" placeholder="请输入联系电话"></mt-field>
        <mt-cell title="预约时间" placeholder="请选择" is-link></mt-cell>
        <mt-cell title="故障现象" placeholder="请选择" is-link></mt-cell>
        <mt-field label="问题说明"  placeholder="请详细说明..."></mt-field>
        <mt-cell>
          <div class="photo">相关照片</div>
        </mt-cell>
      </div>
      <!--<mt-popup v-if="showBox" v-model="showBox" position="bottom">-->
      <!--</mt-popup>-->
      <!--<mt-datetime-picker-->
        <!--ref="picker1"-->
        <!--v-model="pickerVisible"-->
        <!--:startDate="startDate"-->
        <!--year-format="{value} 年"-->
        <!--month-format="{value} 月"-->
        <!--date-format="{value} 日"-->
        <!--hour-format="{value} 时"-->
        <!--class="datetime"-->
        <!--@confirm="handleChange">-->
      <!--</mt-datetime-picker>-->
      <button-group>
        <mt-button class="single" @click.native="submit">提交</mt-button>
      </button-group>
    </div>
  </div>
</template>
<script>
//  import {mapState, mapActions, mapMutations} from 'vuex';
  import menuBox from 'public/components/cus-menu';
//  import { MessageBox } from 'mint-ui';
//  const textCall = (function() {
//    return function(callNum) {
//      let phoneReg = new RegExp('^[1][3,4,5,7,8][0-9]{9}$');
//      let workPhoneReg = new RegExp('^(([0\\+]\\d{2,3})?(0\\d{2,3}))(\\d{7,8})((\\d{3,}))?$');
//      return (phoneReg.test(callNum) || phoneReg.test(workPhoneReg));
//    };
//  })();
  const NameSpace = 'index';
  export default {
    name: NameSpace,
    created() {
    },
    data: () => {
      return {
      };
    },
    computed: {
//      ...mapState(NameSpace, [''])
    },
    methods: {
//      ...mapActions(NameSpace, ['']),
//      ...mapMutations(NameSpace, []),
      submit() {
        this.$router.push('myRepair');
      }
    },
    components: {menuBox}
  };
</script>
<style lang="scss">
</style>

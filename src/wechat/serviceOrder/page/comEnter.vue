<template>
  <div style="background-color: #ebebeb;">
    <mt-header fixed title="故障记录">
      <fallback slot="left"></fallback>
      <mt-button slot="right">提交</mt-button>
    </mt-header>

    <div class="mint-content addService">
      <div class="addform">
        <mt-field label="产品条形码" type="text" placeholder="输入或扫门锁条形码" @change="sarech" v-model="SerialNumber" class="textRight"></mt-field>
        <mt-cell class="mint-field" title="所在省市区" placeholder="请选择" :value="form.Personal"></mt-cell>
        <mt-field class="block" label="详细地址" v-model="form.Address" placeholder="如设备过旧未贴条码,允许为空" type="textarea" rows="2"></mt-field>
        <mt-cell class="require mint-field" title="产品型号" placeholder="请选择" :value="form.ProductModel" is-link></mt-cell>
        <mt-cell class="mint-field require" title="故障现象" :value="form.Area" placeholder="请选择" @click.native="showArea" is-link></mt-cell>
        <mt-cell class="mint-field require" :value="form.Responsbility" title="责任划分"></mt-cell>
        <mt-field class="block" label="故障描述" v-model="form.Description" placeholder="详细描述或附加需求..." type="textarea" rows="3">
          <div style="line-height: 2rem"><i class="xs-icon icon-mic" style="float: right;"></i></div>
        </mt-field>
        <div>
          <div style="color: #777;font-size: 0.75rem;text-indent:0.75em;line-height: 40px">上传图片</div>
          <div style="text-indent:0.75em"><i class="xs-icon icon-attach"></i></div>
        </div>
      </div>
      <mt-popup v-if="showBox" v-model="showBox" position="bottom" style="width: 100%">
        <menuBox @my-enter="enter" @my-change="onValuesChange" @my-cancel="cancel" :slots="slots"></menuBox>
      </mt-popup>
      <secrchPage></secrchPage>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions, mapMutations} from 'vuex';
  import menuBox from '../../../public/components/cus-menu';
  const delay = (function() {
    let timer = 0;
    return function(callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();
  const NameSpace = 'comEnter';
  export default {
    name: NameSpace,
    created() {
    },
    data: () => {
      return {
        SerialNumber: '', // 产品条形码
        showBox: false
      };
    },
    computed: {
      ...mapState(NameSpace, ['form', 'slots'])
    },
    methods: {
      ...mapActions(NameSpace, ['getAsset', 'getLov1', 'valueChange1']),
      ...mapMutations(NameSpace, ['errorTips']),
      submit() {
      },
      sarech() {
        let me = this;
        delay(() => {
          if (me.SerialNumber) {
            me.getAsset(me.SerialNumber);
          }
        }, 300);
      },
      showArea() {
        let me = this;
        me.showBox = true;
        me.getLov1();
      },
      enter(value) {
        console.log(value);
      },
      onValuesChange(value) {
        if (value[0]) {
          this.valueChange1(value[0]);
        }
      },
      cancel(value) {
        console.log(value);
      }
    },
    components: {menuBox}
  };
</script>
<style lang="scss">
  @mixin disFlex (){
    display: flex;
    justify-content:center;
    align-items: center;
  }
  .addService{
    .addform{
      background: white;
      .block{
        .mint-cell-wrapper{
          display: block!important;
          .mint-cell-value{
            display: block!important;
            textarea{
              resize: none;
            }
          }
        }
      }
    }
    .textRight{
      .mint-cell-wrapper{
        .mint-cell-value{
          @include disFlex();
          input{
            height: 100%;
            text-align: right;
          }
        }
      }
    }
    .icon-right{
      position: absolute;
      right:0.5rem;
    }
    .submitButton,.addMore{
      @include disFlex();
    }
    .addMore{
      height: 2rem;
      color: $theme-color;
      font-size: 0.75rem;
      span{
        margin-left: 5px;
      }
    }
    .submitButton {
      height: 2.75rem;
      background: white;
      margin-top: 1rem;
      button {
        width: 60%;
        border-radius: 5px;
        background:$theme-color;
      }
    }
    .mint-field-core::-webkit-input-placeholder{
      color: #d4d4d4;
      font-weight: 100;
    }
    .mint-field{
      padding: 0 0.5rem;
      .mint-cell-wrapper{
        padding: 0;
        background-position: bottom;
        font-size: 0.75rem;
      }
    }
  }
</style>

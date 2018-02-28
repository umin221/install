<template>
  <div style="background-color: #ebebeb;">
    <mt-header fixed title="故障记录">
      <fallback slot="left"></fallback>
      <mt-button slot="right">提交</mt-button>
    </mt-header>

    <div class="mint-content addService">
      <div class="addform">
        <mt-field label="产品条形码" type="text" placeholder="输入或扫码" class="textRight"></mt-field>
        <mt-cell class="require mint-field" title="所在省市区" placeholder="请选择"><i class="xs-icon icon-addr icon-right"></i></mt-cell>
        <mt-field class="block require" label="详细地址" placeholder="请输入详细地址..." type="textarea" rows="2"></mt-field>
        <mt-cell class="require mint-field" title="产品型号" placeholder="请选择" is-link>{{Type}}</mt-cell>
        <mt-cell class="mint-field require" title="故障现象" placeholder="请选择" is-link>{{subArea}}</mt-cell>
        <mt-cell class="mint-field require" title="责任划分">{{Area}}</mt-cell>
        <mt-field class="block" label="故障描述" v-model="ProductFlag" placeholder="详细描述或附加需求..." type="textarea" rows="3">
          <div style="line-height: 2rem"><i class="xs-icon icon-mic" style="float: right;"></i></div>
        </mt-field>
        <div>
          <div style="color: #777;font-size: 0.75rem;text-indent:0.75em;line-height: 40px">上传图片</div>
          <div style="text-indent:0.75em"><i class="xs-icon icon-attach"></i></div>
        </div>
      </div>
    </div>
  </div>
</template>
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
<script>
//  import api from '../api/api';
  export default {
    name: 'saveFault',
    created() {
    },
    data: () => {
      return {
        hideMore: false,
        ContactName: '',
        callPhone: '',
        Type: '',
        Area: '',
        subArea: '',
        Priority: '',
        Description: '',
        ProductFlag: '',
        startDate: ''
      };
    },
    methods: {
      submit() {
      }
    }
  };
</script>

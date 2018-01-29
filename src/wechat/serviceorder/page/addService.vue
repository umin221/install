<template>
  <div>
    <mt-header fixed title="创建维修服务">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content addService">
      <mt-field label="报修联系人" placeholder="请输入联系人" class="textRight"></mt-field>
      <mt-field label="联系电话" placeholder="请输入联系电话" class="textRight"></mt-field>
      <mt-cell title="联系人类型" placeholder="请选择" is-link></mt-cell>
      <mt-cell title="省市区" placeholder="请选择"  is-link></mt-cell>
      <mt-field class="block" label="详细地址" placeholder="请输入详细地址..." type="textarea" rows="2"></mt-field>
      <mt-cell title="故障现象" placeholder="请选择" is-link></mt-cell>
      <mt-cell title="故障分级"></mt-cell>
      <mt-field class="block" label="客服说明" placeholder="详细描述或附加需求..." type="textarea" rows="2"></mt-field>
      <mt-cell title="客户预约时间"  placeholder="请选择" is-link></mt-cell>
      <div class="addMore">
        <span>添加更多</span>
      </div>
      <div class="submitButton">
        <mt-button size="normal" type="danger" >提交</mt-button>
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
    .block{
      .mint-cell-wrapper{
        display: block!important;
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
    .submitButton,.addMore{
      @include disFlex();
    }
    .addMore{
      height: 50px;
      span{
        font-size: 0.2rem;
        color: red;
      }
    }
    .submitButton {
      button {
        width: 60%;
        border-radius: 20px;
      }
    }
  }



</style>
<script>
  export default {
    name: 'addService'
  };
</script>

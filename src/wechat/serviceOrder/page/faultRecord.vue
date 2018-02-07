<template>
  <div>
    <mt-header fixed title="故障记录">
      <fallback slot="left"></fallback>
      <mt-button slot="right">提交</mt-button>
    </mt-header>
    <div class="mint-content addService">
      <mt-field class="require" :readonly="true" label="产品条形码" placeholder="请输入名称"></mt-field>
      <mt-field class="require" :readonly="true" label="所在省市区" placeholder="请输入负责人"></mt-field>
      <mt-field label="联系电话" :readonly="true" placeholder="消息地址" type="tel"></mt-field>
      <mt-field class="require" :readonly="true" label="产品型号" placeholder="请输入手机号" type="tel"></mt-field>
      <mt-field class="require" :readonly="true" label="故障现象" placeholder="请输入地址"></mt-field>
      <mt-field class="require" :readonly="true" label="责任划分"></mt-field>
      <mt-field   label="故障描述"></mt-field>
      <mt-field   label="上传照片"></mt-field>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'faultRecord'
  };
</script>

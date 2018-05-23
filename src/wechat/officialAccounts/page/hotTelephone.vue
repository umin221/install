<template>
  <div style="background-color: #ebebeb;">
    <div class="mint-content">
      <div class="hotTelephone" @click="call=true">400-931-9898</div>
      <!--<div class="callExplain">
        <span>技术热线支持：</span>
        <span>7x24小时</span>
      </div>-->
      <cus-call number="400-931-9898" v-model="call"></cus-call>
    </div>
  </div>
</template>
<script>
  import cusCall from 'public/components/cus-call';
  const NameSpace = 'hotTelephone';
  export default {
    name: NameSpace,
    created() {
    },
    data: () => {
      return {
        call: false
      };
    },
    methods: {
    },
    components: {cusCall}
  };
</script>
<style lang="scss">
  .hotTelephone{
    height: 7rem;
    width: 7rem;
    border-radius: 50%;
    background-color: #df221f;
    margin: 4rem auto;
    color: #ffffff;
    line-height: 7rem;
    text-align: center;
    font-size: 0.9rem;
    position: relative;
  }
  .hotTelephone:before{
    height: 8rem;
    width: 8rem;
    border-radius: 50%;
    position: absolute;
    content: '';
    border: 2px solid #f0d1d9;
    top: -12px;
    left: -12px;
  }
  .hotTelephone:after{
    height: 9rem;
    width: 9rem;
    border-radius: 50%;
    position: absolute;
    content: '';
    border: 2px solid #FAECE1;
    top: -22px;
    left: -22px;
  }
  .callExplain{
    text-align: center;
    span{
      font-size: 0.9rem;
    }
  }
</style>

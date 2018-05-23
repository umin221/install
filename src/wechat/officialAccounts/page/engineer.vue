<template>
  <div class="engineer-down">
    <div class="kl-logo">
      <h3>KIN LONG</h3>
      <h3 class="logoC">坚朗</h3>
    </div>
    <div class="center-text">坚朗五金</div>
    <div class="explain">下载安装扫码APP，经审核后您就是坚朗委外人员了，大量工作机会等着你。</div>
    <div class="down-APP">
      <a style="text-decoration: none; color: white"  :href="downloadUrl"><mt-button>点击下载APP</mt-button></a>
    </div>
    <div class="company">坚朗五金制品有限公司</div>
  </div>
</template>
<script type="es6">
  const NameSpace = 'engineer';

  // app 下载id
  let app = { DEV: '550', SIT: '550', UAT: '600' };
  //
  export default {
    name: NameSpace,
    data: () => {
      return {
        downloadUrl: `https://mob.kinlong.cn:10443/xsimple/jd/${app[global['project'].env]}`
      };
    }
  };
</script>
<style lang="scss">
  .engineer-down {
    background-color: white!important;

    .kl-logo{
      width: 100px;
      height: 100px;
      border: 1px solid #00599f;
      margin: 3rem auto;
      border-radius: 10px;
      background-color: #00599f;
      box-sizing: border-box;
      padding-top: 20px;

      h3{
        font-size: 18px;
        text-align: center;
        color: #ffffff;
        line-height: 0;
      }
      .logoC{
        font-size: 24px;
      }
    }
    .center-text{
      text-align: center;
      margin-top: -2.5rem;
    }
    .explain{
      font-size: 16px;
      width: 70%;
      color: grey;
      margin: 3.5rem auto;
    }
    .down-APP{
      position: absolute;
      width: 100%;
      bottom: 50px;
      button{
        background-color: $theme-color;
        color: #ffffff;
        width: 50%;
        margin-left: 25%;
      }
    }
    .company{
      position: absolute;
      bottom: 20px;
      width: 100%;
      text-align: center;
      font-size: 10px;
      color: $gray-minor-font;
    }
  }
</style>

<template>
  <div>
    <mt-header fixed title="图标库">
      <fallback slot="left"></fallback>
    </mt-header>

    <div class="mint-content">
      <p v-for="i in 100" :class="'icon'+ i">\E60{{i}}</p>
    </div>
  </div>
</template>

<script type="application/javascript">
  export default {
  };
</script>

<style>
    .icon1::before {
      font-family: "mintui";
      content: '\E601';
      font-size: 20px;
    }

    .icon2::before {
      font-family: "mintui";
      content: '\E602';
      font-size: 20px;
    }

    .icon3::before {
      font-family: "mintui";
      content: '\E603';
      font-size: 20px;
    }
    .icon4::before {
      font-family: "mintui";
      content: '\E604';
      font-size: 20px;
    }
    .icon5::before {
      font-family: "mintui";
      content: '\E605';
      font-size: 20px;
    }
    .icon6::before {
      font-family: "mintui";
      content: '\E606';
      font-size: 20px;
    }
    .icon7::before {
      font-family: "mintui";
      content: '\E607';
      font-size: 20px;
    }
    .icon8::before {
      font-family: "mintui";
      content: '\E608';
      font-size: 20px;
    }
    .icon9::before {
      font-family: "mintui";
      content: '\E609';
      font-size: 20px;
    }
    .icon10::before {
      font-family: "mintui";
      content: '\E610';
      font-size: 20px;
    }
    .icon11::before {
      font-family: "mintui";
      content: '\E611';
      font-size: 20px;
    }

    .icon12::before {
      font-family: "mintui";
      content: '\E612';
      font-size: 20px;
    }

    .icon13::before {
      font-family: "mintui";
      content: '\E613';
      font-size: 20px;
    }
    .icon14::before {
      font-family: "mintui";
      content: '\E614';
      font-size: 20px;
    }
    .icon15::before {
      font-family: "mintui";
      content: '\E615';
      font-size: 20px;
    }
    .icon16::before {
      font-family: "mintui";
      content: '\E616';
      font-size: 20px;
    }
    .icon17::before {
      font-family: "mintui";
      content: '\E617';
      font-size: 20px;
    }
    .icon18::before {
      font-family: "mintui";
      content: '\E618';
      font-size: 20px;
    }
    .icon19::before {
      font-family: "mintui";
      content: '\E619';
      font-size: 20px;
    }
</style>

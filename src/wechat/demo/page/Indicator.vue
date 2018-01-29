<template>
  <div>
    <mt-header fixed title="Indicator">
      <fallback slot="left"></fallback>
    </mt-header>
    <div style="margin-top: 100px;" class="IndicatorCon">
      <mt-button type="default" @click.native="handleClick(1)">点击弹出 Indicator</mt-button>
      <mt-button type="default" @click.native="handleClick(2)">点击弹出 spinner</mt-button>
      <mt-button type="default" @click.native="handleClick(3)">点击弹出有蚊子的 Indicator</mt-button>
    </div>
  </div>
</template>

<script type="application/javascript">
  import api from '../api/api';
  import {mapState, mapActions} from 'vuex';
  import { Indicator } from 'mint-ui';
  const NameSpace = 'index';
  export default {
    name: NameSpace,
    created: () => {
      api.get({
        key: 'toastClick1',
        callback: function(data) {
          console.dir(data);
        }
      });
    },
    data: () => {
      return {
        active: 'tab-container1'
      };
    },
    computed: {
      ...mapState(NameSpace, ['value'])
    },
    methods: {
      ...mapActions(NameSpace, ['handleClick']),
      handleClick(status) {
        if (status === 1) {
          Indicator.open();
          setTimeout(() => {
            Indicator.close();
          }, 2000);
        } else if (status === 2) {
          Indicator.open({
            spinnerType: 'fading-circle'
          });
          setTimeout(() => {
            Indicator.close();
          }, 2000);
        } else if (status === 3) {
          Indicator.open('加载中...');
          setTimeout(() => {
            Indicator.close();
          }, 2000);
        }
      }
    }
  };
</script>
<style lang="scss">
  .IndicatorCon {
    .mint-button--normal {
      display: inline-block;
      padding: 0 12px;
      width: 96%;
      margin: 15px 10px;
    }
    .icon-success {
      font-family: "mintui";
      content: '\E602';
      font-size: 20px;
    }
  }
</style>

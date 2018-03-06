<template>
  <div>
    <mt-header fixed title="故障记录">
      <fallback slot="left"></fallback>
      <mt-button slot="right">提交</mt-button>
    </mt-header>

    <div class="mint-content">
      <div class="saveFault">
        <mt-cell title="单据编号：" ></mt-cell>
        <mt-cell title="移交日期："></mt-cell>
        <mt-cell class="require" title="是否保修范围" is-link></mt-cell>
        <mt-cell title="维修配件"></mt-cell>
        <div class="servesParts">
          <div class="Parts">
            <mt-switch v-model="value">保外</mt-switch>
            <div class="PartsDetail"><div>浴室锁</div><div>￥100</div><div>X1</div></div>
          </div>
          <div class="Parts">
            <div><div>上门费</div></div>
          </div>
          <div class="addBtn">
            <mt-button type="primary"><i class="xs-icon icon-add"></i>添加配件</mt-button>
            <mt-button type="primary"><i class="xs-icon icon-add"></i>添加上门费</mt-button>
          </div>
        </div>
        <mt-cell class="require" title="总费用"></mt-cell>
        <mt-cell class="require" title="附件"></mt-cell>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  .saveFault{
    .servesParts{
      .Parts{
        line-height: 2.5rem;
        display: flex;
        .mint-switch{
          width: 40%;
        }
        .PartsDetail{
          display: flex;
          width: 60%;
          justify-content: space-around;
          background-image: linear-gradient(0deg, #d9d9d9, #d9d9d9 0%, transparent 5%);
        }
      }
      .addBtn{
        display: flex;
        justify-content: space-around;
        button{
          width:40%;
          i{
            font-size: 0.5rem;
          }
        }
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
        isSwitch: false
      };
    },
    methods: {
      submit() {
      }
    }
  };
</script>

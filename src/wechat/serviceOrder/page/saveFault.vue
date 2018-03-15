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
        <mt-cell class="require" title="是否保修范围" @click.native="showBox = !showBox" is-link>{{isBn}}</mt-cell>
        <mt-cell title="维修配件"><i class="xs-icon icon-arrow-down"></i></mt-cell>
        <div class="servesParts">
          <div class="Parts">
            <mt-switch v-model="value">{{value?"保内":"保外"}}</mt-switch>
            <div class="PartsDetail"><div>浴室锁</div><div class="toRed">￥100</div><div>X1</div></div>
          </div>
          <div class="Parts">
            <div style="width: 30%"></div>
            <div class="PartsDetail"><div>上门费</div><div div class="toRed">￥100</div><div></div></div>
          </div>
          <div class="addBtn">
            <mt-button type="primary" @click.native="toTranslated"><i class="xs-icon icon-add"></i>添加配件</mt-button>
            <mt-button type="primary" v-show="isBn === '保外'"><i class="xs-icon icon-add" ></i>添加上门费</mt-button>
          </div>
        </div>
        <mt-cell class="require" title="总费用"></mt-cell>
        <mt-cell class="require" title="附件"></mt-cell>
        <div style="background-color: #ffffff">
          <div style="color: #777;font-size: 0.75rem;text-indent:0.75em;line-height: 40px">上传图片</div>
          <div style="text-indent:0.75em"><i class="xs-icon icon-attach"></i></div>
        </div>
        <mt-popup v-if="showBox" v-model="showBox" position="bottom" style="width: 100%">
          <menuBox @my-enter="enter" @my-cancel="cancel" :slots="slots"></menuBox>
        </mt-popup>
      </div>
    </div>
  </div>
</template>
<script>
//  import api from '../api/api';
  import menuBox from '../../../public/components/cus-menu.vue';
  export default {
    name: 'saveFault',
    created() {
    },
    data: () => {
      return {
        isSwitch: false,
        value: false,
        isBn: '',
        showBox: false,
        slots: [{flex: 1, values: ['保内', '保外'], className: 'slot1', textAlign: 'center'}]
      };
    },
    methods: {
      submit() {
      },
      toTranslated() {
        this.$router.push('searchTrans');
      },
      enter(val) {
        this.showBox = !this.showBox;
        this.isBn = val[0];
      },
      cancel() {
        this.showBox = !this.showBox;
      }
    },
    components: {menuBox}
  };
</script>
<style lang="scss">
  .saveFault{
    .servesParts{
      .Parts{
        font-size: 0.75rem;
        display: flex;
        line-height: 2.5rem;
        .mint-switch{
          width: 30%;
        }
        .PartsDetail{
          align-items: center;
          display: flex;
          width: 70%;
          justify-content: space-around;
          background-image: linear-gradient(0deg, #d9d9d9, #d9d9d9 0%, transparent 5%);
          div{
            width: 30%;
            text-align: center;
          }
        }
      }
      .addBtn{
        height: 5rem;
        display: flex;
        justify-content: space-around;
        align-items: center;
        button{
          width:35%;
          i{
            font-size: 0.5rem;
          }
        }
      }
    }
    .toRed {
      color: red;
    }
  }
</style>

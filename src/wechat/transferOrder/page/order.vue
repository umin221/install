<template>
    <div>
      <!--header-->
      <mt-header fixed title="安装交接单详情">
        <fallback slot="left"></fallback>
        <mt-button slot="right"
                   @click.native="saveFn">保存</mt-button>
      </mt-header>

      <!--detail-->
      <div class="mint-content">
        <div class="order">
          <mt-cell title="开孔方式"
                   @click.native="showBox=true"
                   :value="form['Sales Type']"
                   is-link></mt-cell>
          <mt-cell title="门厂是否安装锁体"
                   @click.native="showBox=true"
                   :value="form['Last Name']"
                   is-link></mt-cell>
          <mt-cell title="是否安装替代锁"
                   @click.native="showBox=true"
                   :value="form['Last Name']"
                   is-link></mt-cell>
        </div>

        <div class="lock-row">
          <lock-row title="锁芯部分" @click="toRowFn">
            <mt-cell v-for="row in data.row" class="lock-row-cell"
                     @click.native="toRowFn(row)"
                     :key="row['Id']"
                     is-link>
              <div class="co-flex co-jc" slot="title">
                <span class="co-f1">{{row['title']}}</span>
                <span class="co-f1">开向:{{row['direction']}}</span>
                <span class="co-f1">数量:{{row['number']}}</span>
              </div>
            </mt-cell>
          </lock-row>
          <lock-row title="锁体部分*真锁" @click="toRowFn">
            <mt-cell v-for="row in data.row" class="lock-row-cell"
                     @click.native="toRowFn(row)"
                     :key="row['Id']"
                     is-link>
              <div class="co-flex co-jc" slot="title">
                <span class="co-f1">{{row['title']}}</span>
                <span class="co-f1">开向:{{row['direction']}}</span>
                <span class="co-f1">数量:{{row['number']}}</span>
              </div>
            </mt-cell>
          </lock-row>
        </div>

      </div>

      <!--buttons-->
      <button-group>
        <mt-button v-show="isTransfer" @click.native="rejectFn">转发门厂确认</mt-button>
        <mt-button v-show="isTransfer" type="primary"
                   @click.native="confirmFn">发起安装</mt-button>
        <mt-button v-show="!isTransfer" type="primary"
                   @click.native="toRowFn">确认提交</mt-button>
      </button-group>

      <!--popup-->
      <mt-popup v-show="showBox" v-model="showBox" position="bottom">
        <menuBox @my-enter="enter"
                 @my-cancel="showBox=false"
                 :lovType="lovType"
                 :slots="slots"></menuBox>
      </mt-popup>
    </div>
</template>

<script type="es6">
  import {mapState, mapActions} from 'vuex';
  import menuBox from 'public/components/cus-menu.vue';
  import lockRow from '../components/cusLockRow';

  let NameSpace = 'order';
  export default {
    name: NameSpace,
    components: {lockRow, menuBox},
    data() {
      return {
        data: {
          row: [{
            id: '1',
            title: 'SZ6010指纹锁',
            direction: '左内开',
            number: '500'
          }, {
            id: '2',
            title: 'SZ6010指纹锁',
            direction: '左内开',
            number: '500'
          }]
        },
        slots: [
          {flex: 1, values: ['是', '否'], className: 'slot1', textAlign: 'center'}
        ],
        showBox: false
      };
    },
    computed: {
      ...mapState(NameSpace, ['form']),
      isTransfer() {
        return true;
      }
    },
    methods: {
      ...mapActions(NameSpace, ['submit', 'confirm']),
      // 订单行
      toRowFn() {
        this.$router.push('lockBody');
      },
      // 订单行保存
      saveFn() {

      },
      enter(values, type) {
        let me = this;
        me.showBox = false;
        console.log(values);
      }
    }
  };
</script>

<style lang="scss">
  .order {
    .mint-cell {
      .mint-cell-title {
        color: $gray-minor;
      }
    }
  }

  .lock-row {
    margin-top: 10px;

    .lock-row-cell {
      background-color: $bg-light;
    }
  }

  .mint-content {
    margin-bottom: 2.8rem;
  }
</style>

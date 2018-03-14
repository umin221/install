<template>
    <div>
      <!--header-->
      <mt-header fixed title="安装订单产品收集">
        <fallback slot="left"></fallback>
        <mt-button slot="right"
                   @click.native="saveFn">保存</mt-button>
      </mt-header>

      <!--detail-->
      <div class="mint-content">
        <div class="order">
          <mt-cell title="开孔方式"
                   @click.native="showLovFn('KL Hole Type')"
                   :value="order['KL Hole Type']"
                   is-link></mt-cell>
          <mt-cell title="门厂是否安装锁体"
                   @click.native="showLovFn('KL Delivery Check Box 1')"
                   :value="box1"
                   is-link></mt-cell>
          <mt-cell title="是否安装替代锁"
                   @click.native="showLovFn('KL Delivery Check Box 2')"
                   :value="box2"
                   is-link></mt-cell>
        </div>

        <div class="lock-line">
          <lock-line title="锁体" @click="toLineFn(undefined, '锁体')">
            <mt-cell v-for="line in lines" class="lock-line-cell"
                     v-if="line['KL Product Type']==='锁芯'"
                     @click.native="toLineFn(line)"
                     :key="line['Id']"
                     is-link>
              <div class="co-flex co-jc" slot="title">
                <span class="co-f1">{{line['KL Product Model No']}}</span>
                <span class="co-f1">开向:{{line['KL Hole Direction']}}</span>
                <span class="co-f1">数量:{{line['Quantity Requested']}}</span>
              </div>
            </mt-cell>
          </lock-line>
          <lock-line title="面板" @click="toLineFn(undefined, '面板')">
            <mt-cell v-for="line in lines" class="lock-line-cell"
                     v-if="line['KL Product Type']==='锁体'"
                     @click.native="toLineFn(line)"
                     :key="line['Id']"
                     is-link>
              <div class="co-flex co-jc" slot="title">
                <span class="co-f1">{{line['KL Product Model No']}}</span>
                <span class="co-f1">开向:{{line['KL Hole Direction']}}</span>
                <span class="co-f1">数量:{{line['Quantity Requested']}}</span>
              </div>
            </mt-cell>
          </lock-line>
        </div>

      </div>

      <!--buttons-->
      <button-group>
        <mt-button v-show="isTransfer"
                   :class="{'disable':!transferAble}"
                   @click.native="transferFn">转门厂技术</mt-button>
        <mt-button v-show="isTransfer" type="primary"
                   :class="{'disable':!submitAble}"
                   @click.native="submitFn">发起安装</mt-button>
        <mt-button v-show="!isTransfer" type="primary"
                   @click.native="toLineFn">确认提交</mt-button>
      </button-group>

      <!--popup-->
      <mt-popup v-model="showBox" position="bottom">
        <menu-box @my-enter="enter" vk="Value"
                 @my-cancel="showBox=false"
                 :type="lovType"
                 :slots="slots"></menu-box>
      </mt-popup>
    </div>
</template>

<script type="es6">
  import {mapActions} from 'vuex';
  import menuBox from 'public/components/cus-menu.vue';
  import lockLine from '../components/cusLockLine';

  let NAMESPACE = 'order';
  // mapp
  let mapp = config.mapp;

  export default {
    name: NAMESPACE,
    components: {lockLine, menuBox},
    created() {
      let me = this;
      me.order = me.$route.query;
      // 取 lov 开孔方式
      me.getLov({
        type: 'KL_HOLE_TYPE',
        success: data => {
          mapp.option['KL Hole Type'] = data.items;
        }
      });
      // 获取订单行
      if (me.order.Id) {
        me.queryOrderLines({
          data: {
            'Order Header Id': me.order.Id
          },
          success: data => {
            me.lines = data.items ? data.items : KND.Util.toArray(data);
          }
        });
      }
    },
    data() {
      return {
        slots: [
          {flex: 1, values: [], className: 'slot1', textAlign: 'center'}
        ],
        showBox: false,
        lovType: '',
        lines: '',
        order: {},
        transferAble: true,
        submitAble: true
      };
    },
    computed: {
      // 是否可发起安装状态
      isTransfer() {
        return true;
      },
      box1() {
        return mapp.kv[this.order['KL Delivery Check Box 1']];
      },
      box2() {
        return mapp.kv[this.order['KL Delivery Check Box 2']];
      }
    },
    methods: {
      ...mapActions(NAMESPACE, ['submit', 'save', 'update', 'queryOrderLines', 'runProcess']),
      ...mapActions('app', ['getLov']),
      // 订单行
      toLineFn(line = {}, type) {
        let isPanel = (line['KL Product Type'] || type) === '面板';
        // 填充订单id，保存编辑行时需要
        line['Order Header Id'] = this.order.Id;
        this.$router.push({
          path: 'orderLine',
          query: {
            line: line,
            isPanel: isPanel
          }
        });
      },
      // 选择对话框
      showLovFn(type) {
        this.lovType = type;
        this.showBox = true;
        this.slots[0].values = mapp.option[type];
      },
      // 订单行保存
      saveFn() {
        let me = this;
        let order = me.order;
        if (order.Id) {
          delete order['Link'];
          me.update(order);
        } else {
          me.save(order);
        }
      },
      // 选择确认
      enter(values, type) {
        let me = this;
        me.showBox = false;
        // 选择填充
        this.order[type] = values[0][mapp.optionKey[type]];
      },
      // 转发门厂技术
      transferFn() {
        this.runProcess({
          data: {
            'ProcessName': 'KL Install Order Transfer Process',
            'Object Id': this.order.Id
          },
          success: data => {
            if (!data.ERROR) {
              Toast('转发成功');
              this.transferAble = false;
            }
          }
        });
      },
      // 提交安装订单
      submitFn() {
        this.runProcess({
          data: {
            'ProcessName': 'KL Product Model No',
            'Object Id': this.order.Id
          },
          success: data => {
            if (!data.ERROR) {
              Toast('提交成功');
              this.submitAble = false;
            }
          }
        });
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

      .mint-cell-value {
        color: $black-base;
      }
    }
  }

  .lock-line {
    margin-top: 10px;

    .lock-line-cell {
      background-color: $bg-light;
    }
  }

  .mint-content {
    margin-bottom: 2.8rem;
  }
</style>

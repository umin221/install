<template>
    <div>
      <!--header-->
      <mt-header fixed title="安装订单产品收集">
        <fallback slot="left"></fallback>
        <mt-button v-show="editable"
                   slot="right"
                   @click.native="saveFn">保存</mt-button>
      </mt-header>

      <!--detail-->
      <div class="mint-content" :class="{'disable': !editable}">
        <div class="order">
          <mt-cell title="开孔方式"
                   @click.native="showLovFn('KL Hole Type')"
                   :value="order['KL Hole Type']"
                   is-link></mt-cell>
          <mt-cell title="门厂是否安装锁体">
            <mt-switch v-model="box1"></mt-switch>
          </mt-cell>
          <mt-cell title="是否安装替代锁">
            <mt-switch v-model="box2"></mt-switch>
          </mt-cell>
        </div>

        <div class="lock-line">
          <lock-line title="锁体" @click="toLineFn(undefined, 'Lock Body')">
            <mt-cell-swipe v-for="(line, index) in lines" class="lock-line-cell enable" ref="body"
                     v-if="line['KL Product Type LIC']==='Lock Body'"
                     @click.native="toLineFn(line)"
                     :key="line['Id']"
                     :right="getSwipeBtn(line, index)"
                     is-link>
              <div class="co-flex co-jc" slot="title">
                <span class="co-f1 icon-copy" @click.stop="copyFn(line)"></span>
                <span class="co-f2">{{line['KL Product Model No']}}</span>
                <span class="co-f2">开向:{{line['KL Hole Direction']}}</span>
                <span class="co-f2">数量:{{line['Quantity Requested']}}</span>
              </div>
            </mt-cell-swipe>
          </lock-line>
          <lock-line title="面板" @click="toLineFn(undefined, 'Panel')">
            <mt-cell-swipe v-for="(line, index) in lines" class="lock-line-cell enable" ref="panel"
                     v-if="line['KL Product Type LIC'] === 'Panel'"
                     @click.native="toLineFn(line)"
                     :key="line['Id']"
                     :right="getSwipeBtn(line, index)"
                     is-link>
              <div class="co-flex co-jc" slot="title">
                <span class="co-f1 icon-copy" @click.stop="copyFn(line)"></span>
                <span class="co-f2">{{line['KL Product Model No']}}</span>
                <span class="co-f2">开向:{{line['KL Hole Direction']}}</span>
                <span class="co-f2">数量:{{line['Quantity Requested']}}</span>
              </div>
            </mt-cell-swipe>
          </lock-line>
        </div>

        <!--buttons-->
        <button-group v-show="isDraft">
          <mt-button v-show="showTransfer" :class="{'disable': !lineComplete}"
                     @click.native="transferFn">转门厂技术</mt-button>
          <mt-button v-show="showSubmit" type="primary"
                     :class="{'disable': !lineComplete}"
                     @click.native="submitFn">发起安装</mt-button>
        </button-group>

      </div>

      <!--popup-->
      <mt-popup v-model="showBox" position="bottom">
        <menu-box @my-enter="enter" vk="Value"
                 @my-cancel="showBox = false"
                 :type="lovType"
                 :slots="slots"></menu-box>
      </mt-popup>
    </div>
</template>

<script type="es6">
  import {mapState, mapActions, mapMutations} from 'vuex';
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
      let query = me.$route.query;
      let order = KND.Util.parse(query.order);

      me.setOrder(order);
      // 取 lov 开孔方式
      me.getLov({
        type: 'KL_HOLE_TYPE',
        success: data => {
          mapp.option['KL Hole Type'] = data.items;
        }
      });
      // 获取订单行
      if (me.order.Id) {
        me.queryLines({
          'Order Header Id': me.order.Id
        });
      };
    },
    data() {
      return {
        slots: [
          {flex: 1, values: [], className: 'slot1', textAlign: 'center'}
        ],
        showBox: false,
        lovType: '',
        value: false,
        transferAble: true,
        submitAble: true
      };
    },
    computed: {
      ...mapState('index', ['isTeam']),
      ...mapState(NAMESPACE, ['order', 'lines']),
      // 是否草稿状态
      isDraft() {
        let status = this.order['Status'];
        return !status || status === '草稿';
      },
      // 是否可编辑
      editable() {
        return this.isDraft && !this.isTeam;
      },
      // 是否显示 发起提交 按钮
      showSubmit() {
        return this.isDraft && !this.showTransfer;
      },
      // 是否显示 转发门厂技术 按钮
      showTransfer() {
        let me = this;
        return (me.order['KL Hole Type'] === '门厂开孔') || (me.order['KL Delivery Setter Full Name'] !== me.$route.query.DFEngineer);
      },
      // 是否安装锁体 switch
      box1: {
        get() {
          return this.order['KL Delivery Check Box 1'] === 'Y';
        },
        set(flag) {
          this.order['KL Delivery Check Box 1'] = flag ? 'Y' : 'N';
        }
      },
      // 是否安装替代锁 switch
      box2: {
        get() {
          return this.order['KL Delivery Check Box 2'] === 'Y';
        },
        set(flag) {
          this.order['KL Delivery Check Box 2'] = flag ? 'Y' : 'N';
        }
      },
      // 行是否完成
      lineComplete() {
        let panel = false;
        let body = false;
        let type;
        return Array.prototype.some.call(this.lines, function(l) {
          type = l['KL Product Type LIC'];
          if (type === 'Lock Body') body = true;
          if (type === 'Panel') panel = true;
          return panel && body;
        });
      },
      swiperRight() {

      }
    },
    methods: {
      ...mapActions(NAMESPACE, ['save', 'update', 'queryLines', 'runProcess', 'delete']),
      ...mapActions('app', ['getLov']),
      ...mapMutations(NAMESPACE, ['setOrder']),
      getSwipeBtn(line, index) {
        return this.editable ? [{
          content: '删除',
          style: { background: 'red', color: '#fff', 'font-size': '15px', 'line-height': '54px' },
          handler: () => this.deleteFn(line, index)
        }] : [];
      },
      // 订单行
      toLineFn(line = {}, type) {
        let me = this;
        let order = me.order;
        // 是否面板
        let isPanel = (line['KL Product Type LIC'] || type) === 'Panel';
        // 填充订单id，保存编辑行时需要
        line['Order Header Id'] = order.Id;

        // 跳转订单行
        let toLine = () => {
          me.$router.push({
            path: 'orderLine',
            query: {
              line: JSON.stringify(line),
              isPanel: isPanel,
              editable: this.editable
            }
          });
        };

        // 跳转订单行
        if (line['Order Header Id']) {
          toLine();
        } else {
          // 保存订单头
          me.save({
            data: order,
            success: data => { // data => {"Object Id":"1-2BSEEOC3"}
              line['Order Header Id'] = data['Object Id'];
              order.Id = data['Object Id'];
              KND.Util.setParam('order', JSON.stringify(order));
              toLine();
            }
          });
        }
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
          me.save({data: order});
        }
      },
      // 选择确认
      enter(values, type) {
        let me = this;
        me.showBox = false;
        // 选择填充
        this.order[type] = values[0]['Value'];
      },
      // 转发门厂技术
      transferFn() {
        this.runProcess({
          data: {
            body: {
              'ProcessName': 'KL Install Order Transfer Process',
              'Object Id': this.order.Id
            }
          },
          success: data => {
            if (!data.ERROR) {
              Toast('转发成功');
              this.order['Status'] = '门厂工程师确认中';
            }
          }
        });
      },
      // 提交安装订单
      submitFn() {
        this.runProcess({
          data: {
            body: {
              'ProcessName': 'KL Product Model No',
              'Object Id': this.order.Id
            }
          },
          success: data => {
            if (!data.ERROR) {
              Toast('提交成功');
            }
          }
        });
      },
      // Delete Install Order Line
      deleteFn(line, index) {
        this.delete({
          id: line.Id,
          index: index
        });
      },
      // Copy line
      copyFn(line) {
        MessageBox.confirm('复制此订单行记录？', '请确认').then(action => {
          let isPanel = line['KL Product Type LIC'] === 'Panel';
          delete line.Id;
          this.$router.push({
            path: 'orderLine',
            query: {
              line: JSON.stringify(line),
              isPanel: isPanel,
              editable: this.editable
            }
          });
        });
      }
    }
  };
</script>

<style lang="scss">
  .order {
    .mint-cell {
      .mint-cell-title {
        line-height: 30px;
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

  .disable {
    .cus-lock:before {
      content: '';
    }
  }
</style>

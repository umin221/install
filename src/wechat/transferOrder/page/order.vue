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
      <div class="mint-content order" :class="{'disable': !editable}" :data-len="len">
        <div>
          <cus-field label="开孔方式" tag="开孔方式"
                   v-valid.require
                   @click.native="showLovFn('KL Hole Type')"
                   :value="order['KL Hole Type']"
                   is-link></cus-field>
          <cus-field label="门厂名称" tag="门厂名称"
                   v-if="isDoorFactoryOpen"
                   v-valid.require
                   @click.native="$router.push('doorFactory')"
                   :data-value="factory"
                   :value="order['KL Delivery Partner Name']"
                   is-link></cus-field>
          <mt-cell title="是否门厂安装锁体" v-show="isProject && isDoorFactoryOpen">
            <mt-switch v-model="box1"></mt-switch>
          </mt-cell>
          <mt-cell title="是否安装替代锁" v-show="isProject">
            <mt-switch v-model="box2"></mt-switch>
          </mt-cell>
        </div>

        <div class="lock-line">
          <lock-line v-for="(g, key) in group"
                     :title="g.label"
                     :key="key"
                     :add="g.add"
                     @click="toLineFn(undefined, key)">
            <mt-cell-swipe v-for="(line, index) in getRows(g.group)" class="lock-line-cell enable"
                     @click.native="toLineFn(line)"
                     :key="line['Id']"
                     :right="getSwipeBtn(line, index)"
                     is-link>
              <div class="co-flex co-jc" slot="title">
                <span v-show="editable" class="co-f1 icon-copy" @click.stop="copyFn(line)"></span>
                <span class="co-f2">{{line['KL Product Model No']}}</span>
                <span class="co-f2" v-show="line['KL Hole Direction']">开向:{{line['KL Hole Direction']}}</span>
                <span class="co-f2">数量:{{line['Quantity Requested']}}</span>
              </div>
            </mt-cell-swipe>
          </lock-line>
        </div>

        <!--buttons-->
        <button-group v-show="editable">
          <mt-button v-show="!showSubmit"
                     :class="{'disable': !lineComplete}"
                     @click.native="transferFn">转门厂技术</mt-button>
          <mt-button v-show="showSubmit"
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
  import Vue from 'vue';
  import vp from 'public/plugin/validator';
  import menuBox from 'public/components/cus-menu.vue';
  import cusField from 'public/components/cus-field';
  import lockLine from '../components/cusLockLine';
  // use plugin
  Vue.use(vp);

  let NAMESPACE = 'order';
  // mapp
  let mapp = config.mapp;

  export default {
    name: NAMESPACE,
    components: {lockLine, menuBox, cusField},
    created() {
      let me = this;
      let query = me.$route.query;
      let sOrder = KND.Session.get('order');
      let order = KND.Util.parse(sOrder || query.order);

      // 是否工程订单 工程/零星
      me.isProject = query.salesType === '工程';
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
      // 会话无订单信息，清空门厂选择
      if (!sOrder) {
        this.selFactory('');
      };
    },
    beforeDestroy() {
      // 缓存订单
      KND.Session.set('order', JSON.stringify(this.order));
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
        submitAble: true,
        // 锁体
        lockBody: [],
        // 面板
        panels: [],
        // vp
        VP003: [],
        // 假锁
        falseLock: [],
        // 其他配件
        others: [],
        // 是否工程订单 工程/零星
        isProject: false
      };
    },
    computed: {
      ...mapState('index', ['isTeam', 'isEngineer']),
      ...mapState('doorFactory', ['select']),
      ...mapState(NAMESPACE, ['order', 'lines']),
      // 安装人员 并且 非查看团队的， 状态不是 草稿 或者 驳回的订单 可编辑
      editable() {
        let status = this.order['Calculated Order Status'];
        return (!status || mapp.editOrderStatus.indexOf(status) !== -1) && !this.isTeam && this.isEngineer;
      },
      // 是否门厂开孔
      isDoorFactoryOpen() {
        let isDoorFactoryOpen = this.order['KL Hole Type'] === '门厂开孔';
        if (!isDoorFactoryOpen) this.box1 = false;
        return isDoorFactoryOpen;
      },
      // 是否显示 发起提交 按钮
      showSubmit() {
        let me = this;
        let info = config.userInfo || {};
        return (!me.isDoorFactoryOpen) || (me.order['KL Delivery Partner Owner Id'] === info.Id);
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
        return this.panels.length && this.lockBody.length;
      },
      // 订单行
      group() {
        return mapp.code2group;
      },
      len() {
        let me = this;
        let lines = me.lines;
        let c2g = mapp.code2group;
        me['lockBody'] = []; // 锁体
        me['panels'] = []; // 面板
        me['VP003'] = []; // vp
        me['falseLock'] = []; // 假锁
        me['others'] = []; // 其他配件
        for (let i = 0, len = lines.length; i < len; i++) {
          let line = lines[i];
          // 无分类 默认配件
          let g = c2g[line['KL Product Type LIC']] || c2g['Other'];
          me[g.group].push(line);
        };
        return lines.length;
      },
      factory() {
        // 更换门厂
        let select = this.select;
        if (!select) return;
        let name = select.Name;
        this.order['KL Delivery Partner Id'] = select.Id;
        this.order['KL Delivery Partner Name'] = name;
        return name;
      }
    },
    methods: {
      ...mapActions(NAMESPACE, ['save', 'update', 'queryLines', 'runProcess', 'delete']),
      ...mapActions('app', ['getLov']),
      ...mapMutations(NAMESPACE, ['setOrder']),
      ...mapMutations('doorFactory', ['selFactory']),
      getRows(type) {
        return this[type];
      },
      getSwipeBtn(line, index) {
        return this.editable ? [{
          content: '删除',
          style: { background: 'red', color: '#fff', 'font-size': '15px', 'line-height': '54px' },
          handler: () => this.deleteFn(line)
        }] : [];
      },
      // 订单行
      toLineFn(line = {}, type) {
        let me = this;
        // 跳转配件 或 其他订单行(面板、锁体、假锁)
        let path = line['KL Product Type LIC'] === 'Other' ? 'fitting' : 'orderLine';
        // 填充订单id，保存编辑行时需要
        line['Order Header Id'] = me.order.Id;
        me.$router.push({
          path: path,
          query: {
            line: JSON.stringify(line),
            type: line['KL Product Type LIC'] || type,
            editable: me.editable,
            holeType: me.order['KL Hole Type']
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
      saveFn(callback) {
        if (!KND.Util.isFunction(callback)) {
          callback = data => {
            if (data.items) {
              Toast('保存成功');
            }
          };
        };
        let me = this;
        let order = me.order;
        // 表单验证
        tools.valid.call(this, () => {
          if (order.Id) {
            delete order['Link'];
            me.update({
              data: order,
              success: callback
            });
          } else {
            // me.save({data: order});
            MessageBox('保存失败，订单不存在！');
          }
        });
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
        let me = this;
        MessageBox.confirm('是否转发门厂确认？', '请确认').then(action => {
          let id = me.order.Id;
          // 保存订单
          me.saveFn(data => {
            // 转发门厂
            me.runProcess({
              data: {
                body: {
                  'ProcessName': 'KL Install Order Transfer Process',
                  'Object Id': id
                }
              },
              success: data => {
                tools.success(data, {
                  back: true,
                  successTips: '转发成功'
                });
              }
            });
          });
        });
      },
      // 提交安装订单
      submitFn() {
        let me = this;
        MessageBox.confirm('是否确认提交审批？', '请确认').then(action => {
          let id = me.order.Id;
          // 保存订单
          me.saveFn(data => {
            // 提交订单
            me.runProcess({
              data: {
                body: {
                  'ProcessName': 'KL Install Order Submit Process',
                  'Object Id': id
                }
              },
              success: data => {
                tools.success(data, {
                  back: true,
                  successTips: '提交成功'
                });
              }
            });
          });
        });
      },
      // Delete Install Order Line
      deleteFn(line) {
        this.delete(line.Id);
      },
      // Copy line
      copyFn(line) {
        let me = this;
        MessageBox.confirm('复制此订单行记录？', '请确认').then(action => {
          // 复制只修改id，其他字段拷贝
          line.Id = KND.Util.now();
          // 跳转配件 或 其他订单行(面板、锁体、假锁)
          let path = line['KL Product Type LIC'] === 'Other' ? 'fitting' : 'orderLine';
          // 缓存订单
          KND.Session.set('order', JSON.stringify(me.order));
          me.$router.push({
            path: path,
            query: {
              line: JSON.stringify(line),
              type: line['KL Product Type LIC'],
              editable: me.editable,
              holeType: me.order['KL Hole Type']
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

    .cus-group-button {
      z-index: 2;
    }
  }

  .lock-line {
    margin-top: 10px;

    .lock-line-cell {
      background-color: $bg-light;
    }
  }

  .disable {
    .cus-lock:before {
      content: '';
    }
  }
</style>

<template>
    <div>
      <!--header-->
      <mt-header fixed :title="title">
        <fallback slot="left"></fallback>
      </mt-header>

      <!--detail-->
      <div class="mint-content line" :data-date="date" :class="{disable: !editable}">
        <cus-field label="产品型号" tag="产品型号" class="disable"
                   @click.native="showLovFn('agreementItem')"
                   :value="productName || line['KL Product Model No']"
                   v-valid.require
                   is-link></cus-field>
        <cus-field label="产品描述" tag="产品描述" class="disable"
                   :value="line['KL Product Description']"
                   is-link></cus-field>
        <cus-field label="开向" tag="开向"
                   @click.native="showLovFn('KL Hole Direction')"
                   v-model="line['KL Hole Direction']"
                   v-valid.require
                   is-link></cus-field>
        <mt-cell title="是否带天地" v-if="isVP || isPanel">
          <mt-switch v-model="flag"></mt-switch>
        </mt-cell>
        <cus-field label="数量" tag="数量"
                   type="number"
                   v-valid.require.number
                   v-model="line['Quantity Requested']"></cus-field>
        <cus-field label="门材质" tag="门材质"
                   @click.native="showLovFn('KL Door Material Quality')"
                   v-model="line['KL Door Material Quality']"
                   v-valid.require
                   is-link></cus-field>
        <cus-field label="门厚" tag="门厚"
                   v-if="isVP || isPanel"
                   v-valid.require
                   v-model="line['KL Door Thickness']"></cus-field>
        <cus-field label="锁芯中心距门内距" tag="锁芯中心距门内距"
                   v-if="isVP || isPanel"
                   v-valid.require
                   v-model="line['KL Guide Plate Specification']"></cus-field>
        <cus-field label="锁舌导向板规格" tag="锁舌导向板规格"
                   v-if="isVP || isPanel"
                   v-valid.require
                   v-model="line['KL Guide Plate Specification']"></cus-field>
        <cus-field label="门扣板规格" tag="门扣板规格"
                   v-if="isVP || isPanel"
                   v-valid.require
                   v-model="line['KL Gate Plate Specification']"></cus-field>
        <cus-field label="滑盖丝印" tag="滑盖丝印"
                   v-if="isVP || isLockBody"
                   v-valid.require
                   v-model="line['KL Slippery Screen Printing']"></cus-field>
        <cus-field label="彩卡丝印" tag="彩卡丝印"
                   v-if="isVP || isLockBody"
                   v-valid.require
                   v-model="line['KL Color Card Screen Printing']"></cus-field>
        <cus-field label="配件要求" tag="配件要求"
                   v-valid.require
                   v-model="line['KL Parts Requirement']"></cus-field>
        <cus-field label="备注"
                   type="textarea"
                   v-model="line['Description']"></cus-field>

        <!--buttons-->
        <button-group>
          <mt-button @click.native="saveFn">保存</mt-button>
        </button-group>
      </div>

      <!--popup-->
      <mt-popup v-model="showBox" position="bottom">
        <menu-box @my-enter="enter"
                  @my-cancel="showBox=false"
                  :vk="vk"
                  :type="lovType"
                  :slots="slots"></menu-box>
      </mt-popup>

    </div>
</template>

<script type="es6">
  import {mapState, mapActions} from 'vuex';
  import Vue from 'vue';
  import vp from 'public/plugin/validator';
  import menuBox from 'public/components/cus-menu.vue';
  import cusField from 'public/components/cus-field';
  // use plugin
  Vue.use(vp);
  // mapp
  let mapp = config.mapp;
  let today = new Date();

  const NAMESPACE = 'orderLine';
  export default {
    name: NAMESPACE,
    components: {menuBox, cusField},
    created() {
      let me = this;
      // 获取参数
      let param = me.$route.query;
      let line = KND.Util.parse(param.line);

      // 行默认参数
      if (line) {
        me.line = line;
        me.line.Id = me.line.Id || KND.Util.now();
      };
      // 是否面板
      // me.isPanel = param.type === 'Panel';
      me.type = param.type;
      me.editable = param.editable;
      if (!me.editable) return;

      // 合同行
      let agreementItems = me.form['MACD FS Agreement Item'];
      // 合同下所有 海贝思 的行项目，作为产品选择
      if (agreementItems) {
        let items = {};
        // 1. 去重 2. 过滤类型
        mapp.option['agreementItem'] = agreementItems.filter(i => {
          if (items[i['KL Product Model No']]) return false;
          items[i['KL Product Model No']] = true;
          return i['KL Product Type LIC'] === (me.isPanel ? 'Panel' : 'Lock Body');
        });
      } else {
        MessageBox({
          closeOnClickModal: false,
          title: '错误',
          message: '没有找到合同行，无法创建订单'
        }).then(action => {
          this.$router.back();
        });
        return;
      };

      // 填充产品名称
      if (!line['KL Product Model No']) {
        this.agreementItem = mapp.option['agreementItem'][0] || {};
      };

      // 取 lov 开向
      me.getLov({
        data: {
          'Type': 'KL_HOLE_DIRECTION',
          'Parent': param.type
        },
        // type: 'KL_HOLE_DIRECTION',
        success: data => {
          // 锁体 和 面板 的开向，取值不一样，通过 High 的取值 判断
          mapp.option['KL Hole Direction'] = data.items;
        }
      });

      // 取 lov 门材质
      me.getLov({
        type: 'KL_DOOR_MATERIAL_QUALITY',
        success: data => {
          mapp.option['KL Door Material Quality'] = data.items;
        }
      });
    },
    data() {
      return {
        startDate: today,
        agreementItem: {},
        vk: 'Value',
        slots: [
          {flex: 1, values: [], className: 'slot1', textAlign: 'center'}
        ],
        showBox: false,
        lovType: '',
        pickerValue: today,
        line: {},
        type: 'Panel', // 当前行类型 面板 Panel / 锁体 Lock Body / 假锁 False Lock / 其他 Other
        editable: false,
        isPanel: false, // 是否面板
        isLockBody: false, // 是否锁体
        isFalseLock: false, // 是否假锁
        isFitting: false, // 是否配件
        isVP: false // 是否VP003 锁体 或者 面板
      };
    },
    computed: {
      ...mapState('detail', ['form']),
      // 日期
      date: {
        get() {
          let date = this.pickerValue.format('MM/dd/yyyy');
          this.line['Scheduled Ship Date'] = date;
          return date;
        },
        set(val) {
          console.log(val);
        }
      },
      // 产品名称 menu box
      productName() {
        if (this.agreementItem['Id']) this.line['KL Agreement Item Id'] = this.agreementItem['Id']; // this.agreementItem['Id']; // 面板：1-DGFJM0  锁体：1-2BS58K4I
        return this.agreementItem['KL Product Model No'];
      },
      // 是否带天地 switch
      flag: {
        get() {
          return this.line['KL World Flag'] === 'Y';
        },
        set(flag) {
          this.line['KL World Flag'] = flag ? 'Y' : 'N';
        }
      },
      // 计算类型 & 计算标题
      title() {
        let me = this;
        let m = {
          'Panel': {key: 'isPanel', title: '面板'},
          'Lock Body': {key: 'isLockBody', title: '锁体'},
          'VP003': {key: 'isVP', title: '智能锁虚拟产品'},
          'False Lock': {key: 'isFalseLock', title: '假锁'},
          'Other': {key: 'isFitting', title: '其他'}
        };
        let obj = m[me.type] || m['Other'];
        me[obj.key] = true;
        return obj.title;
      }
    },
    methods: {
      ...mapActions(NAMESPACE, ['saveOrderLine']),
      ...mapActions('app', ['getLov']),
      // 保存订单行
      saveFn() {
        tools.valid.call(this, () => {
          this.saveOrderLine(this.line);
        });
      },
      // 选择对话框
      showLovFn(type) {
        this.lovType = type;
        this.showBox = true;
        // 选择产品的 value-key 为 KL Product Model No ， 其他为 Value
        this.vk = type === 'agreementItem' ? 'KL Product Model No' : 'Value';
        this.slots[0].values = mapp.option[type];
      },
      // 选择日期
      openPicker() {
        this.$refs.picker.open();
      },
      // 选择确认
      enter(values, type) {
        console.log(values, type);
        let me = this;
        me.showBox = false;
        // 选择填充
        this.line[type] = values[0]['Value'];
        console.log(this[type]);
        this[type] = values[0];
      }
    }
  };

</script>

<style lang="scss">
  .line {
    .mint-cell-title {
      color: $gray-minor;
    }
  }
</style>

<template>
    <div>
      <!--header-->
      <mt-header fixed :title="isPanel?'面板':'锁体'">
        <fallback slot="left"></fallback>
      </mt-header>

      <!--detail-->
      <div class="mint-content">
        <cus-field label="产品名称"
                   @click.native="showLovFn('KL Hole Direction')"
                   v-model="line['Id']"
                   is-link></cus-field>
        <cus-field label="开向"
                   @click.native="showLovFn('KL Hole Direction')"
                   v-model="line['KL Hole Direction']"
                   is-link></cus-field>
        <cus-field label="是否带天地" v-show="!isPanel"
                   @click.native="showLovFn('KL World Flag')"
                   v-model="line['KL World Flag']"
                   is-link></cus-field>
        <cus-field label="交货日期"
                   @click.native="openPicker"
                   v-model="line['Scheduled Ship Date']"
                   is-link></cus-field>
        <cus-field label="数量"
                   type="number"
                   v-model="line['Quantity Requested']"></cus-field>
        <cus-field label="门材质"
                   @click.native="showLovFn('KL Door Material Quality')"
                   v-model="line['KL Door Material Quality']"
                   is-link></cus-field>
        <cus-field label="门厚" v-show="!isPanel"
                   v-model="line['KL Door Thickness']"></cus-field>
        <cus-field label="锁舌导向板规格" v-show="!isPanel"
                   v-model="line['KL Guide Plate Specification']"></cus-field>
        <cus-field label="门扣板规格" v-show="!isPanel"
                   v-model="line['KL Gate Plate Specification']"></cus-field>
        <cus-field label="滑盖丝印" v-show="isPanel"
                   v-model="line['KL Guide Plate Specification1']"></cus-field>
        <cus-field label="彩卡丝印" v-show="isPanel"
                   v-model="line['KL Gate Plate Specification1']"></cus-field>
        <cus-field label="配件要求"
                   v-model="line['KL Parts Requirement']"></cus-field>
        <cus-field label="备注"
                   type="textarea"
                   v-model="line['Description']"></cus-field>
      </div>

      <!--buttons-->
      <button-group>
        <mt-button type="primary"
                   @click.native="saveFn">保存</mt-button>
      </button-group>

      <!--popup-->
      <mt-popup v-model="showBox" position="bottom">
        <menu-box @my-enter="enter" vk="Value"
                  @my-cancel="showBox=false"
                  :type="lovType"
                  :slots="slots"></menu-box>
      </mt-popup>

      <mt-datetime-picker
        ref="picker"
        type="date"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        v-model="date">
      </mt-datetime-picker>
    </div>
</template>

<script type="es6">
  import {mapActions} from 'vuex';
  import menuBox from 'public/components/cus-menu.vue';
  import cusField from 'public/components/cus-field';

  let NAMESPACE = 'orderLine';
  // mapp
  let mapp = config.mapp;

  export default {
    name: NAMESPACE,
    components: {menuBox, cusField},
    created() {
      let me = this;
      // 获取参数
      let param = me.$route.query;
      let line = param.line;
      if (line) {
        me.line = line;
      }
      me.isPanel = param.isPanel;

      // 取 lov 开向
      me.getLov({
        type: 'KL_HOLE_DIRECTION',
        success: data => {
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
        slots: [
          {flex: 1, values: [], className: 'slot1', textAlign: 'center'}
        ],
        showBox: false,
        lovType: '',
        date: '',
        line: {},
        isPanel: false // 是否面板
      };
    },
    computed: {
      value() {
        return new Date(this.date).format('yyyy-MM-dd');
      }
    },
    methods: {
      ...mapActions(NAMESPACE, ['saveOrderLine']),
      ...mapActions('app', ['getLov']),
      // 保存订单行
      saveFn() {
        this.saveOrderLine(this.line);
      },
      // 选择对话框
      showLovFn(type) {
        this.lovType = type;
        this.showBox = true;
        this.slots[0].values = mapp.option[type];
      },
      // 选择日期
      openPicker() {
        this.$refs.picker.open();
      },
      // 选择确认
      enter(values, type) {
        let me = this;
        me.showBox = false;
        // 选择填充
        this.line[type] = values[0]['Value'];
      }
    }
  };

</script>

<style lang="scss"></style>

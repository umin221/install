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
                   @click.native="getLovFn('Hole Type')"
                   :value="form['Hole Type']"
                   is-link></mt-cell>
          <mt-cell title="门厂是否安装锁体"
                   @click.native="getLovFn('HBS Check Box 1')"
                   :value="form['HBS Check Box 1']"
                   is-link></mt-cell>
          <mt-cell title="是否安装替代锁"
                   @click.native="getLovFn('HBS Check Box 2')"
                   :value="form['HBS Check Box 2']"
                   is-link></mt-cell>
        </div>

        <div class="lock-line">
          <lock-line title="锁芯部分" @click="toLineFn">
            <mt-cell v-for="line in data.line" class="lock-line-cell"
                     @click.native="toLineFn(line)"
                     :key="line['Id']"
                     is-link>
              <div class="co-flex co-jc" slot="title">
                <span class="co-f1">{{line['Id']}}</span>
                <span class="co-f1">开向:{{line['KL Hole Direction']}}</span>
                <span class="co-f1">数量:{{line['Quantity Requested']}}</span>
              </div>
            </mt-cell>
          </lock-line>
          <lock-line title="锁体部分*真锁" @click="toLineFn">
            <mt-cell v-for="line in data.line" class="lock-line-cell"
                     @click.native="toLineFn(line)"
                     :key="line['Id']"
                     is-link>
              <div class="co-flex co-jc" slot="title">
                <span class="co-f1">{{line['Id']}}</span>
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
                   @click.native="rejectFn">转发门厂确认</mt-button>
        <mt-button v-show="isTransfer" type="primary"
                   @click.native="confirmFn">发起安装</mt-button>
        <mt-button v-show="!isTransfer" type="primary"
                   @click.native="toLineFn">确认提交</mt-button>
      </button-group>

      <!--popup-->
      <mt-popup v-model="showBox" position="bottom">
        <menuBox @my-enter="enter"
                 @my-cancel="showBox=false"
                 :type="lovType"
                 :slots="slots"></menuBox>
      </mt-popup>
    </div>
</template>

<script type="es6">
  import {mapState, mapActions, mapMutations} from 'vuex';
  import menuBox from 'public/components/cus-menu.vue';
  import lockLine from '../components/cusLockLine';

  let NAMESPACE = 'order';
  // 下拉列表
  let option = config.mapp.option;

  export default {
    name: NAMESPACE,
    components: {lockLine, menuBox},
    data() {
      return {
        data: {
          line: [{
            'KL Hole Direction': '左开',
            'KL World Flag': 'Y',
            'Scheduled Ship Date': '03/01/2018',
            'KL Door Thickness': '门厚',
            'KL Guide Plate Specification': '锁舌导向板规格',
            'KL Parts Requirement': '配件要求',
            'Quantity Requested': '125',
            'KL Agreement Item Id': '1-DGFJM0',
            'KL Door Material Quality': '木门',
            'KL Gate Plate Specification': '门扣板规格',
            'Description': '备注',
            'Id': '1-111'
          }, {
            'KL Hole Direction': '左开',
            'KL World Flag': 'Y',
            'Scheduled Ship Date': '03/01/2018',
            'KL Door Thickness': '门厚',
            'KL Guide Plate Specification': '锁舌导向板规格',
            'KL Parts Requirement': '配件要求',
            'Quantity Requested': '125',
            'KL Agreement Item Id': '1-DGFJM0',
            'KL Door Material Quality': '木门',
            'KL Gate Plate Specification': '门扣板规格',
            'Description': '备注',
            'Id': '1-112'
          }]
        },
        slots: [
          {flex: 1, values: ['是', '否'], className: 'slot1', textAlign: 'center'}
        ],
        showBox: false,
        lovType: ''
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['form']),
      // 是否可发起安装状态
      isTransfer() {
        return true;
      }
    },
    methods: {
      ...mapActions(NAMESPACE, ['submit', 'save']),
      ...mapMutations(NAMESPACE, ['setForm']),
      // 订单行
      toLineFn(line) {
        this.$router.push({
          path: 'lockBody',
          query: {
            line: line
          }
        });
      },
      // 选择对话框
      getLovFn(type) {
        this.lovType = type;
        this.showBox = true;
        this.slots[0].values = option[type];
      },
      // 订单行保存
      saveFn() {
        let form = this.form;
        if (form['Hole Type'] && form['HBS Check Box 1'] && form['HBS Check Box 2']) {
          this.save(this.$route.query.id);
        } else {
          Toast('请完整填写订单头信息');
        }
      },
      // 选择确认
      enter(values, type) {
        let me = this;
        me.showBox = false;
        // 选择填充
        this.form[type] = values[0];
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

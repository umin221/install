<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content batch">
      <div :class="{'readonly':read}">
        <cus-field label="计划类型"
                   @click.native="showLovFn('TODO_TYPE')"
                   v-model="planObj['TODO_TYPE']"
                   is-link></cus-field>
        <mt-cell title="计划开始日期" @click.native="open('picker')" :value="planObj.Planned" is-link></mt-cell>
        <mt-cell title="计划完成日期" @click.native="open('pickerEnd')" :value="planObj['Planned Completion']" is-link></mt-cell>
        <mt-cell v-show="type==='edit'" title="实际开始日期" @click.native="open('picker')" :value="planObj.Planned" is-link></mt-cell>
        <mt-cell v-show="type==='edit'" title="实际结束日期" @click.native="open('pickerEnd')" :value="planObj['Planned Completion']" is-link></mt-cell>
        <cus-field label="备注"
                   type="textarea"
                   v-model="planObj['Description']"></cus-field>
      </div>
      <button-group>
        <mt-button type="primary" class="single"
                   @click.native="submitFn">保存</mt-button>
      </button-group>
      <mt-datetime-picker
        ref="picker"
        v-model="pickerVisible"
        type="date"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        class="datetime"
        @confirm="handleChange">
      </mt-datetime-picker>
      <mt-datetime-picker
        ref="pickerEnd"
        type="date"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        class="datetime"
        @confirm="handleChangeEnd">
      </mt-datetime-picker>
    </div>
    <mt-popup v-model="showBox" position="bottom">
      <menu-box @my-enter="enter"
                @my-cancel="showBox=false"
                :vk="vk"
                :type="lovType"
                :slots="slots"></menu-box>
    </mt-popup>
  </div>
</template>
<style lang="scss">
  .batch {
    .button-cla {
      margin-top: 2.5rem;
      width: 100%;
      text-align: center;
    }
    .mint-button--normal {
      display: inline-block;
      padding: 0 12px;
      width: 5rem;
    }
    input {
      text-align: right!important;
    }

    .lock-line {
      margin-top: 10px;

      .lock-line-cell {
        background-color: $bg-light;
      }
    }
  }
</style>
<script type="application/javascript">
  import {mapState, mapActions} from 'vuex';
  import buttonGroup from 'public/components/cus-button-group';
  import lockLine from '../components/cusLockLine';
  import cusField from 'public/components/cus-field';
  import menuBox from 'public/components/cus-menu.vue';
  import api from '../api/api';
  const NameSpace = 'batch';
  // mapp
  let mapp = config.mapp;
  export default {
    name: 'detail',
    created() {
      console.dir(1);
      var self = this;
      let param = this.$route.query;
      this.id = param.item.Id;
      this.type = param.item.type;
      this.item = param.item;
      console.dir('=====' + this.id);
      // 获取详情
      if (this.type === 'add') {
      } else {
        this.getBatch(this.item);
      }
      // 取 lov 门材质
      self.getLov({
        data: {
          'Type': 'TODO_TYPE',
          'Parent Value': self.item['KL Detail Type']
        },
        success: data => {
          mapp.option['KL Door Material Quality'] = data.items;
        }
      });
    },
    data: () => {
      return {
        value: '',
        pickerVisible: true,
        id: '',
        item: '',
        type: 'add', // add 新增 / edit 编辑 / read 只读
        titleVal: '新建详细计划',
        vk: 'Value',
        slots: [
          {flex: 1, values: [], className: 'slot1', textAlign: 'center'}
        ],
        showBox: false,
        lovType: '',
        active: 'tab-container'
      };
    },
    beforeRouteEnter(to, from, next) {
      console.dir(2);
      next(vm => {
        let query = vm.$route.query;
        console.dir(query);
      });
    },
    computed: {
      ...mapState(NameSpace, ['planObj']),
      // 表单只读
      read() {
        return this.type === 'read';
      },
      // * 是否显示
      heartVisible() {
        return this.type === 'read' ? '' : 'require';
      }
    },
    methods: {
      ...mapActions('app', ['getLov']),
      open(picker) {
        this.$refs[picker].open();
      },
      handleChange(value) {
      },
      handleChangeEnd(value) {
      },
      // 选择对话框
      showLovFn(type) {
        this.lovType = type;
        this.showBox = true;
        // 选择产品的 value-key 为 KL Product Model No ， 其他为 Value
        this.vk = type === 'agreementItem' ? 'KL Product Model No' : 'Value';
        this.slots[0].values = mapp.option[type];
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
      },
      getBatch(obj) {
        var self = this;
        api.get({ // 批次详情
          key: 'findBatchById', // 'findBatchById',
          data: {
            id: obj.Id
          },
          success: data => {
            console.dir(data);
            self.batchCode = data.Id; // 批次
            self.start_Date = new Date(data.Planned).format('yyyy-MM-dd'); // 开始时间
            self.end_Date = new Date(data['Planned Completion']).format('yyyy-MM-dd'); // 结束时间
            self.startDate = self.start_Date.format('MM/dd/yyyy'); // 后台存值格式
            self.endDate = self.end_Date.format('MM/dd/yyyy');
            self.batchNum = data['KL Install Amount Requested'] || 0; // 数量
          }
        });
      },
      submitFn() {
      }
    },
    components: {buttonGroup, cusField, menuBox, lockLine}
  };
</script>

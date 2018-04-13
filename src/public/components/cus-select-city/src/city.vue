<template>
  <div>
    <!--下拉菜单-->
    <mt-popup :value="showBox" position="bottom" :closeOnClickModal="false">
      <menu-box @my-enter="enter"
                @my-cancel="showBox = false"
                @my-change="onValuesChange"
                @my-change1="onValuesChange1"
                :slots="slots"
                :slots1="slots1"
                :slots2="slots2"></menu-box>
    </mt-popup>
  </div>
</template>

<script type="es6">
  import {mapActions} from 'vuex';
  import menuBox from './menu';

  export default {
    name: 'city',
    data() {
      return {
        showBox: false,
        slots: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}],
        slots1: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}],
        slots2: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}]
      };
    },
    props: {
      showCity: Number
    },
    watch: {
      showCity(val) {
        this.showBox = true;
        this.showLovFn();
      }
    },
    methods: {
      ...mapActions('app', ['getLov']),
      // 选择对话框
      showLovFn() {
        let me = this;
        me.slots[0].values = [];
        me.showBox = true;
        me.getLov({
          data: {
            'Type': 'KL_PROVINCE',
            'Parent Value': '中国'
          },
          success: data => {
            let datas = KND.Util.toArray(data.items) ;
            for (let i = 0;i < datas.length; i++) {
              me.slots[0].values.push(datas[i].Value);
            }
          }
        });
      },
      enter(values) {
        this.showBox = false;
        this.$emit('input', values);
      },
      onValuesChange(value) {
        let me = this;
        me.slots1[0].values = [];
        if (value[0]) {
          me.getLov({
            data: {
              'Type': 'KL_CITY',
              'Parent Value': value[0]
            },
            success: data => {
              let datas = KND.Util.toArray(data.items) ;
              for (let i = 0;i < datas.length; i++) {
                me.slots1[0].values.push(datas[i].Value);
              }
            }
          });
        }
      },
      onValuesChange1(value) {
        let me = this;
        me.slots2[0].values = [];
        if (value[0]) {
          me.getLov({
            data: {
              'Type': 'KL_TOWN',
              'Parent Value': value[0]
            },
            success: data => {
              let datas = KND.Util.toArray(data.items) ;
              for (let i = 0;i < datas.length; i++) {
                me.slots2[0].values.push(datas[i].Value);
              }
            }
          });
        }
      }
    },
    components: {menuBox}
  };

</script>

<style lang="scss"></style>

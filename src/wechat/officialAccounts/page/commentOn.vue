<template>
  <div style="background-color: #ebebeb;">
    <div class="mint-content commentOn">
      <div class="service-attitude" >
        维修服务态度
        <div class="attitude">
          <i :class="[xs,attitudeIs[index] ? starY:starN]"
             style="margin-left: 5px"
             v-for="(item, index) in 5"
             @click="changeStar(index+1, 'attitudeIs')"></i>
        </div>
      </div>
      <div class="service-attitude" >
        维修服务技术
        <div class="attitude">
          <i :class="[xs,technologyIs[index] ? starY:starN]"
             style="margin-left: 5px"
             v-for="(item, index) in 5"
             @click="changeStar(index+1, 'technologyIs')"></i>
        </div>
      </div>
      <mt-radio
        title="维修工程师是否有预约"
        v-model="box1"
        :options="['是', '否']">
      </mt-radio>
      <mt-radio
        title="是否维修完成？"
        v-model="box2"
        :options="['是', '否']">
      </mt-radio>
      <cus-field class="block" label="建议与反馈" type="textarea" placeholder="请输入意见与反馈"></cus-field>

      <button-group>
        <mt-button class="single" @click.native="submit">提交</mt-button>
      </button-group>
    </div>
  </div>
</template>
<script>
//  import {mapState, mapActions, mapMutations} from 'vuex';
  import cusField from 'public/components/cus-field';
  const NameSpace = 'commentOn';
  export default {
    name: NameSpace,
    created() {
      for (let i = 0; i < 5; i++) {
        this.attitudeIs.push(false);
        this.technologyIs.push(false);
      }
    },
    data: () => {
      return {
        attitudeIs: [],
        technologyIs: [],
        xs: 'xs-icon',
        starN: 'icon-starN',
        starY: 'icon-starY',
        box1: '是',
        box2: '是'
      };
    },
    computed: {
//      ...mapState(NameSpace, [''])
    },
    methods: {
//      ...mapActions(NameSpace, ['']),
//      ...mapMutations(NameSpace, []),
      submit() {
        this.$router.push('myRepair');
      },
      changeStar(index, type) {
        this[type] = [];
        for (let i = 0; i < 5; i++) {
          if (i < index) {
            this[type].push(true);
          } else {
            this[type].push(false);
          }
        }
      }
    },
    components: {cusField}
  };
</script>
<style lang="scss">
  .commentOn{
    background-color: #ffffff;
    margin-bottom: 45px;

    .service-attitude{
      text-align: center;
      line-height: 2.5rem;
    }
    .mint-radiolist{
      label{
        font-size: 0.75rem;
      }
    }
    .block{
      .mint-cell>.mint-cell-wrapper{
        display: block;

        .mint-cell-value{
          textarea{
            height: 5rem;
          }
        }
      }
    }
  }
</style>

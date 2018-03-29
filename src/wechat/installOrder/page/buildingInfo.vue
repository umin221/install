<template>
  <div>
    <mt-header fixed title="项目楼层信息补充">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content buildingInfo">
      <mt-field label="安装地址" placeholder="请输入安装地址"
                @change="addAddress"></mt-field>
      <div style="height: 5px"></div>
      <div style="background: white;padding-bottom: 10px;">
        <mt-cell>
          <div slot="title" class="list-text"><span class="list-text-span">楼层信息</span></div>
        </mt-cell>
        <div class="cus-cell">
            <div class="cus-title">楼栋数<span class="cus-title-span">默认栋，如1栋</span></div>
            <div class="cus-title" style="text-align: right;margin-bottom: 10px;">
              <div class="cus-title-div" ><span @click="reduceVal('buildingNum')">-</span><input v-model="buildingNum"/><span @click="plusVal('buildingNum')">+</span></div><span>栋</span>
            </div>
        </div>
        <div class="cus-cell">
          <div class="cus-title">楼层数/栋<span class="cus-title-span">默认F，如1F</span></div>
          <div class="cus-title" style="text-align: right;margin-bottom: 10px;">
            <div class="cus-title-div" ><span  @click="reduceVal('layerNum')">-</span><input v-model="layerNum"/><span @click="plusVal('layerNum')">+</span></div><span>F</span>
          </div>
        </div>
        <div class="cus-cell">
          <div class="cus-title">房间数/层<span class="cus-title-span">房号，楼层号+001，如1001</span></div>
          <div class="cus-title" style="text-align: right;margin-bottom: 10px;">
            <div class="cus-title-div" ><span  @click="reduceVal('roomNum')">-</span><input v-model="roomNum"/><span @click="plusVal('roomNum')">+</span></div><span>&nbsp;</span>
          </div>
        </div>
      </div>
      <div class="buildingInfo-zy">注意：非标准楼层选择楼数量后手工编辑</div>
    </div>
    <button-group>
      <!--<mt-button type="primary" class="single"
                 @click.native="previewFn">编辑预览</mt-button>-->
      <mt-button class="single"
                 @click.native="submitFn">保存提交</mt-button>
    </button-group>
  </div>
</template>
<style lang="scss">
  .buildingInfo{
    .cus-cell {
      position: relative;
      margin: 10px;
      padding: 10px;
      border-radius: 4px;
      overflow: hidden;
      font-size: 0.75rem;
      background: #f3f1f1;
    }
    .cus-title {
      background: #f3f1f1!important;
      line-height: 30px;
    }
    .cus-title-span {
      color: #777;
      font-size: 0.65rem;
      margin-left: 10px;
    }
    .cus-title-div {
      position: absolute;
      height: 36px;
      width: 200px;
      border-radius: 4px;
      overflow: hidden;
      font-size: 0.75rem;
      right: 30px;
      background: white;
      border: 1px solid #ebebeb;
    }
    .cus-title-div input{
      width: 100px;
      line-height: 36px;
      border-left: 1px solid #ebebeb;
      border-right: 1px solid #ebebeb;
      border-bottom: none;
      border-top: none;
      text-align: center;
      font-size: $font-size-icon;
      color: $primary-color;
    }
    .cus-title-div span{
      padding:20px;
    }
    .buildingInfo-zy{
      color: #777;
      line-height: 22px;
      margin: 10px;
      font-size: 0.75rem;
    }
  }
</style>
<script type="application/javascript">
  import {mapState, mapActions} from 'vuex';

  import buttonGroup from 'public/components/cus-button-group';
  const NameSpace = 'buildingInfo';
  export default {
    name: 'buildingInfo',
    created: () => {
      console.dir(1);
      let param = this.$route.query;
      this.item = param.item;
    },
    data: () => {
      return {
        value: '',
        item: '',
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
    methods: {
      ...mapActions(NameSpace, ['reduceValFn', 'plusValFn']),
      previewFn: function() { // 楼层预览
        var self = this;
        self.$router.push('building');
      },
      addAddress: function() {
        console.dir('获取地址');
      },
      reduceVal: function(type) {
        this.reduceValFn({
          type: type,
          success: data => {
          }
        });
      },
      plusVal: function(type) {
        this.plusValFn({
          type: type,
          success: data => {
          }
        });
      }
    },
    components: {buttonGroup},
    computed: {
      ...mapState(NameSpace, ['buildingNum', 'layerNum', 'roomNum'])
    }

  };
</script>

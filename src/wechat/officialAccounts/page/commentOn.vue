<template>
  <div style="background-color: #ebebeb;">
    <div class="mint-content commentOn">
      <div class="service-attitude" >
        维修服务态度
        <div class="attitude">
          <i :class="[xs,attitudeIs[index] ? starY:starN]"
             style="margin-left: 5px"
             v-for="(item, index) in attitudeData"
             @click="(!type && changeStar(index+1, 'attitudeIs', item.Value))"></i>
        </div>
      </div>
      <div class="service-attitude" >
        维修服务技术
        <div class="attitude">
          <i :class="[xs,technologyIs[index] ? starY:starN]"
             style="margin-left: 5px"
             v-for="(item, index) in technologyData"
             @click="(!type && changeStar(index+1, 'technologyIs', item.Value))"></i>
        </div>
      </div>
      <mt-radio
        title="维修工程师是否有预约"
        v-model="box1"
        :options="[
          {
            label: '是',
            value: '是',
            disabled: this.type
          },
          {
            label: '否',
            value: '否',
            disabled: this.type
          }
        ]">
      </mt-radio>
      <mt-radio
        title="是否维修完成？"
        v-model="box2"
        :options="[
          {
            label: '是',
            value: '是',
            disabled: this.type
          },
          {
            label: '否',
            value: '否',
            disabled: this.type
          }
        ]">
      </mt-radio>
      <cus-field class="block"
                 label="建议与反馈"
                 id="comments"
                 type="textarea"
                 v-model="comments"
                 placeholder="请输入意见与反馈"></cus-field>
      <button-group v-if="!type">
        <mt-button class="single" @click.native="submit">提交</mt-button>
      </button-group>
    </div>
  </div>
</template>
<script>
  import {mapActions} from 'vuex';
  import cusField from 'public/components/cus-field';
  const NameSpace = 'commentOn';
  const systemSort = function(array) {
    return array.sort(function(a, b) {
      return b['Order By'] - a['Order By'];
    });
  };
  const setAttrButt = (function() {
    return function(id, type) {
      let parent = document.getElementById(id);
      let child = parent.getElementsByTagName(type);
      child[0].setAttribute('disabled', true);
    };
  })();
//  let mapp = config.mapp;
  export default {
    name: NameSpace,
    created() {
      let me = this;
      let parmer = me.$route.query;
      me.type = parmer.isDisable;
      if (me.type) {
        me.getService({
          search: 'SR Number',
          value: parmer.srNum,
          callback: data => {
            console.log(data);
            if (data) {
              me.comments = data.Comments;
              setAttrButt('comments', 'textarea');
            }
          }
        });
        me.changeStar();
      }
      for (let i = 0; i < 5; i++) {
        me.attitudeIs.push(false);
        me.technologyIs.push(false);
      }
      // 取 lov
      me.commentLov({
        type: 'CS_KNOWLEDGABLE',
        callback: data => {
          me.attitudeData = systemSort(data.SiebelMessage['List Of Values']);
        }
      });
      me.commentLov({
        type: 'CS_OVERALL',
        callback: data => {
          me.technologyData = systemSort(data.SiebelMessage['List Of Values']);
        }
      });
    },
    data: () => {
      return {
        attitudeIs: [],
        technologyIs: [],
        attitudeData: [],
        technologyData: [],
        attitudeIsValue: '',
        technologyIsValue: '',
        xs: 'xs-icon',
        starN: 'icon-starN',
        starY: 'icon-starY',
        box1: '是',
        box2: '是',
        comments: '',
        type: false
      };
    },
    computed: {
    },
    methods: {
      ...mapActions(NameSpace, ['customerSurvey', 'commentLov', 'getService']),
      submit() {
        let me = this;
        let form = {
          Id: me.$route.query.id,                                        // 服务请求ID
          statusDate: new Date().format('MM/dd/yy hh:mm:ss'),      // 状态时间
          Accessible: me.box1,                                        // 是否有预约？
          Knowledgable: me.technologyIsValue,                     // 维修服务技术？
          Overall: me.attitudeIsValue,                            // 维修服务态度？
          Resolved: me.box2,                                        // 是否维修完成？
          Comments: me.comments,                                   // 建议与反馈
          callback: function(data) {
            console.log(data);
            me.$router.back();
          }
        };
        me.customerSurvey(form);
      },
      changeStar(index, type, value) {
        let me = this;
        let typeIn = type + 'Value';
        me[type] = [];
        me[typeIn] = value;
        for (let i = 0; i < 5; i++) {
          if (i < index) {
            me[type].push(true);
          } else {
            me[type].push(false);
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

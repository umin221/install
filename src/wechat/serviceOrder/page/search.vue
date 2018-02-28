<template>
  <div>
    <mt-header fixed title="搜索">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content">
      <mt-search v-model="value" :result.sync="result" :autofocus="true" placeholder="请输入服务单编号"></mt-search>
    </div>
  </div>
</template>
<script type="application/javascript">
  import api from '../api/api';
  export default {
    name: 'search',
    created() {
      let me = this;
      api.get({
        key: 'getList',
        data: {
          'body': {
            'OutputIntObjectName': 'Base KL Service Request Interface BO',
            'SearchSpec': '[Service Request.Owner]="16113009"'
          }
        },
        success: function(data) {
          me.list = data.SiebelMessage['Service Request'];
          console.log(me.list);
          for (let i = 0; i < me.list.length; i++) {
            me.result.push(me.list[i]['SR Number']);
          }
          console.log(me.result);
        }
      });
    },
    data: () => {
      return {
        list: [],
        result: [],
        value: ''
      };
    },
    methods: {}
  };
</script>

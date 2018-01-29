<template>
  <div>
    <mt-header fixed title="委外人员管理">
      <fallback slot="left"></fallback>
      <mt-button slot="right" icon="search">
        <router-link to="detail"></router-link>
      </mt-button>
    </mt-header>

    <div class="mint-content">
      <mt-navbar v-model="selected">
        <mt-tab-item id="1">已注册</mt-tab-item>
        <mt-tab-item id="2">已失效</mt-tab-item>
      </mt-navbar>

      <!-- tab-container -->
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="1">
          <mt-cell title="合作伙伴名称：恒通安装公司" label="合作伙伴负责人：李立三 07100028" is-link></mt-cell>
        </mt-tab-container-item>
        <mt-tab-container-item id="2">
          <mt-cell title="合作伙伴名称：恒通安装公司" label="合作伙伴负责人：李三 2222221" is-link></mt-cell>
        </mt-tab-container-item>
      </mt-tab-container>
      </mt-cell>
    </div>

  </div>
</template>

<script type="application/javascript">
  import {mapState, mapActions} from 'vuex';

  const NameSpace = 'index';
  export default {
    name: NameSpace,
    created: () => {
    },
    data: () => {
      return {
        active: 'tab-container1',
        selected: '1'
      };
    },
    computed: {
      ...mapState(NameSpace, ['value'])
    },
    methods: {
      ...mapActions(NameSpace, ['getList'])
    }
  };
</script>

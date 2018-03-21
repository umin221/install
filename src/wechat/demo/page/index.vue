<template>
  <div>
    <mt-header fixed title="demo">
      <fallback slot="left"></fallback>
    </mt-header>

    <div class="mint-content">
      <mt-cell title="toast" to="toast" is-link></mt-cell>
      <mt-cell title="indicator" to="indicator" is-link></mt-cell>
      <mt-cell title="actionSheet" to="actionSheet" is-link></mt-cell>
      <mt-cell title="messageBox" to="messageBox" is-link></mt-cell>
      <mt-cell title="loading" to="loading" is-link></mt-cell>
      <mt-cell title="icon" to="icon" is-link></mt-cell>
      <mt-cell title="detail" to="detail" is-link></mt-cell>
      <mt-cell title="getUserID" @click.native="getUserIDFn" is-link></mt-cell>
      <mt-cell title="native" to="native" is-link></mt-cell>
    </div>

  </div>
</template>

<script type="es6">
//  import api from '../api/api';
  import {mapState, mapActions} from 'vuex';

  const NameSpace = 'index';
  export default {
    name: NameSpace,
    data: () => {
      return {
        active: 'tab-container1'
      };
    },
    computed: {
      ...mapState(NameSpace, ['value'])
    },
    methods: {
      ...mapActions(NameSpace, ['getList']),
      getUserIDFn() {
        MessageBox('提示', KND.Util.getParam('userID'));
      }
    }
  };
</script>

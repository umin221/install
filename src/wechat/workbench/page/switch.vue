<template>
    <div>
      <mt-header fixed title="切换用户">
        <fallback slot="left"></fallback>
      </mt-header>

      <div class="mint-content">
        <mt-cell class="multiple"
                 :key="u.userID"
                 v-for="u in list"
                 @click.native="switchFn(u)"
                 is-link>
          <div class="mint-cell-title" slot="title">{{u['userID']}}</div>
          <div class="mint-cell-sub-title" slot="title">{{u['area']}}_{{u['position']}}_{{u['name']}}</div>
        </mt-cell>
      </div>
    </div>
</template>

<script type="es6">
  import list from '../store/users';
  // 环境
  let project = global['project'];
  let env = (project && project['env']) || {env: 'SIT'};
  let NameSpace = 'default';
  export default {
    name: NameSpace,
    data() {
      return {
        list: list[env]
      };
    },
    methods: {
      switchFn(user) {
        KND.Native.userID = user.userID;
        KND.Util.back();
      }
    }
  };

</script>

<style lang="scss"></style>

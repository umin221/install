<template>
  <div>
    <mt-header fixed title="待办审批中心">
      <fallback slot="left"></fallback>
    </mt-header>

    <div class="mint-content">
    </div>
  </div>
</template>

<script type="es6">
  const NameSpace = 'index';
  export default {
    name: NameSpace,
    created: () => {
      let module = KND.Util.getParam('module');
      let page = KND.Util.getParam('page');
      if (!module) {
        MessageBox('提示', '跳转模块为空');
        return;
      };
      location.replace((location.href.replace('#/page', '#/' + page).replace('/controller/', '/' + module + '/') + '&option=approval'));
    }
  };
</script>

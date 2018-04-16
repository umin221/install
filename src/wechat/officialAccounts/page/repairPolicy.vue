<template>
  <div class="text-body">
    <h4>一、保修对象</h4>
    <span class="text-content">本公司智能锁产品</span>
    <h4>二、免费保修时间</h4>
    <span class="text-content">自安装之日起质保二年</span>
    <h4>三、保修说明</h4>
    <span class="text-content">在免费保修期内，凡属于正常使用情况下由于产品本身质量问题引起的故障，我司将负责给予免费维修。</span>
    <h4>四、下列情况，不属于免费服务范围，但可参照本收费标准实行收费维修（上门服务费+配件费用）</h4>
    <span class="text-content">1、因使用、维护、保管不当造成损坏的</span>
    <span class="text-content">2、由它种品牌组装而导致的损坏。</span>
    <span class="text-content">3、人为原因或意外因素导致的损坏</span>
    <span class="text-content">4、非我司售后服务人员拆、装导致的损坏</span>
    <span class="text-content">5、无有效发票或产品超免费保修期。</span>
  </div>
</template>
<script>
  const NameSpace = 'address';
  export default {
    name: NameSpace,
    created() {
    },
    data: () => {
      return {
      };
    },
    computed: {
    },
    methods: {
    }
  };
</script>
<style lang="scss">
  .text-body{
    padding: 20px;
    color: darkslategrey;
    .text-content{
      font-size: 0.9rem;
      display: block;
    }
  }
</style>

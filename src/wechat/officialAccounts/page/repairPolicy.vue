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

    <h4>五、密码维护与修改</h4>
    <span class="text-content">
      在室内侧打开电池盒后盖（更换电池的地方），看里面是否有按键。
    </span>
    <div>&nbsp;</div>
    <span class="text-content">
      1、如果有两个按键
    长按F1按钮5秒：修改管理密码、主人密码、客人密码。
    短按一下F1按钮：增加主人、客人的密码、指纹、磁卡。
    长按F2按钮5秒：系统设置操作。
    短按一下F2按钮：删除主人、客人的密码、指纹、磁卡。

    </span>
    <div>&nbsp;</div>
    <span class="text-content">
      2、电池后盖无按键
    修改密码：#5# 原密码 # 两次新密码 #
    增加密码：#1# 管理密码 # 两次新密码 #
    删除密码：#3# 管理密码
    设置常开状态快捷：0 + # + 管理密码 + #
    解除常开的状态：9 + # + 管理密码 + #
    </span>
    <div>&nbsp;</div>
    <span class="text-content">
      3、如果有四个摁键
    按键上方有液晶显示屏：
    按ESC,输入管理员密码+#键
    根据需求移动光标到：钥匙管理、系统设置、记录查询等按钮，并按确认键操作。
    <div>&nbsp;</div>
      按键上方无液晶显示屏：
    修改密码：
    按ESC 3秒 （蜂鸣器“哆 唻”响一声）
    输入管理员密码 + # 键 （蜂鸣器 “哆 唻” 响一声）
    输入新管理员密码 + # 键 （蜂鸣器 “哆 唻” 响一声）
    再次输入管理员密码 + # 键 （蜂鸣器 “哆 唻” 响一声）
    增加磁卡：
    短按一下ESC按键，（蜂鸣器“哆 唻”响一声）
    输入管理员密码 + # 键，（蜂鸣器 “哆 唻” 响一声）
    将新的磁卡放置在磁卡感应区（蜂鸣器 “哆 唻 咪” 响一声）
    删除密码：
    短按一下OK键，蜂鸣器“哆 唻”响一声）
    输入管理员密码 + # 键 （蜂鸣器 “哆 唻” 响一声）
    </span>
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

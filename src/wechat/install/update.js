/**
 * Created by imac-ret on 18/4/8.
 */
document.addEventListener('deviceready', function() {
  // 说明：这里的使用了Framework7
  chcp.fetchUpdate(function(error, data) {
    alert(error);
    if (!error) {
      var flag = confirm('有更新，确定更新吗?');
      if (flag) {
        console.log('取消更新！');
      } else {
        alert('正在升级，升级完毕应用将自动重启...');
        chcp.installUpdate(function(error) {
          alert('更新完成', ['提示']);
        });
      }
    } else {
      alert('你当前是最新版本', ['提示']);
    }
  });
}, false);

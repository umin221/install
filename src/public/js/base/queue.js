/**
 * @author umin
 * @copyright Copyright (c) 2018, YZKJ
 * @description 任务队列
 */
let tasks = [];
let status = 'stop';

class Queue {

  /**
   * 构造函数
   */
  constructor() {
    KND.Util.log('Queue init...');
  };

  /**
   * 添加任务
   * @param task
   */
  queue(task) {
    tasks.push(task);
    if (status === 'stop' && tasks.length === 1) this.execute(tasks[0]);
  };

  /**
   * 加载队列任务
   */
  dequeue() {
    status = 'stop';
    tasks.shift();
    if (tasks.length === 0) {
      // loading
      Indicator.close();
    } else {
      this.execute(tasks[0]);
    }
  };

  /**
   * 执行任务
   * @param task
   */
  execute(task) {
    let me = this;
    let success = task['success'];
    let error = task['error'];

    status = 'running';
    task.success = data => {
      me.dequeue();
      if (success) success(data);
    };
    task.error = err => {
      me.dequeue();
      if (error) error(err);
    };

    // start loading
    if (task.loading !== false) Indicator.open({ spinnerType: 'fading-circle' });

    // start task
    task.execute(task);
  };
};

export default new Queue();

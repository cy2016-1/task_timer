# task_timer

#### 介绍
小度音箱 任务计时器技能，计算任务所花时间，




#### 软件架构
##### 基本算法
任务时间=结束任务时间-开始任务时间
##### 具体实现
- 开始任务时，把当前时间记录到持久存储中，在结束任务时，用结束任务的时间减去开始任务时间得到任务所花时间
- 持久存储的时间设置为**5**小时，所以，**该技能最大支持5小时内的计时**
###### 持久存储操作
由于Nodejs sdk没有storage接口，需要自行处理
- 持久存储
  
    先把要持久存储的数据存入本地变量，在得到响应的json后，解析json，合并context的storage属性
- 持久存储获取
  
  持久存储的数据在请求的context的PersistentStorages属性中，**自定义技能文档中没有描述，需要注意后续接口变化**

#### 使用说明

##### 启动技能
打开任务计时器 开始对话
##### 开始
- 开始
- 开始任务
##### 结束

- 停止
- 结束任务
- 停止任务

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 参考

- [自定义技能开发文档](https://dueros.baidu.com/didp/doc/index)https://dueros.baidu.com/didp/doc/index
- [Nodejs SDK使用说明](https://github.com/dueros/bot-sdk-node.js)  https://github.com/dueros/bot-sdk-node.js

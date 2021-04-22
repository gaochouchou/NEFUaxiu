
const db = wx.cloud.database()
const cont = db.collection('repair')
const _ = db.command
var app = getApp()
var util = require('../../utils/util.js');

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    images: [],
    list: [],
    build: [{ choose: '丹青楼' }, { choose: '锦绣楼' }, { choose: '成栋楼' }, { choose: '主楼' }, { choose: '交通学院' }, { choose: '图书馆A区' }, { choose: '图书馆B区' }, { choose: '研究生楼' }, { choose: '动资楼' }, { choose: '理学楼' }, { choose: '文法楼' }, { choose: '文博楼' }, { choose: '工程楼' }, { choose: '逸夫楼' }],
    load: true,
    Record: null,
  },
  //显示图片
  showdata: function () {

    db.collection('repair').where({

    }).get().then(res2 => {
      this.setData({
        images: res2.data
      });
    }).catch(err => {

    })
  },

  // 调用云函数
  comfirm: function (e) {
    let id = e.currentTarget.dataset.id;
    console.log('id的值为：'+id),
    wx.cloud.callFunction({
      name: "update",  //该名字是云函数名字
      data: {
        score: id,
      }
    }).then(res =>{
        console.log(' 修改状态成功！！ '+res);
        wx.showToast({
          title: '更新状态成功',
        })
      }).catch(err=>{
        wx.showToast({
          title: '更新状态失败',
        })
        console.error('调用失败',err);
      })  

  },

  accept:function(e){
    // 从前端获取当前用户点击的维修工单id号
    var id = e.currentTarget.dataset.id
    console.log('id值为：',id)
    var time = util.formatTime(new Date());
    // // 获取维修员工openid，并写入
    // wx.cloud.callFunction({
    //   name: "login",  //该名字是云函数名字
    // }).then(res => {
    //   // 获取用户openid，获取后在回调函数中进行更新
    //   console.log(res.result.openid)


    //   // 从数据库中get数据，判断 第一维修人/第二维修人（退单重修）
      db.collection('repair').doc(id).get({

      }).then(res => {
        console.log('查询结束')
        console.log(res.data)
        if (res.data.isDouble == 0){
          // 获取维修员工openid，并写入
          wx.cloud.callFunction({
            name: "login",  //该名字是云函数名字
          }).then(res => {
            // 获取用户openid，获取后在回调函数中进行更新
            console.log('第一工程师空,将填入workerid为',res.result.openid)
            // 更新初次修理维修工程师
            db.collection('repair').doc(id).update({
              data:{
                isAccept:1,
                description: '工程师已授理，等待维护，请留意维修进度',
                workerID1:res.result.openid,
                acceptTime1:time
              }
            }).then(res => {
              console.log('授理完成',res),
              wx.showToast({
                title: '已授理',
                icon: 'success',
                duration: 2000
              });
            })
          })
        }
        else if(res.data.isDouble == 1){
          // 第一维修员工已填写，此工单为二次接单，填入第二维修员工
          // 获取维修员工openid，并写入
          wx.cloud.callFunction({
            name: "login",  //该名字是云函数名字
          }).then(res => {
            // 获取用户openid，获取后在回调函数中进行更新
            console.log('第二工程师空,将填入workerid为',res.result.openid)
            // 更新二次修理维修工程师
            db.collection('repair').doc(id).update({
              data:{
                isAccept:1,
                description: '工程师已授理，等待维护，请留意维修进度',
                workerID2:res.result.openid,// 更新二次修理维修工程师
                isDouble:1,//二次修理标识符置为1
                acceptTime2:time
              }
            }).then(res => {
              console.log('授理完成',res),
              wx.showToast({
                title: '已授理',
                icon: 'success',
                duration: 2000
              });
            })
          })
        }
        else{
          // 发生并发事件，工单已被接单，自动重新初始化数据
          wx.showToast({
            title: '数据已过期',
            icon: 'loading',
            duration: 2000
          });
        }
                
      })


      
    
  },

  onPullDownRefresh() {
    this.onLoad();
    wx.stopPullDownRefresh();
    console.log('停止数据加载');
  },

  // 初始化数据
  initData(){
    var _this = this;
    // 1.0版本逻辑:获取全部数据，在渲染层进行数据筛选显示
    // 2.0版本：提取repair库中isAccept为0的数据（未接单 / 退单待二次接单 的工单）
    // 当前逻辑：提取repair库中未接单，同事第一工程师不是自己的工单，避免重复接单
    wx.cloud.callFunction({
      name: "login",  //该名字是云函数名字
    }).then(res => {
      db.collection('repair').orderBy('time', 'desc').where({
        isAccept:0,
        workerID1:_.neq(res.result.openid)//第一次被退单的工程师第二次将不显示已被退单的工单，避免二次重复接单
      }).get({
        success: res => {
          console.log('onLoad页面加载：',res.data);
          console.log(this);
          this.setData({
            list: res.data,
            images: res.data
          })
        }
      })
    })
    for (let i = 0; i < 14; i++) {

      build.choose[i].name = build.choose[i];
      build.choose[i].id = i;
    }
    this.setData({
      build: build[0],
      listCur: build.choose[0],
    });
  },

  onShow(){
    if (app.globalData.repaiFlag) {
      app.globalData.Flag = false;
      this.initData();//调用接口获取数据
    } 
  },

  onLoad() {
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 2000
    });
    this.initData()
    
  },

  onReady() {
    wx.hideLoading()
  },

  // 一下函数为页面显示js，与业务逻辑无关
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },

  VerticalMain(e) {
    let that = this;
    let build = this.data.build.choose;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < build.choose.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + build.choose[i].id);
        view.fields({
          size: true
        }, data => {
          build.choose[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          build.choose[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        build: build.choose
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < build.choose.length; i++) {
      if (scrollTop > build.choose[i].top && scrollTop < build.choose[i].bottom) {
        that.setData({
          VerticalNavTop: (build.choose[i].id - 1) * 50,
          TabCur: build.choose[i].id
        })
        return false
      }
    }
  }
})  
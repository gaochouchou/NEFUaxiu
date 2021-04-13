// miniprogram/pages/admin/human.js
const app = getApp();
var util = require('../../utils/util.js');
const db = wx.cloud.database();
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    invite:null, //从数据库获取第一条code实体对象
    tempinvitecode:null,//输入框输入的值
    workerlist:null,//工程师列表
  },

  // 输入框输入
  invitecodechange(e){
    this.setData({
      tempinvitecode: e.detail.value
    })
  },

  // 下拉刷新
  onPullDownRefresh(){
    this.onLoad()    
  },

  // 重新统计工程师业务数据
  statisticworker(e){
    // 获取当前点击的工程师id
    var workerid=e.currentTarget.dataset.workerid

    // 更新已完成的工单数
    db.collection('repair').where(_.or([{
      isDouble:0,
      isRepair:1,
      workerID1:workerid
    },
    {
      isDouble:1,
      isRepair:1,
      workerID2:workerid
    }
    ])).count().then(res => {
      console.log(res.total)
      // 更新数据库
      db.collection('worker').where({
        openid:workerid
      }).update({
        data:{
          finishorder:res.total
        }
      }).then(res => {
        wx.showToast({
          title: '数据已更新',
        })
        // 刷新页面
        this.onLoad()
      })
    })

  
  },

  // 更新邀请码
  updateinvitecode(){
    if(this.data.tempinvitecode === this.data.invite.invitecode){
      wx.showToast({
        icon:'error',
        title: '注册码相同',
      })
    }
    else{
      db.collection('invitecode').doc(this.data.invite._id).update({
        data:{
          invitecode:this.data.tempinvitecode
        }
      })
      .then(
        wx.showToast({
          title: '邀请码更新成功',
        })
      )
      .catch(console.error)
    }
  },

   // ListTouch触摸开始
   ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection =='left'){
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },

  // 加载工程师信息
  loadworkers(){
    console.log('加载工程师信息')
    db.collection('worker').get({
    }).then(res => {
      console.log('获取到工程师信息',res.data)
      this.setData({
        workerlist:res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log('数据刷新')
    // 加载注册码
    db.collection('invitecode').where({
    }).limit(1).get({
    }).then(res => {
      // console.log(res.data[0])
      this.setData({
        invite:res.data[0],
        tempinvitecode:res.data[0].invitecode
      })
    })

    // 加载工程师列表
    this.loadworkers()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
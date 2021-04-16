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

  // 删除工程师
  deleteworker(e){
    // 获取当前点击的工程师的记录的id（非工程师openid）
    var workerid=e.currentTarget.dataset.workerid

    // 删除数据
    db.collection('worker').where({
      _id:workerid,
    }).remove().then(res => {
      // console.log(res)
      wx.showToast({
        title: '该工程师已删除',
      })
      this.onLoad()
    })


  },

  // 重新统计工程师业务数据
  statisticworker(e){
    var _this=this

    // 获取当前点击的工程师id
    var workerid=e.currentTarget.dataset.workerid

    // 更新平均接收时间和处理时间（全部拉取数据，本地js处理）
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
    ])).get().then(res => {

      // 重新计算接单/完成工单时间
      var orderlist = res.data
      var sumfinish = 0 //临时求和，完成工单总和
      var sumaccept = 0 //临时求和，接受工单时间总和
      for(let i=0;i<orderlist.length;i++){
        // console.log(orderlist[i].finishTime)
        var finish=new Date(orderlist[i].finishTime)
        var accept=new Date(orderlist[i].acceptTime1)
        var create=new Date(orderlist[i].time)
        sumfinish = sumfinish + (finish-accept)/(1000*60*60)
        sumaccept = sumaccept + (accept-create)/(1000*60*60)
      }
      var avgfinish = sumfinish/orderlist.length
      var avgaccept = sumaccept/orderlist.length
      console.log(avgaccept+'/'+avgfinish)

      // 更新数据库
      db.collection('worker').where({
        openid:workerid
      }).update({
        data:{
          finishorder:res.data.length,
          averageaccepttime:parseInt(avgaccept),
          averagefinishtime:parseInt(avgfinish)
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
    db.collection('worker').get({
    }).then(res => {
      this.setData({
        workerlist:res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (callback) {
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
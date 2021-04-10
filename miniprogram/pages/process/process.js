// miniprogram/pages/process/process.js
const db = wx.cloud.database()
const cont = db.collection('repair')
var app = getApp()
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    images: []

  },
  //获取用户Openid
  getOpenid: function () {
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      console.log(res);
    });
  },
  //下拉刷新
  onPullDownRefresh(){
    this.showdata() ;
    this.onLoad();
    wx.stopPullDownRefresh();
    console.log('停止数据加载');    
  },
  //显示图片
  showdata: function () {
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      db.collection('repair').where({
        _openid: res.result.openid
      }).get().then(res2 => {
        this.setData({
          images: res2.data
        });
      }).catch(err => {

      })
    });
  },

  // 催单
  pressOrder(e){
    var orderid  = e.currentTarget.dataset.orderid
    console.log(orderid)
    db.collection('repair').doc(orderid).update({
      data:{
        urgeOrder:1
      }
    }).then(res => {
      console.log('催单已完成',res),
      wx.showToast({
        title: '已催单',
        icon: 'success',
        duration: 2000
      });
    })
  },

  // 优化按钮显示
  display(){
    console.log('优化按钮显示')
    var olist = this.data.list
    console.log(olist)
    var time = util.formatTime(new Date());
    console.log('time',time-olist[0].time)
    for(let i=0;i<olist.length;++i){
      if(olist[i].urgeOrder==1 || olist[i].isRepair==1){
        olist[i].urgeOrder = true
      }
      else{
        olist[i].urgeOrder = false
      }
    }
    this.setData({
      list :olist
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('数据刷新');

    var _this = this;

    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      db.collection('repair').where({
        _openid: res.result.openid
      }).orderBy('time', 'desc').get({
        success: res => {
          console.log(res.data[0]);
          // console.log(this);
          this.setData({
            list: res.data
          })
          this.display()
        }
      })
    });   


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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function () {

  // },

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
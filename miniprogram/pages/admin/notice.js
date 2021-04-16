// miniprogram/pages/admin/notice.js

const app = getApp();
var util = require('../../utils/util.js');
const db = wx.cloud.database();
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuCard:true,//卡片显示
    menuArrow:true,//箭头显示
    noticeList:[],//通知列表

  },

  // 下拉刷新
  onPullDownRefresh(){
    this.onLoad()
  },

  // 跳转编辑通知
  noticeedit(e){
    var noticid = e.currentTarget.dataset.noticeid
    var navigateUrl='/pages/repair/noticeEdit?id='+noticid
    wx.navigateTo({
      url: navigateUrl,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('update')
    // 加载全部通知
    db.collection('notice').orderBy('time','desc').get(

    ).then(res => {
      console.log(res.data)
      this.setData({
        noticeList : res.data
      })
      
    })

    wx.stopPullDownRefresh({
      success: (res) => {},
    })


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
  onPullDownRefresh: function () {

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
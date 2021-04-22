// miniprogram/pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 维修员工入口
  workerentry(){
    wx.navigateTo({
      url: '/pages/repair/passwords?type='+'worker',
    })
  },

  // 管理中心入口
  adminentry(){
    wx.navigateTo({
      url: '/pages/repair/passwords?type='+'admin',
    })
  },

  // 模态框控制函数
  showInfo: function () {
    wx.showModal({
      title: '关于东林阿修',
      content: '本小程序由大二小萌新“带着笔记本去冒险”团队独家制作，如有问题及改进意见，请联系微信：wit_jie',
      showCancel: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
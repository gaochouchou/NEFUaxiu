const db = wx.cloud.database()
const cont = db.collection('notice')
const app = getApp();
Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    TabCur: 0,
    tabNav: ['最新公告', '常见问题'],
    list: []
  },
  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    },
    )
  },
  gotofeedBack:function(){
    we.navigateTo({
      url: '../process/process', 
    })
  },
  //下拉刷新
  onPullDownRefresh() {
    this.onLoad();
    wx.stopPullDownRefresh();    
    console.log('停止数据加载');
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad更新数据');

    var _this = this;
    db.collection('notice').orderBy('time', 'desc').get({
      success: res => {
        console.log(res.data[0]);
        // console.log(this);
        this.setData({
          list: res.data
        })
      }
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

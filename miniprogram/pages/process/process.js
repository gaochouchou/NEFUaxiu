// miniprogram/pages/process/process.js
const db = wx.cloud.database()
const cont = db.collection('repair')
var app = getApp()

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
            list: res.data,
            images: res.data
          })
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
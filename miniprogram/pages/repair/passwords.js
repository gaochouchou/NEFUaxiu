// miniprogram/pages/homePage/password.js
const db = wx.cloud.database()
const cont = db.collection('passwords')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password: null,//密码
    list: [],
    length: 0,
    screenWidth: 0,
    screenHeight: 0,
    imgwidth: 0,
    imgheight: 0,
  },

  //更改单文本框输入
  passwordChange(e) {
    console.log('password发生change事件，携带value值为：', e.detail.value);
    this.setData({
      password: e.detail.value
    })
  },

  // 数据库查询密码
  submit: function () {
    if (this.data.password == null) {
      wx.showToast({
        title: '密码不能为空',
        image: '../../images/error.png'
      });
    }
    else {
      console.log(this.data.password);
      db.collection('passwords').doc(this.data.password)      .get().then(res => {
        wx.showToast({
          title: '密码正确',
          icon: 'scuuess'
        });
        wx.navigateTo({
          url: '/pages/repair/repairindex/repairindex'
        }) ;
        console.log(res.data);
      })
        .catch(err => {
          wx.showToast({
          title: '密码错误',
          image: '../../images/error.png'
        });
          
          console.log(err);          
        })
     }
  },

  imageLoad: function (e) {
    var _this = this;
    var $width = e.detail.width,  //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;  //图片的真实宽高比例
    var viewWidth = 500,      //设置图片显示宽度，
      viewHeight = 500 / ratio;  //计算的高度值
    this.setData({
      imgwidth: viewWidth,
      imgheight: viewHeight
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
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
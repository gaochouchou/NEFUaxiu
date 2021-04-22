// miniprogram/pages/homePage/password.js
const db = wx.cloud.database()
const cont = db.collection('passwords')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',//用户名
    password: '',//密码
    list: [],
    length: 0,
    screenWidth: 0,
    screenHeight: 0,
    imgwidth: 0,
    imgheight: 0,
    registerurl:'../repair/register',
    redirectcurl:'/pages/repair/repairindex/repairindex'
  },

  // 注册跳转
  registerHandler(){
    wx.navigateTo({
      url: '/pages/repair/register',
    })
  },

  // 用户名输入
  usernameChange(e){
    this.setData({
      username: e.detail.value
    })
  },

  //更改单文本框输入
  passwordChange(e) {
    // console.log('password发生change事件，携带value值为：', e.detail.value);
    this.setData({
      password: e.detail.value
    })
  },

  // 免密登陆（openid）
  loginopenid(){
    // 获取维修员工openid，并写入
    wx.cloud.callFunction({
      name: "login",  //该名字是云函数名字
    }).then(res => {
      // 获取用户openid，获取后在回调函数中进行更新
      // console.log(res.result.openid)

      db.collection('worker').where({
        _openid:res.result.openid
      }).get().then(res =>{
        console.log(res.data)
        if((res.data).length>0){
          wx.showToast({
            title: '身份验证成功',
            duration:2000
          });
          wx.redirectTo({
            url: this.data.redirectcurl,
          }) ;
        }
        else{
          wx.showToast({
            title: '未授权',
            image: '../../images/error.png'
          }); 
        }
      })
    })
  },

  // 数据库查询密码登陆
  loginpassword: function () {
    // 判断输入是否有值
    if (this.data.password == '' || this.data.username =='') {
      wx.showToast({
        title: '用户名密码为空',
        image: '../../images/error.png'
      });
    }
    else {
      console.log(this.data.password);
      db.collection('worker').where({
        username:this.data.username,
        password:this.data.password
      }).get().then(res => {
        console.log(res.data);
        if(res.data.length > 0){
          wx.showToast({
            title: '密码正确',
            icon: 'scuuess'
          });
          wx.redirectTo({
            url: this.data.redirectcurl,
          });
        }else{
          wx.showToast({
            title: '密码错误',
            image: '../../images/error.png'
          });  
        }
        
      })
        .catch(err => {
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
    // 登陆页面通用，传入登陆页面类型，重置
    // console.log(options.type)
    if(options.type === 'admin'){
      this.setData({
        redirectcurl:'/pages/admin/admin-index'
      })
    }
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
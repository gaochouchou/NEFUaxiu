// miniprogram/pages/homePage/detailed/test1.js
var util = require('../../utils/util.js');
const db = wx.cloud.database()
const cont = db.collection('notice')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    head: null,//公告标题
    auhor: null,//公告发出单位
    textareaAValue: '',//长文本输入
    time: null,//时间
  },

  //更改公告标题框输入
  headChange(e) {
    console.log('notice发生change事件，携带value值为：', e.detail.value);
    this.setData({
      head: e.detail.value
    })
  },

  //更改单文本框输入
  authorChange(e) {
    console.log('author发生change事件，携带value值为：', e.detail.value);
    this.setData({
      author: e.detail.value
    })
  },

  // 长文本输入函数
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },

  // 数据库查询
  findNotice(){

  },

  // 数据库插入
  submit: function () {
    if (this.data.head == null || this.data.textareaAValue == null || this.data.author == null) {
      wx.showToast({
        title: '公告信息不完整',
        image: '../../images/error.png'
      });
    }
    else {
      // 调用函数时，传入new Date()参数，返回值是日期和时间
      var time = util.formatTime(new Date());
      // 再通过setData更改Page()里面的data，动态更新页面的数据
      this.setData({
        time: time
      });
      wx.showToast({
        title: '上传中',
        icon: 'loading'
      });
      db.collection('notice').add({
        data: {
          head: this.data.head,//通知标题
          author: this.data.author,//通知发出方
          textareaAValue: this.data.textareaAValue,//通知内容
          time: this.data.time,//通知时间
        }
      }).then(res => {
        console.log(res);
        wx.showToast({
          title: '公告发送成功',
          icon: 'success',
          duration: 2000
        });
      }).catch(err => {
        console.log(err);
        wx.showToast({
          title: '上传失败',
          image: '../../images/error.png'
        });

      })
      wx.switchTab({
        url: '../process/process',
        fail: function () {
          console.info("跳转失败")
        }
      });

    }

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
// miniprogram/pages/process/process.js
const db = wx.cloud.database()
const cont = db.collection('repair')
const _ = db.command
var app = getApp()
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    modalName:true
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
    // this.showdata() ;
    this.onLoad();
    wx.stopPullDownRefresh();
    console.log('停止数据加载');    
  },

  // 完成工单，调出模态框
  showModel(){
    this.setData({
      modalName:true
    })
  },

  // 隐藏模态框
  hideModal(){
    this.setData({
      modalName:false
    })
  },

  // 点击显示图片
  imgPreview(e){
    var src = e.currentTarget.dataset.imgsrc;//获取data-src
    var imgList = [e.currentTarget.dataset.imgsrc];//获取data-list
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },

  // 完成工单
  finishOrder(e){
    var Orderid = e.currentTarget.dataset.orderid
    var time = util.formatTime(new Date());
    console.log(Orderid)
    db.collection('repair').doc(Orderid).update({
      data:{
        isRepair:1,
        description: '维修已完成，感谢您的反馈',
        finishTime:time
      }
    }).then(res => {
      console.log('维修已完成',res),
      wx.showToast({
        title: '维修已完成',
        icon: 'success',
        duration: 2000
      });
    })
  },

  // 前端显示数据文本优化
  display(){
    var olist = this.data.list
    // console.log('List:',this.data.list)
    for(let i=0;i<olist.length;++i){
      // console.log(olist[i])
      if(olist[i].func == 'feedback'){
        olist[i].func = '损坏保修'
      }
      else{
        olist[i].func = '建设建议'
      }

      if(olist[i].isDouble == 1){
        olist[i].isDouble = '此工单为二次转派'
      }
      else{
        olist[i].isDouble = '否'
      }

      if(olist[i].urgeOrder == 1){
        olist[i].urgeOrder = '师生已催单，请尽快处理'
      }
      else{
        olist[i].urgeOrder = '否'
      }

      if(olist[i].abOrder == '1'){
        olist[i].abOrder = '异常工单'
      }
      else{
        olist[i].abOrder = '工单正常'
      }
    }
    this.setData({
      list:olist
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('数据刷新');

    var _this = this;

    // 从数据库获取工程师id为本人的工单
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      db.collection('repair').where(_.or([
        {
          workerID1: _.eq(res.result.openid),
          isRepair:0,
          isAccept:1,
          isDouble:0
        },
        {
          workerID2: _.eq(res.result.openid),
          isRepair:0,
          isAccept:1,
          isDouble:1
        }
      ])).orderBy('time', 'desc').get({
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
// miniprogram/pages/admin/material.js
const app = getApp();
var util = require('../../utils/util.js');
const db = wx.cloud.database();
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picker: ['喵喵喵', '汪汪汪', '哼唧哼唧'],
    materialname:'',
    materialunit:'',
    materiallist:[]

  },

  // 余量增加
  increase(e){
    var index = e.currentTarget.dataset.listindex
    // console.log(e.currentTarget.dataset.listindex)
    var list = this.data.materiallist
    list[index].num++
    // console.log(list[index])
    this.setData({
      materiallist:list
    })
    var time = util.formatTime(new Date());
    db.collection('material').doc(list[index]._id).update({
      data:{
        num:list[index].num,
        time:time
      }
    })
  },

   // 余量减少
   decrease(e){
    var index = e.currentTarget.dataset.listindex
    // console.log(e.currentTarget.dataset.listindex)
    var list = this.data.materiallist
    if(list[index].num > 0){
      list[index].num--
      this.setData({
        materiallist:list
      })
      var time = util.formatTime(new Date());
      db.collection('material').doc(list[index]._id).update({
        data:{
          num:list[index].num,
          time:time
        }
      })
    }
    // console.log(list[index])
    
  },
  

  // 新建耗材名
  materialname(e) {
    this.setData({
      materialname: e.detail.value
    })
  },
  
  // 新建耗材单位
  materialunit(e) {
    this.setData({
      materialunit: e.detail.value
    })
  },

  // 新建耗材(数据库提交)
  newmaterial(){
    var time = util.formatTime(new Date());
    db.collection('material').add({
      data:{
        materialname:this.data.materialname,
        materialunit:this.data.materialunit,
        num:0,
        time:time 
      }
    }).then(res => {
      this.setData({
        materialname:'',
        materialunit:''
      })
      wx.showToast({
        title: '新增耗材成功',
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('material').get({}).then(res => {
      this.setData({
        materiallist:res.data
      })
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
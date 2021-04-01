// miniprogram/pages/homePage/detailed/test1.js
var util = require('../../utils/util.js');
const db = wx.cloud.database()
const cont = db.collection('repair')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioValue: '',//单选框
    index: 0,//picker数组下角标
    building: null,//building值
    classroom: null,//classroom值
    picker: ['丹青楼', '锦绣楼', '成栋楼', '主楼', '交通学院实验中心', '图书馆A区', '图书馆B区', '研究生楼', '动资楼', '理学楼', '文法楼', '文博楼', '工程楼', '逸夫楼']
, //教学楼选择器备选
    imgList: [],//图片
    modalName: null,
    textareaAValue: '',//长文本输入
    time: null,//时间
    modalHidden: true,//是否隐藏对话框
    modalHidden_form: true,//是否隐藏对话框（表单）
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.setData({
      radioValue: e.detail.value
    })
  },

  // 选择器函数
  PickerChange(e) {
    console.log('Picker发生change事件，携带value值为：', e.detail.value);
    this.setData({
      index: e.detail.value
    })
  },

  //更改单文本框输入
  classRoomChange(e) {
    console.log('class发生change事件，携带value值为：', e.detail.value);
    this.setData({
      classroom: e.detail.value
    })
  },

  // 长文本输入函数
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },

  //image函数
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择或拍照
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '确定删除',
      content: '您确定要删除吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },

  // model确定取消按钮
  //确定按钮点击事件
  modalBindaconfirm: function () {
    this.setData({
      modalHidden: !this.data.modalHidden,
    })
    this.ChooseImage();
  },
  //取消按钮点击事件
  modalBindcancel: function () {
    this.setData({
      modalHidden: !this.data.modalHidden,
    })
  },

  // model确定取消按钮
  //确定按钮点击事件
  modalBindaconfirm_form: function () {
    this.setData({
      modalHidden_form: !this.data.modalHidden,
    })
  },
  //取消按钮点击事件
  modalBindcancel_form: function () {
    this.setData({
      modalHidden_form: !this.data.modalHidden,
    })
  },

  // 数据库插入
  submit: function () {
    if(this.data.classroom==null || this.data.textareaAValue==null){
      wx.showToast({
        title: '报修信息不完整',
        image: '../../images/error.png'
      });
    }
    else{
      const tempFilePaths = this.data.imgList
      wx.showToast({
        title: '上传中',
        icon: 'loading'
      });
      wx.cloud.uploadFile({
        cloudPath: new Date().getTime() + '.png',
        filePath: tempFilePaths[0], // 文件路径
        success: res => {
          // get resource ID
          console.log("图片上传成功" + res.fileID)
          db.collection('repair').add({
            data: {
              func:this.data.radioValue,//单选框值：报修/建议
              building: this.data.picker[this.data.index],//选择教学楼
              classroom: this.data.classroom,//选择教室号
              textareaAValue: this.data.textareaAValue,//详细问题
              fileID: res.fileID,//图片的fileId
              time: this.data.time,//同步提交反馈时间
              description: '提交成功，等待处理。',//当前处理进度
            }
          }).then(res => {
            console.log(res);
            wx.showToast({
              title: '新增记录成功',
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
        },

        fail: err => {
          // handle error
          // this.setData({
          //   modalHidden: !this.data.modalHidden
          // })
          wx.showToast({
            title: '请上传图片',
            image: '../../images/error.png'
          });
        }
      })
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
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      time: time
    });
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
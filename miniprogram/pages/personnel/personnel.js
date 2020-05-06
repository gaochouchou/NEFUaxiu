
const db = wx.cloud.database()
const cont = db.collection('repair')
var app = getApp()
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    images: [],
    list:[],
    build : [{ choose: '丹青楼' }, { choose: '锦绣楼' }, { choose: '成栋楼' }, { choose: '主楼' }, { choose: '交通学院' }, { choose: '图书馆A区' }, { choose: '图书馆B区'}, { choose: '研究生楼' }, { choose: '动资楼' }, { choose: '理学楼' }, { choose: '文法楼' }, { choose: '文博楼' }, { choose: '工程楼' }, { choose:'逸夫楼'}],
    load: true,
    Record:null,
  },
  showdata: function () {
    
      db.collection('repair').where({
        
      }).get().then(res2 => {
        this.setData({
          images: res2.data
        });
      }).catch(err => {

      })
    
  },
  // updata: function (e) {
  //   let id = e.currentTarget.dataset.id;
  //   console.log('id的值为：'+id),
  //     db.collection('repair').doc(id).update({
  //     data: {
  //       description: '已完成维修',
  //     }
  //   }).then(res => {
  //     wx.showToast({
  //       title: '更新记录成功',
  //       icon: 'success',
  //       duration: 2000
  //     });
  //     console.log('更改成功'),
  //     this.onLoad()
  //   }).catch(res=>{
  //     wx.showLoading({
  //       title: '更新失败',
  //       mask: true
  //     });
  //   })
  // },
  comfirm: function (e) {
    
    let id = e.currentTarget.dataset.id;
    db.collection('repair').doc(id).update({
      data: {
        description: '已完成维修',
        done: true
      }
    }).then(res => {
      console.log(res)
      this.onLoad

    })
  } ,
  onLoad() {
    
    var _this = this;
    db.collection('repair').orderBy('time', 'desc').get({
      success: res => {
        console.log(res.data[0]);
         console.log(this);
        this.setData({
          list: res.data,
          images: res.data
        })
      }
    })
    for (let i = 0; i < 14; i++) {
 
      build.choose[i].name = build.choose[i];
      build.choose[i].id = i;
    }
    this.setData({
      build: build[0],
      listCur: build.choose[0],
    });
      
  },
  onReady() {
    wx.hideLoading()
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  VerticalMain(e) {
    let that = this;
    let build = this.data.build.choose;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < build.choose.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + build.choose[i].id);
        view.fields({
          size: true
        }, data => {
          build.choose[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          build.choose[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        build: build.choose
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < build.choose.length; i++) {
      if (scrollTop > build.choose[i].top && scrollTop < build.choose[i].bottom) {
        that.setData({
          VerticalNavTop: (build.choose[i].id - 1) * 50,
          TabCur: build.choose[i].id
        })
        return false
      }
    }
  }
})
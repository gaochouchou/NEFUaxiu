const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    list: [{
        title: '我的工单',
        img: 'https://image.weilanwl.com/color2.0/plugin/sylb2244.jpg',
        url: '/repair/myOrder'
    },
      {
        title: '维修列表',
        img: 'https://image.weilanwl.com/color2.0/plugin/wdh2236.jpg',
        url: '/repair/repair'
      },
      {
        title: '耗材管理',
        img: 'https://image.weilanwl.com/color2.0/plugin/qpct2148.jpg',
        url: '/admin/material'
      },
      {
        title: '发送通知',
        img: 'https://image.weilanwl.com/color2.0/plugin/qpczdh2307.jpg',
        url: '/repair/notice'
      }
    ]
  },
  methods: {
    toChild(e) {
      wx.navigateTo({
        url: '/pages' + e.currentTarget.dataset.url
      })
    },
  }
});
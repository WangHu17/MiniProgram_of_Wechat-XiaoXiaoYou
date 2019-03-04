// pages/nologin/nologin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  login:function(e) {
    wx.reLaunch({
      url:"/pages/mine/mine"
    })
  }
})
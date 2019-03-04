// pages/setting/setting.js
var qcloud = require('../../vendor/wafer2-client-sdk/index');
// 引入配置
var config = require('../../config');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasFabu: false,
    loading: false,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.showLoading();
    let userOpenId = wx.getStorageSync('openId');
    qcloud.request({
      login: true,
      data: {
        openId: userOpenId,
      },
      url: `${app.appData.baseUrl}get_book_info`,
      success: function (res) {
        console.log("我的预约");
        console.log(res);
        that.setData({
          recommend: res.data.data
        })
        if (res.data.data.length != 0) {
          that.setData({
            hasFabu: true
          })
        }
      },
      fail: function (res) {
        console.log(res)
        require("../template/common.js").noNetWork();
      },
      complete: function (res) {
        that.hideLoading();
      },
    })
  },

  /**
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  showLoading: function () {
    this.setData({
      loading: true
    })
  },
  hideLoading: function () {
    this.setData({
      loading: false
    })
  },
  hotrecommend: function (e) {
    var actId = e.currentTarget.dataset.actId;
    wx.navigateTo({
      url: '/pages/act_detail/act_detail?activity_id=' + actId
    })
  },
})
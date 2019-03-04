var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
let app = getApp()
Page({
  data: {
    loading: false,
    joined:[]
  },
  onLoad:function(options) {
    var that = this;
    that.showLoading();
    var activity_id = options.activity_id;
    qcloud.request({
      login: true,
      data: {
        activity_id: activity_id
      },
      url: `${app.appData.baseUrl}get_user_info_activity`,
      success: function (res) {
        console.log("已报名游客信息");
        console.log(res);
        that.setData({
          joined: res.data.data
        })
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
  userInfodetail:function(e) {
    var indexId = e.currentTarget.dataset.indexId;
    var userdetail = this.data.joined[indexId];
    console.log(userdetail);
    app.globalData.guideInfoDetail = userdetail;
    wx.navigateTo({
      url: '/pages/visitors-data/visitor'
    })
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
})
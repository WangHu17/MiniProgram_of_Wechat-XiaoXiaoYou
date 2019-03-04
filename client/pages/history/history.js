// pages/history/history.js
var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
let app = getApp()
Page({
  data: {
    loading: false,
    haveFav: false,
    recommend: []
  },
  onShow: function (options) {
    var that = this;
    that.showLoading();
    var allFav = wx.getStorageSync('__fav__');
    console.log(allFav);
    var activity_id = [];
    for (var i in allFav) {
      if (allFav[i].bool == true){
        activity_id[i] = allFav[i].activity_id;
        activity_id[i] = parseInt(activity_id[i]);
      } 
    }
    console.log(activity_id);
    if (JSON.stringify(activity_id) != '{}') {
      qcloud.request({
        login: true,
        data: {
          activity_id: activity_id
        },
        url: `${app.appData.baseUrl}get_activity_info`,
        success: function (res) {
          console.log(res);
          that.setData({
            recommend: res.data.data
          })
          that.setData({
            haveFav: res.data.data.length ? true : false
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
    }
    else that.hideLoading();
  },
  recommend: function (e) {
    var actId = e.currentTarget.dataset.actId;
    wx.navigateTo({
      url: '/pages/act_detail/act_detail?activity_id=' + actId
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
  }
})
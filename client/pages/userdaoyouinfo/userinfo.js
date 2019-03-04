// pages/userinfo/userinfo.js
var qcloud = require('../../vendor/wafer2-client-sdk/index');
// 引入配置
var config = require('../../config');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    hasbianji:false,
    userInfo:{},
    gender:-1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.showLoading();
    var userOpenId = wx.getStorageSync('openId');
    var getavatarUrl = wx.getStorageSync('userInfo');
    if (getavatarUrl) {
      that.setData({
        avatarUrl: getavatarUrl.avatarUrl
      })
    }
    qcloud.request({
      login: true,
      data: {
        openId: userOpenId
      },
      url: `${app.appData.baseUrl}get_guider_info`,
      success: function (res) {
        console.log("得到导游信息");
        that.setData({
          userInfo: res.data.data[0],
          gender: res.data.data[0].gender
        })
      },
      fail: function (res) {
        require("../template/common.js").noNetWork();
      },
      complete: function (res) {
        console.log(res);
        that.hideLoading();
      },
    })
  },
  submit: function (e) {
    var that = this;
    var userOpenId = wx.getStorageSync('openId');
    console.log(e.detail.value);
    var gender = that.data.gender;
    console.log(gender);
    that.showLoading();
    qcloud.request({
      login: true,
      data: {
        openId: userOpenId,
        name: e.detail.value.name,
        phonenumber: e.detail.value.phone,
        QQ: e.detail.value.qq,
        gender: gender,
        school: e.detail.value.school,
        studentId: e.detail.value.studentId,
        memo: e.detail.value.memo
      },
      url: `${app.appData.baseUrl}update_guider_info`,
      success: function (res) {
        console.log("导游信息成功修改");
        wx.showToast({
          title: '修改成功',
        })
      },
      fail: function (res) {
        console.log(res);
        require("../template/common.js").noNetWork();
      },
      complete: function (res) {
        that.hideLoading();
      },
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
  refresh:function() {
    var that = this;
    that.setData({
      hasbianji:true
    })
  },
  usersex:function(e) {
    console.log(e.detail.value);
    this.setData({
      gender:e.detail.value
    })
  }
})
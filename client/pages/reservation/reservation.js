var utils = require("../../utils/util.js");
var qcloud = require('../../vendor/wafer2-client-sdk/index');
// 引入配置
var config = require('../../config');
let app = getApp()
Page({
  data: {
    loading: false,
    startDate: "选择出发日期",
    introduce1: false,
    user_school: "请选择学校",
    usersex:-1,
    activity_id:""
  },
  onLoad:function(options) {
    var that = this;
    var activity_id = options.activity_id;
    that.setData({
      activity_id: activity_id
    })
    console.log(activity_id)
  },
  
  bindDateChange: function (e) {
    console.log("picker发送选择改变，携带值为:", e.detail.value)
    this.setData({
      startDate: e.detail.value
    })
  },
  actIntroduce1: function (e) {
    this.setData({
      introduce1: !this.data.introduce1
    })
  },

  submit: function () {
    wx.showToast({
      title: '预约成功',
      icon: 'success',
      duration: 2000
    })
  },
  bindFormSubmit: function (e) {
    var that = this;
    var book_name = e.detail.value.book_name;
    var phonenumber = e.detail.value.phonenumber;
    var qq = e.detail.value.qq;
    var idcard = e.detail.value.idcard;
    var gender = e.detail.value.gender;
    var studentId = e.detail.value.studentId;
    var userOpenId = wx.getStorageSync("openId");
    console.log(gender);
    if (book_name.length == 0) {
      var content = "姓名不能为空";
      printf1(content);
      return false;
    }
    if (that.data.sex == -1) {
      var content = "请填写性别";
      printf1(content);
      return false;
    }
    if (qq.length == 0) {
      var content = "QQ不能为空";
      printf1(content);
      return false;
    }
    if (that.data.user_school == "请选择学校") {
      var content = "请选择学校";
      printf1(content);
      return false;
    }
    if (studentId.length == 0) {
      var content = "学号不能为空";
      printf1(content);
      return false;
    }
    if (phonenumber.length < 10) {
      var content = phonenumber.length == 0 ? "联系电话不能为空" : "联系电话格式错误";
      printf1(content);
      return false;
    }
    if (idcard.length < 17) {
      var content = idcard.length == 0 ? "身份证号不能为空" : "身份证格式不对";
      printf1(content);
      return false;
    }
    console.log("用户发起活动所携带的数据为:", e.detail.value);
    that.showLoading();
    var time = utils.formatTime(new Date());
    console.log(time);
    var userInfo = wx.getStorageSync('userInfo');
    qcloud.request({
      login: true,
      data: {
        activity_id: that.data.activity_id,
        openId: userOpenId,
        name: book_name,
        phonenumber: phonenumber,
        QQ: qq,
        id_card: idcard,
        gender: that.data.usersex,
        school: that.data.user_school,
        studentId: studentId,
        userInfo: userInfo
      },
      url: `${app.appData.baseUrl}upload_user_info`,
      success: function (res) {
        console.log("用户成功报名");
        wx.setStorageSync('hasReservation', true);
        that.toindex();
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
  toindex:function() {
    wx.showToast({
      title: '恭喜你，预约成功',
      duration:1500
    })
    wx.navigateBack({
      url: '/pages/act_detail/act_detail'
    })
  },
  getSex:function(e) {
    console.log(e.detail.value);
    this.setData({
      usersex: e.detail.value
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
  onShow: function () {
    if (app.globalData.school && app.globalData.province) {
      this.setData({
        user_school: app.globalData.school,
        user_province: app.globalData.province,
      })
    }
  },
  selectschool: function (e) {
    wx.navigateTo({
      url: '/pages/schoolList/schoolList'
    })
  },
})
function printf1(data) {
  wx.showModal({
    title: '预约失败',
    content: data
  })
}
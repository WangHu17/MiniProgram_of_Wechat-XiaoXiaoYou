
var qcloud = require('../../vendor/wafer2-client-sdk/index');
// 引入配置
var config = require('../../config');
let app = getApp()
Page({
  data:{
    loading:false,
    user_school:"请选择学校",
    user_province:"",
    usersex:-1
  },
  usersex:function(e) {
    this.setData({
      usersex: e.detail.value
    })
  },
  actIntroduce1: function (e) {
    this.setData({
      introduce1: !this.data.introduce1
    })
  },
  submit: function () {
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 2000
    })
  },
  selectschool:function(e) {
    wx.navigateTo({
      url: '/pages/schoolList/schoolList'
    })
  },
  bindFormSubmit: function (e) {
    var that = this;
    var leader_name = e.detail.value.leader_name;
    var phonenumber = e.detail.value.phonenumber;
    var qq = e.detail.value.qq;
    var idcard = e.detail.value.idcard;
    var gender = e.detail.value.gender;
    var studentId = e.detail.value.studentId;
    var userOpenId = wx.getStorageSync('openId');
    var userInfo = wx.getStorageSync('userInfo');
    var memo = e.detail.value.memo;
    if (leader_name.length == 0) {
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
    qcloud.request({
      login: true,
      data: {
        openId: userOpenId,
        name: leader_name,
        phonenumber: phonenumber,
        QQ: qq,
        id_card: idcard,
        gender: that.data.usersex,
        school: app.globalData.school,
        studentId: studentId,
        memo:memo,
        userInfo: userInfo
      },
      url: `${app.appData.baseUrl}upload_guider_info`,
      success: function (res) {
        console.log("用户成功导游");
        wx.setStorageSync('hasConfirm', true);
        that.toact1();
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
  toact1:function(){
    wx.reLaunch({
      url: '/pages/act1/act1',
    })
  },
  onShow:function(e) {
    if (app.globalData.school && app.globalData.province) {
      this.setData({
        user_school: app.globalData.school,
        user_province: app.globalData.province,
      })
    }
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
function printf1(data) {
  wx.showModal({
    title: '预约失败',
    content: data
  })
}

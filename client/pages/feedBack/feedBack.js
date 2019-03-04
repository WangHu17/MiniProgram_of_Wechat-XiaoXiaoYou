
var qcloud = require('../../vendor/wafer2-client-sdk/index');

// 引入配置
var config = require('../../config');
let app = getApp()
// pages/feedBack/feedBack.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:false,
    formId: "",
  },
  submitOk: function () {
    wx.showToast({
      title: '提交成功',
      icon: "success",
      duration: 1000,
      mask: true,
    })
  },
  onLoad: function (options) {
    
  },
  printf: function (value) {
    wx.showModal({
      title: '提交失败',
      content: value,
    })
  },
  Isemail: function (email) {
    var reemail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    return (reemail.test(email));
  },
  bindFormSubmit: function (e) {
    var that = this;
    var title = e.detail.value.title;
    var suggest = e.detail.value.suggest;
    var phonenumber = e.detail.value.phonenumber;
    var email = e.detail.value.email;
    var title_content = "主题不能为空", suggest_content = "意见填写不能为空", phonenumber_content = "请填写正确的手机号码",email_content = "请填写正确的邮箱格式";
    if (title.length == 0) {
      this.printf(title_content);
      return false;
    }
    if (suggest.length == 0) {
      this.printf(suggest_content);
      return false;
    }
    if (phonenumber.length < 11) {
      this.printf(phonenumber_content);
      return false;
    }
    if (email.length && !this.Isemail(email)) {
      this.printf(email_content);
      return false;
    }
    //console.log(e.detail.value);
    that.hideLoading();
    qcloud.request({
      login:true,
      url: `${app.appData.baseUrl}upload_feedback`,
     // method:'post',
      data:{
        title: title,
        suggest: suggest,
        phonenumber: phonenumber,
        email: email
      },
      success:  function(res) {
        that.hideLoading();
        that.submitOk();
        console.log(res);
      },
      fail:function(res) {
        that.hideLoading();
        console.log(res);
        require("../template/common.js").noNetWork();
      }
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
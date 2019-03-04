var qcloud = require('../../vendor/wafer2-client-sdk/index');
// 引入配置
var config = require('../../config');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:false,
    localImg: "",
    haschooseimg: false,
    introduce1: false,
    uploadUrl: config.service.uploadUrl
  },
  actIntroduce1: function (e) {
    this.setData({
      introduce1: !this.data.introduce1
    })
  },

  bindDateChange2: function (e) {
    console.log("picker发送选择改变，携带值为:", e.detail.value)
    this.setData({
      endDate: e.detail.value,
    })
  },
/*  chooseImg: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (res) {
        that.setData({
          haschooseimg: true
        })
        upload(that, res.tempFilePaths);
      },
    })
  },
*/
  doUpload() {
    var that = this;
    that.showLoading();
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var filePath = res.tempFilePaths[0]
        wx.uploadFile({
          url: that.data.uploadUrl,
          filePath: filePath,
          name: 'file',

          success: function (res) {
            console.log('上传图片成功')
            res = JSON.parse(res.data)
            console.log(res)
            that.setData({
              haschooseimg: true,
              imgUrl: res.data.imgUrl
            })
            that.hideLoading();
          },

          fail: function (e) {
            console.error(e)
            require("../template/common.js").noNetWork();
            that.hideLoading();
          }
        })

      },
      fail: function (e) {
        console.error(e);
        that.hideLoading();
      }
    })
  },
  /*
  upload: function (page, path) {
      var that = this;
      that.showLoading();
      wx.uploadFile({
        url: constant.SERVER_URL + "/FileUploadServlet",
        filePath: path[0],
        name: 'imgFile',
        header: {
          "Content-Type": "multipart/form-data",
          'accept': 'application/json',
        },
        formData: {
          //和服务器约定的token, 一般也可以放在header中
          'session_token': wx.getStorageSync('session_token')
        },
        success: function (res) {
          console.log(res);
          if (res.statusCode != 200) {
            require("../template/common.js").noNetWork();
            return;
          }
          var data = res.data
          page.setData({  //上传成功修改显示头像
            src: path[0]
          })
        },
        fail: function (e) {
          console.log(e);
          require("../template/common.js").noNetWork();
        },
        complete: function () {
          that.hideLoading();
        }
      })
  },
  */
  submit: function (e) {
    wx.showToast({
      title: '提交成功',
      icon: "success",
      duration: 2000,
    })
  },
  bindFormSubmit: function (e) {
    var that = this;
    var activity_title = e.detail.value.activity_title;
    var activity_introduce = e.detail.value.activity_introduce;
    var activity_money = e.detail.value.activity_money;
    var activity_leader_money = e.detail.value.activity_leader_money;
    if (activity_title.length == 0) {
      var content = "活动标题不能为空";
      printf1(content);
      return false;
    }
    if (activity_money.length == 0) {
      var content = "活动简介不能为空";
      printf1(content);
      return false;
    }
    if (activity_money.length == 0) {
      var content = "活动预算不能为空";
      printf1(content);
      return false;
    }
    if (activity_leader_money.length == 0) {
      var content = "带领费用不能为空";
      printf1(content);
      return false;
    }
    app.globalData.act2 = e.detail.value;
    that.toact3();
  },
  toact3:function() {
    wx.navigateTo({
      url: '/pages/act3/act3?imgUrl=' + this.data.imgUrl
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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


  /**
   * 生命周期函数--监听页面显示
   */
})

function printf1(data) {
  wx.showModal({
    title: '提交失败',
    content: data
  })
}
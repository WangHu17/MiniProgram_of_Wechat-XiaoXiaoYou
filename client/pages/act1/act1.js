const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:false,
    school: [],
    user_school: "请选择学校",
    user_province: ""
  },
  selectSchool: function (e) {
    wx.navigateTo({
      url: '/pages/schoolList/schoolList'
    })
  },
  submit: function (e) {
    wx.showToast({
      title: '提交成功',
      icon: "success",
      duration: 2000,
    })
  },
  bindFormSubmit: function (e) {
    var that = this;
    var activity_area = e.detail.value.activity_area;
    var user_school = e.detail.value.user_school;
    
    if (user_school == "请选择学校") {
      var content = "请选择学校";
      printf1(content);
      return false;
    }
    if (activity_area.length == 0) {
      var content = "活动地点不能为空";
      printf1(content);
      return false;
    }
    app.globalData.act1 = e.detail.value;
    that.toact2();
  },
  toact2:function() {
    wx.navigateTo({
      url: '/pages/act2/act2'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!app.globalData.userInfo) {
      wx.redirectTo({
        url: '/pages/nologin/nologin',
      })
      return false;
    }
    var hasConfirm = wx.getStorageSync('hasConfirm');
    if (hasConfirm == true) {
      wx.navigateTo({
        url: '/pages/act1/act1',
      })
    }
    else {
      wx.redirectTo({
        url: '/pages/leader/leader'
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
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
    title: '提交失败',
    content: data
  })
}
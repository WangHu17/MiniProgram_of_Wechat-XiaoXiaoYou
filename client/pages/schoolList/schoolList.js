// pages/schoolList/schoolList.js
const app = getApp();
var province = require("../../map/school.js").province;
var schools = require("../../map/school.js").schools;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    province_index:0,
    school_index:0,
    user_province:"",
    user_school:"",
    seleted1:false,
    selected2:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      province: province,
      schools: schools[0],
    })
  },
  bindProvinceChange:function(e) {
    var city = province[e.detail.value];
    console.log("用户所选城市:" + city);
    this.setData({
      province_index: e.detail.value,
      schools: schools[e.detail.value],
      school_index:0,
      user_province: city,
      user_school: schools[e.detail.value][0].name,
      seleted1:true
    })
  },
  bindSchoolChange: function (e) {
    var schoolName = schools[this.data.province_index][e.detail.value].name;
    console.log("用户所选学校:" + schoolName);
    this.setData({
      school_index: e.detail.value,
      user_school: schoolName,
      selected2:true
    })
  },
  bindSure:function(e) {
    if (this.data.selected2 == false || this.data.selected1 == false) {
      wx.showToast({
        title: '提交失败',
        duration:1500,
        image:"/images/fail.png"
      })
      console.log("用户没有选择");
      return false;
    }
    app.globalData.province = this.data.user_province;
    app.globalData.school = this.data.user_school;
    console.log(app.globalData.province + " " + app.globalData.school);
    wx.showToast({
      title: '提交成功',
      duration:1500
    })
    wx.navigateBack({
      url: "/pages/activity/activity"
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})
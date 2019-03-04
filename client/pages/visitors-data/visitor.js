let app = getApp()
Page({
  data:{
  },
  onLoad: function (e) {
    var userdetail = app.globalData.guideInfoDetail;
    console.log("报名游客详细信息:");
    console.log(userdetail);
    this.setData({
      joined: userdetail
    })
  }
})
function noNetWork() {
  wx.showModal({
    title: '网络错误',
    content: '加载失败'
  })
}

exports.noNetWork =  noNetWork;
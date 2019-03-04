module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState == 1) {
    const query = ctx.query
    const { mysql } = require('../qcloud')
    await mysql('activity').insert({ activity_end_date: query.activity_end_date, activity_end_time: query.activity_end_time, activity_start_date: query.activity_start_date, activity_start_time: query.activity_start_time, user_phoneNumber: query.user_phoneNumber, activity_area: query.activity_area, activity_title: query.activity_title, activity_introduce: query.activity_introduce, user_school: query.user_school, id: query.id, openId: query.openId, imgUrl: query.imgUrl, activity_id: query.activity_id, provincecode: query.provincecode, activity_money: query.activity_money, activity_leader_money: query.activity_leader_money}).then(res => {//获取原始得分
      let arr = query.activity_end_date//返回时间进行测试
      ctx.state.data = arr
  })
  }else {
    ctx.state.code = -1
  }
}
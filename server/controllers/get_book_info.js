module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState == 1) {
    const query = ctx.query
    const { mysql } = require('../qcloud')
    let res = await mysql('activity').select('activity.activity_title', 'activity.user_phoneNumber', 'activity.activity_start_date', 'activity.activity_start_time', 'activity.activity_end_date', 'activity.activity_end_time', 'activity.activity_introduce', 'activity.	activity_area', 'activity.activity_money', 'activity.activity_leader_money', 'activity.user_school', 'activity.imgUrl', 'activity.activity_id').leftJoin('user_info', 'user_info.activity_id', 'activity.activity_id').where({ 'user_info.openId': query.openId })
    ctx.state.data = res
  } else {
    ctx.state.code = -1
  }
}

module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState == 1) {
    const query = ctx.query
    const { mysql } = require('../qcloud')
    let res = await mysql('activity').select('*').leftJoin('guider_info', 'activity.openId', 'guider_info.openId').where({ activity_id: query.activity_id })
    ctx.state.data = res
  } else {
    ctx.state.code = -1
  }
}
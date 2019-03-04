module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState == 1) {
    const query = ctx.query
    const { mysql } = require('../qcloud')
    await mysql('activity').where({activity_id:query.activity_id,openId:ctx.query.openId}).update({is_collected:!is_collected})
  } else {
    ctx.state.code = -1
  }
}
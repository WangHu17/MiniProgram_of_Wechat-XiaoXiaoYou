module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    const { mysql } = require('../qcloud')
    await mysql('activity_id_info').update({ activity_id: ctx.query.activity_id }).select('*')
  } else {
    ctx.state.code = -1
  }
}
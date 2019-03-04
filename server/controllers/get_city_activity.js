module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState == 1) {
    const query = ctx.query
    const { mysql } = require('../qcloud')
    let res = await mysql('activity').where({ id: query.id }).select('*')
    ctx.state.data = res
  } else {
    ctx.state.code = -1
  }
}
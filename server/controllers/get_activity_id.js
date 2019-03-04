module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    const { mysql } = require('../qcloud')
    let res = await mysql('activity_id_info').select('*')
   ctx.state.data = res
  } else {
    ctx.state.code = -1
  }
}
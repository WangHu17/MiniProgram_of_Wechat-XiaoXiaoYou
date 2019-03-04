module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState == 1) {
    const query = ctx.query
    const { mysql } = require('../qcloud')
    let provincecode =  mysql('city_info').where({ id: query.id }).select('provincecode')
    let res = await mysql('activity').where('provincecode' ,'in', provincecode).select('*')
    ctx.state.data = res;
  } else {
    ctx.state.code = -1
  }
}
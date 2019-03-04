module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState == 1) {
    const query = ctx.query
    const { mysql } = require('../qcloud')
    let res = await mysql('feedback').insert({ title: query.title, suggest: query.suggest, phonenumber: query.phonenumber, email: query.email }).returning('*')
    ctx.state.data = res[0]
  } else {
    ctx.state.code = -1
  }
}

module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState == 1) {
    const query = ctx.query
    const { mysql } = require('../qcloud')
    let res = await mysql('activity').where({ id: query.id }).select('*')
    let capacity = await mysql('activity').where({ id: query.id }).count('id')
    if (cnt + 4 <= capacity){
      var i
      var val = new Array()
      for(i = query.cnt;i < query.cnt + 4;i++)
        val[i] = res[i]
      ctx.state.data = val
    }else{
      flag = false
      ctx.state.data = flag
    }
  } else {
    ctx.state.code = -1
  }
}
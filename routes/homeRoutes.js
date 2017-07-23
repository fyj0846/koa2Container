/**
 * Created by qiujian on 7/18/17.
 */
//async function to render home.html page
var user = null;
module.exports.showHome = async (ctx) => {
  await ctx.render('home');
}
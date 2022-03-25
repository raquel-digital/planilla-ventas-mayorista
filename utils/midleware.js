var loginOk = false;
var adminOk = false;

const middlewares = {

    isLogin : function (req, res, next) {
        // console.log(req.user)
        // if (req.user) return next();
        // res.redirect('/');
        let log = req.body
        const user = {usuario: "raquelmayo", contraseña: "local2665" }
        const admin = {usuario: "capriadmin", contraseña: "capri2665" }
        if(admin.usuario == log.usuario && admin.contraseña == log.contraseña ){
            
            adminOk = true;
            return next()
        }
        if(user.usuario == log.usuario && user.contraseña == log.contraseña){
            loginOk = true;
            return next()
        }else{
            return  res.redirect('/login');
        } 
    },
    logged : function (req, res, next) {
        if(loginOk || adminOk){
              return next()
        }else{
            res.redirect('/login')
            return next();
        }
    },
    superAdmin : function (req, res, next){
        if(adminOk){
            next()
      }else{
          res.redirect('/login')
          return next();
      }
    },
    superAdminCheck : function () {
        if(adminOk){
            return true;
        }else{
            return false;
        }
    },
    salir: function () {
        loginOk = false;
        adminOk = false;
        
    }
    
};
module.exports = middlewares;
/**
 * User Controller
 * 사용자 정보 컨트롤러
 * */

const approot = require('app-root-path');
const User = require(approot + '/routes/models/user.model');
const crypto = require('crypto');


const main = async (req, res, next) => {
  req.session.destroy();
  res.clearCookie('sid'); // 세션 쿠키 삭제
  console.log("세션정보 : : :", req.session)
  res.render('index');
};




const joinPage = async (req, res, next) => {
  let session = req.session;
  console.log("세션정보 : : :", req.session)
  res.render("join", {
    session: session
  });
}

const home = async (req, res, next) => {
  let session = req.session;
  console.log("세션정보 : : :", req.session)
  if (session.user == undefined) {
    res.render('index', {
      session: session
    });
  } else {
    res.render('home', {
      session: session
    });
  }
}


const logout = async (req, res, next) => {
  req.session.destroy();
  res.clearCookie('sid');
  res.render("index")
};


const idPwFind = async (req, res, next) => {
  let session = req.session;
  res.render("idPwFind", {
    session: session
  })
};


const password_crypto = (password) => {
  return crypto.createHash('sha512').update(password).digest('base64')
}




const reJoin = async (req, res, next) => {
  let session = req.session;
  let userInfo = req.body;
  userInfo = {
    userId: req.session.user.id,
    userPw: password_crypto(userInfo.userPw),
    userName: userInfo.userName,
    userEmail: userInfo.userEmail
  }
  try {
    if (userInfo.userName == "" || userInfo.userPw || userInfo.userEmail) {
      return res.send({
        result: "fail",
        url: "/joinPage",
        session: session,
        message: "회원 정보 수정을 실패 하였습니다. 다시 수정해 주세요."
      })
    } else {


      let result = await User.reJoin(userInfo);

      if (result.result == 'updated') {
        console.log("세션정보 : : :", req.session)
        return res.send({
          result: "success",
          url: "/",
          session: session,
          message: "회원 정보 수정을 완료하였습니다. 변경한 정보로 다시 로그인 해주세요."
        })
      } else {
        return res.send({
          result: "fail",
          url: "/joinPage",
          session: session,
          message: "회원 정보 수정을 실패 하였습니다. 다시 수정해 주세요."
        })
      }
    }
  } catch (err) {
    throw err;
  }
};



const findId = async (req, res, next) => {
  const userInfo = req.body;

  try {
    let result = await User.findId(userInfo);
    result = result.hits.hits
    if (result == "") {
      var data = {
        result: "fail",
        message: "찾으시는 정보가 없습니다."
      };
    } else {
      data = {
        result: "success",
        url: "/",
        message: "찾으시는 아이디는 " + result[0]._source.id + "입니다."
      }
    }
    res.send(data);
  } catch (err) {
    throw err;
  }
};


const login = async (req, res, next) => {
  userInfo = req.body
  let session = req.session;
  let userId = userInfo.userId;
  let userPw = password_crypto(userInfo.userPw);
  console.log(userInfo)
  try {
    let result = await User.login(userId, userPw);
    result = result.hits.hits
    if (result == "") {
      return res.send({
        result: "fail",
        url: "/index",
        session: session,
        message: "계정을 찾을 수 없습니다."
      })
    } else {
      req.session.user = {
        id: result[0]._source.id,
        name: result[0]._source.name,
        email: result[0]._source.email
      };
      console.log("세션정보 : : :", req.session)
      return res.send({
        result: "success",
        url: "/home",
        session: session
      })
    }

  } catch (err) {
    throw err;
  }
};


const idCheck = async (req, res, next) => {
  const idText = req.body;
  try {
    let result = await User.idCheck(idText.userId);
    result = result.hits.hits
    if (result == "") {
      var data = {
        result: "fail"
      };
    } else {
      data = {
        result: "success"
      }
    }
    res.send(data);
  } catch (err) {
    throw err;
  }
};



const join = async (req, res, next) => {
  let userInfo = req.body;
  let result = await User.idCheck(userInfo.userId);
  userInfo = {
    userId: userInfo.userId,
    userPw: password_crypto(userInfo.userPw),
    userName: userInfo.userName,
    userEmail: userInfo.userEmail
  }
  try {
    if (result.hits.hits == "") {
      await User.join(userInfo);

      res.send({
        result: "success",
        url: "/"
      });
    } else {
      res.send({
        result: "fail",
        url: "/joinPage"
      });
    }
  } catch (err) {
    throw err;
  }
};







const findPw = async (req, res, next) => {
  let session = req.session;
  const userInfo = req.body;
  try {
    let result = await User.findPw(userInfo);
    result = result.hits.hits
    if (result == "") {
      var data = {
        result: "fail",
        message: "찾으시는 정보가 없습니다."
      };
    } else {
      req.session.user = {
        id: result[0]._source.id,
        name: result[0]._source.name,
        email: result[0]._source.email
      };
      data = {
        result: "success",
        session: session,
        message: "변경하실 비밀번호를 입력해 주세요."
      }
    }
    res.send(data);
  } catch (err) {
    throw err;
  }
};





const rePassword = async (req, res, next) => {
  let session = req.session;
  let userInfo = req.body;
  console.log(123, userInfo)
  userInfo = {
    userId: req.session.user.id,
    userPw: password_crypto(userInfo.pass),
    userName: req.session.user.name,
    userEmail: req.session.user.email
  }
  try {
    let result = await User.rePassword(userInfo);

    if (result.result == 'updated') {
      return res.send({
        result: "success",
        url: "/",
        session: session,
        message: "비밀번호 수정을 완료하였습니다. 변경한 정보로 다시 로그인 해주세요."
      })
    } else {
      return res.send({
        result: "fail",
        url: "/idPwFind",
        session: session,
        message: "비밀번호 수정을 실패 하였습니다. 다시 수정해 주세요."
      })
    }

  } catch (err) {
    throw err;
  }
};




module.exports = {
  main: main,
  login: login,
  joinPage: joinPage,
  join: join,
  idCheck: idCheck,
  home: home,
  logout: logout,
  reJoin: reJoin,
  idPwFind: idPwFind,
  findId: findId,
  findPw: findPw,
  rePassword: rePassword
};
const router = require("express").Router();
// `checkUsernameFree`, `checkUsernameExists` ve `checkPasswordLength` gereklidir (require)
// `auth-middleware.js` deki middleware fonksiyonları. Bunlara burda ihtiyacınız var!
const mw = require("./auth-middleware");
const bcryptjs = require("bcryptjs");
const userModel = require("../users/users-model");

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status: 201
  {
    "user_id": 2,
    "username": "sue"
  }

  response username alınmış:
  status: 422
  {
    "message": "Username kullaniliyor"
  }

  response şifre 3 ya da daha az karakterli:
  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
 */
router.post(
  "/register",
  mw.sifreGecerlimi,
  mw.usernameBostami,
  async (req, res, next) => {
    try {
      let hashedPassword = bcryptjs.hashSync(req.body.password);
      let model = { username: req.body.username, password: hashedPassword };
      let insertedUser = await userModel.ekle(model);
      res.status(201).json(insertedUser);
    } catch (error) {
      next(error);
    }
  }
);

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status: 200
  {
    "message": "Hoşgeldin sue!"
  }

  response geçersiz kriter:
  status: 401
  {
    "message": "Geçersiz kriter!"
  }
 */
router.post("/login", mw.usernameVarmi, async (req, res, next) => {
  try {
    let isValidPassword = bcryptjs.compareSync(
      req.body.password,
      req.existUser.password
    );
    if (isValidPassword) {
      req.session.user_id = req.existUser.user_id;
      res.json({
        message: `Hoşgeldin ${req.body.username}`,
      });
    } else {
      next({
        status: 401,
        message: "Geçersiz kriter!",
      });
    }
  } catch (error) {
    next(error);
  }
});
/**
  3 [GET] /api/auth/logout

  response giriş yapmış kullanıcılar için:
  status: 200
  {
    "message": "Çıkış yapildi"
  }

  response giriş yapmamış kullanıcılar için:
  status: 200
  {
    "message": "Oturum bulunamadı!"
  }
 */
router.get("/logout", (req, res, next) => {
  try {
    if (req.session.user_id) {
      req.session.destroy((err) => {
        if (err) {
          res
            .status(500)
            .json({ message: "session destroy edilirken hata oluştu" });
        } else {
          res.json({ message: "Çıkış yapildi" });
        }
      });
    } else {
      res.status(200).json({
        message: "Oturum bulunamadı!",
      });
    }
  } catch (error) {}
});
// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.
module.exports = router;

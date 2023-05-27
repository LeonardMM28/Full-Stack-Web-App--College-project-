var express = require("express");
var router = express.Router();
var db = require("../conf/database");
var bcrypt = require("bcrypt");
var { isLoggedIn, isMyProfile } = require("../middleware/auth");
const {
  isUsernameUnique,
  usernameCheck,
  passwordCheck,
  emailCheck,
  tosCheck,
  ageCheck,
  isEmailUnique,
} = require("../middleware/validation");
const { getPostsForUserBy } = require("../middleware/posts");

router.post(
  "/SignUp",
  isUsernameUnique,
  isEmailUnique,
  usernameCheck,
  passwordCheck,
  emailCheck,
  tosCheck,
  ageCheck,
  async function (req, res, next) {
    var { username, email, password, avatar } = req.body;
    try {
      var hashedPassword = await bcrypt.hash(password, 3);

      var [resultObject, fields] = await db.execute(
        `INSERT INTO users (username, email, password, image) VALUES (?, ?, ?, ?);`,
        [username, email, hashedPassword, avatar]
      );

      if (resultObject && resultObject.affectedRows == 1) {
        return res.redirect("/login");
      } else {
        return res.redirect("/SignUp");
      }
    } catch (error) {
      next(error);
    }
  }
);

router.post("/login", async function (req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    req.flash("error", "Invalid credentials! Try again.");
    req.session.save(function (err) {
      return res.redirect("/login");
    });
  } else {
    var [rows, fields] = await db.execute(
      `SELECT id,username,password,email,image FROM users where username=?;`,
      [username]
    );
    var user = rows[0];
    if (!user) {
      req.flash("error", "Invalid credentials! Try again.");
      req.session.save(function (err) {
        return res.redirect("/login");
      });
    } else {
      var passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        req.session.user = {
          userId: user.id,
          email: user.email,
          username: user.username,
          image: user.image,
        };
        req.flash("success", "Successfully logged in");
        req.session.save(function (err) {
          return res.redirect("/");
        });
      } else {
        req.flash("error", "Invalid credentials! Try again.");
        req.session.save(function (err) {
          return res.redirect("/login");
        });
      }
    }
  }
});

router.get(
  "/profile/:id(\\d+)",
  isLoggedIn,
  isMyProfile,
  getPostsForUserBy,
  function (req, res) {
    res.render("profile", { posts: res.locals.userPosts });
  }
);

router.get("/author/:id(\\d+)", getPostsForUserBy, function (req, res) {
  res.render("author", {
    posts: res.locals.userPosts,
    authorName: res.locals.authorName,
    authorEmail: res.locals.authorEmail
  });
});

router.post("/logout", isLoggedIn, function (req, res, next) {
  
  req.session.destroy(function (err) {
    if (err) {
      next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;

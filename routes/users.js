var express = require("express");
var router = express.Router();
var db = require("../conf/database");
var bcrypt = require("bcrypt");

router.post("/SignUp", async function (req, res, next) {
  var { username, email, password } = req.body;
  try {
    var [rows, fields] = await db.execute(
      `SELECT id FROM users where username=?;`,
      [username]
    );
    if (rows && rows.length > 0) {
      return res.redirect("/SignUp");
    }
    var [rows, fields] = await db.execute(
      `SELECT id FROM users where email=?;`,
      [email]
    );
    if (rows && rows.length > 0) {
      return res.redirect("/SignUp");
    }

    var hashedPassword = await bcrypt.hash(password, 3);

    var [resultObject, fields] = await db.execute(
      `INSERT INTO users (username, email, password) VALUES (?, ?, ?);`,
      [username, email, hashedPassword]
    );

    if (resultObject && resultObject.affectedRows == 1) {
      return res.redirect("/login");
    } else {
      return res.redirect("/SignUp");
    }
  } catch (error) {
    next(error);
  }
});

router.post("/login", async function (req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    req.flash("error", "Invalid credentials! Try again.");
    req.session.save(function (err) {
      return res.redirect("/login");
    });
  } else {
    var [rows, fields] = await db.execute(
      `SELECT id,username,password,email FROM users where username=?;`,
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
        };
        req.flash("success", "Successfully logged in");
        req.session.save(function (err) {
          return res.redirect("/profile");
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

router.post("/logout", async function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;

var validator = require("validator");
var db = require("../conf/database");
const e = require("express");

module.exports = {
  usernameCheck: function (req, res, next) {
    var { username } = req.body;
    username = username.trim();
    if (!validator.isLength(username, { min: 3 })) {
      req.flash("error", "Username must be 3 or more characters long");
    }

    if (!/[a-zA-Z]/.test(username.charAt(0))) {
      req.flash("error", "Username must start with a letter");
    }

    if (req.session.flash.error) {
      res.redirect("/signUp");
    } else {
      next();
    }
  },
  passwordCheck: function (req, res, next) {
    var { password } = req.body;
    password = password.trim();
    if (!validator.isLength(password, { min: 8 })) {
      req.flash("error", "Password must be 8 or more characters long");
    }

    if (!/[/*\-+!@#$^&~\[\]]/.test(password)) {
      req.flash(
        "error",
        "Password must contain at least one special character"
      );
    }
    if (req.session.flash.error) {
      res.redirect("/signUp");
    } else {
      next();
    }
  },
  emailCheck: function (req, res, next) {
    var { email } = req.body;
    email = email.trim();
    if (!validator.isEmail(email)) {
      req.flash("error", "Please enter a valid email address");
    }
    if (req.session.flash.error) {
      res.redirect("/signUp");
    } else {
      next();
    }
  },
  tosCheck: function (req, res, next) {
    var { check2 } = req.body;
    if (!check2) {
      req.flash("error", "You must agree to the terms of service");
    } else {
      next();
    }
  },
  ageCheck: function (req, res, next) {
    var { check } = req.body;
    if (!check) {
      req.flash("error", "You must be 13 years or older to sign up");
    } else {
      next();
    }
  },
  isUsernameUnique: async function (req, res, next) {
    var { username } = req.body;
    try {
      var [rows, fields] = await db.execute(
        `SELECT id FROM users where username=?;`,
        [username]
      );
      if (rows && rows.length > 0) {
        req.flash("error", `${username} already exists`);
        return req.session.save(function (err) {
          return res.redirect("/SignUp");
        });
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  },
  isEmailUnique: async function (req, res, next) {
    var { email } = req.body;
    try {
      var [rows, fields] = await db.execute(
        `SELECT id FROM users where email=?;`,
        [email]
      );
      if (rows && rows.length > 0) {
        req.flash("error", `${email} already exists`);
        return req.session.save(function (err) {
          return res.redirect("/SignUp");
        });
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  },
};

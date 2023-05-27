var express = require("express");
const { isLoggedIn } = require("../middleware/auth");
const { getRecentPosts } = require("../middleware/posts");
var router = express.Router();
var db = require("../conf/database");

router.get("/", async function (req, res, next) {
  try {
    const searchText = ""; 
    var userId = req.session.user ? req.session.user.userId : null;

    var [rows, _] = await db.execute(
      `SELECT p.id, p.title, p.description, p.thumbnail, p.createdAt, p.private, p.views, u.username, u.image
      FROM posts p
      JOIN users u ON p.fk_userId = u.id
      WHERE (p.private = 0 OR (p.private = 1 AND p.fk_userId = ?))
      ORDER BY p.createdAt DESC
      LIMIT 10;`,
      [userId]
    );

    if (rows && rows.length === 0) {
      res.render("index", {
        title: "No Posts",
        message: "There are no posts available.",
      });
    } else {
      res.locals.posts = rows;
      res.render("index", {
        title: "Main Menu",
        name: "Leonardo Meza Martinez",
        recentPosts: res.locals.recentPosts,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/login", function (req, res) {
  res.render("login", { title: "Login" });
});

router.get("/postVideo", isLoggedIn, function (req, res) {
  res.render("postVideo", { title: "Post Video" });
});

router.get("/signUp", function (req, res) {
  res.render("signUp", { title: "Sign Up" });
});

module.exports = router;

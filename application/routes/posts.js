var express = require("express");
var router = express.Router();
var multer = require("multer");
var db = require("../conf/database");
const {
  isLoggedIn,
  isMyProfilePosts,
} = require("../middleware/auth");
const {
  makeThumbnail,
  getCommentsForPostById,
  getPostById,
  updatePostViews,
} = require("../middleware/posts");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/videos/uploads");
  },
  filename: function (req, file, cb) {
    var fileExt = file.mimetype.split("/")[1];
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/create",
  isLoggedIn,
  upload.single("file"),
  makeThumbnail,
  async function (req, res, next) {
    var { title, description, private } = req.body;
    if (!private) private = 0;
    var { path, thumbnail } = req.file;
    var { userId } = req.session.user;

    try {
      [insertResult, _] = await db.execute(
        `INSERT INTO posts (title, description, video, thumbnail, fk_userId, private) VALUES (?, ?, ?, ?, ?, ?)`,
        [title, description, path, thumbnail, userId, private]
      );
      if (insertResult && insertResult.affectedRows) {
        req.flash("success", "Post created successfully.");
        return req.session.save(function (error) {
          if (error) next(error);
          return res.redirect("/");
        });
      } else {
        next(new Error("Post could not be  created."));
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/edit/:id",
  isLoggedIn,
  isMyProfilePosts,
  async function (req, res, next) {
    var postId = req.params.id;

    try {
      var [rows, _] = await db.execute("SELECT * FROM posts WHERE id = ?", [
        postId,
      ]);

      if (rows.length === 0) {
        req.flash("error", "Post not found.");
        return req.session.save(function (err) {
          if (err) next(err);
          res.redirect("/");
        });
      }

      var post = rows[0];

      res.render("editPost", {
        title: "Edit Post",
        post: post,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/edit/:id",
  isLoggedIn,
  isMyProfilePosts,
  async function (req, res, next) {
    var postId = req.params.id;
    var { title, description, private } = req.body;
    if (!private) private = 1;

    try {
      await db.execute(
        "UPDATE posts SET title = ?, description = ?, updatedAt = CURRENT_TIMESTAMP(), private = ? WHERE id = ?",
        [title, description, private, postId]
      );

      req.flash("success", "Post updated successfully.");
      return req.session.save(function (err) {
        if (err) next(err);
        res.redirect("/");
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id(\\d+)",
  getPostById,
  getCommentsForPostById,
  updatePostViews,
  function (req, res) {
    res.render("viewPost", {
      title: `View Post ${req.params.id}`,
    });
  }
);

router.get("/search", async function (req, res, next) {
  var { searchText } = req.query;
  var userId = req.session.user ? req.session.user.userId : null;

  try {
    var [rows, _] = await db.execute(
      `SELECT p.id, p.title, p.description, p.thumbnail, p.createdAt, p.private, p.views,  u.username, u.image, concat_ws(' ', p.title, p.description) as haystack
      FROM posts p
      JOIN users u ON p.fk_userId = u.id
      WHERE (p.private = 0 OR (p.private = 1 AND p.fk_userId = ?))
      having haystack like ?;`,
      [userId, `%${searchText}%`]
    );

    if (rows && rows.length === 0) {
      // If no posts match the search query, get recent posts instead
      var [recentPosts, _] = await db.execute(
        `SELECT p.id, p.title, p.description, p.thumbnail, p.createdAt, p.private, p.views, u.username, u.image
      FROM posts p
      JOIN users u ON p.fk_userId = u.id
      WHERE (p.private = 0 OR (p.private = 1 AND p.fk_userId = ?))
      ORDER BY p.createdAt DESC
      LIMIT 10;`,
        [userId]
      );
      res.locals.posts = recentPosts;
      
    } else {
      res.locals.posts = rows;
    }

    return res.render("index");
  } catch (error) {
    next(error);
  }
});

router.delete("/delete", async function (req, res, next) {
  var { id } = req.query;
  try {
    await db.execute(`DELETE FROM comments WHERE fk_postId = ?`, [id]);

    const [result] = await db.execute(`DELETE FROM posts WHERE id = ?`, [id]);

    if (result.affectedRows > 0) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;

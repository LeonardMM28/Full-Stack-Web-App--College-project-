var pathToFFMPEG = require("ffmpeg-static");
var exec = require("child_process").exec;
var db = require("../conf/database");

module.exports = {
  makeThumbnail: function (req, res, next) {
    if (!req.file) {
      next(new Error("File upload failed"));
    } else {
      try {
        var destinationOfThumbnail = `public/thumbImages/uploads/thumbnail-${
          req.file.filename.split(".")[0]
        }.png`;
        var thumbnailCommand = `${pathToFFMPEG} -ss 00:00:01 -i ${req.file.path} -y -s 350x200 -vframes 1 -f image2 ${destinationOfThumbnail}`;
        exec(thumbnailCommand);
        req.file.thumbnail = destinationOfThumbnail;
        next();
      } catch (error) {
        next(error);
      }
    }
  },
  getPostsForUserBy: async function (req, res, next) {
    var { id } = req.params;
    try {
      let [rows, _] = await db.execute(
        `SELECT p.id, p.title, p.description, p.video, p.thumbnail, p.createdAt, p.private, p.views, u.username, u.email, u.image
      FROM csc327db.posts p
      JOIN csc327db.users u ON p.fk_userId = u.id
      WHERE p.fk_userId = ?;`,
        [id]
      );
      const posts = rows;

      if (posts.length == 0) {
        res.locals.userPosts = [];
        res.locals.authorName = "";
        res.locals.authorEmail = "";
        res.locals.priv = null;
      } else {
        const authorName = rows[0].username; // Get the author's name from the first row
        const authorEmail = rows[0].email;
        const avatar = rows[0].image;
        const priv = rows[0].private; // Get the author's email from the first row
        res.locals.userPosts = posts;
        res.locals.authorName = authorName;
        res.locals.authorEmail = authorEmail;
        res.locals.avatar = avatar;
        res.locals.priv = priv;
      }
      next();
    } catch (error) {
      next(error);
    }
  },

  getPostById: async function (req, res, next) {
    var { id } = req.params;
    try {
      let [rows, _] = await db.execute(
        `SELECT u.username, u.image, p.video, p.title, p.description, p.id, p.createdAt, p.fk_userId, p.private, p.views
        FROM csc327db.posts p
        JOIN csc327db.users u
        ON p.fk_userId=u.id
        WHERE p.id=?;`,
        [id]
      );
      const post = rows[0];
      if (!post) {
      } else {
        res.locals.currentPost = post;
        next();
      }
    } catch (error) {
      next(error);
    }
  },
  getCommentsForPostById: async function (req, res, next) {
    var { id } = req.params;
    try {
      let [rows, _] = await db.execute(
        `select u.username, u.image, c.text, c.createdAt
        from csc327db.comments c
        JOIN csc327db.users u
        ON c.fk_userId=u.id
        WHERE c.fk_postId=?;`,
        [id]
      );
      res.locals.currentPost.comments = rows;
      next();
    } catch (error) {
      next(error);
    }
  },
  getRecentPosts: async function (req, res, next) {
    try {
      let [rows, _] = await db.execute(
        `SELECT p.id, p.title, p.description, p.video, p.thumbnail, p.createdAt, u.username, u.image
      FROM posts p
      JOIN users u ON p.fk_userId = u.id
      ORDER BY p.createdAt DESC
      LIMIT 10;`
      );
      const recentPosts = rows;
      res.locals.recentPosts = recentPosts;
      next();
    } catch (error) {
      next(error);
    }
  },

  updatePostViews: async function (req, res, next) {
    var { id } = req.params;

    try {
      // Fetch the current value of "views" from the database
      let [rows, _] = await db.execute(`SELECT views FROM posts WHERE id = ?`, [
        id,
      ]);

      // Extract the current views value from the result
      const currentViews = rows[0].views;

      // Calculate the updated views value (e.g., increment by 1)
      const updatedViews = currentViews + 1;

      // Update the "views" column in the database
      await db.execute("UPDATE posts SET views = ? WHERE id = ?", [
        updatedViews,
        id,
      ]);
      next();
    } catch (error) {
      next(error);
    }
  },
};

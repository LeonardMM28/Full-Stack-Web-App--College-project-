var db = require("../conf/database");
module.exports = {
  isLoggedIn: function (req, res, next) {
    if (req.session.user) {
      req.user = req.session.user; // Set req.user with the user information
      next();
    } else {
      req.flash("error", "You must be logged in to access that page.");
      req.session.save(function (err) {
        if (err) next(err);
        res.redirect("/login");
      });
    }
  },
  isMyProfile: function (req, res, next) {
    var { id } = req.params;
    if (id == req.session.user.userId) {
      next();
    } else {
      req.flash("error", "You do not have permission to access that page.");
      req.session.save(function (err) {
        if (err) next(err);
        res.redirect("/");
      });
    }
  },
  isMyProfilePosts: async function (req, res, next) {
    var postId = req.params.id;
    var userId = req.session.user.userId;

    // Fetch the post from the database based on the postId
    db.execute("SELECT * FROM posts WHERE id = ?", [postId])
      .then(([rows, _]) => {
        if (rows.length === 0) {
          req.flash("error", "Post not found.");
          return req.session.save(function (err) {
            if (err) next(err);
            res.redirect("/"); // Redirect to the main page or an appropriate page
          });
        }

        var post = rows[0];

        // Check if the current user is the author of the post
        if (post.fk_userId !== userId) {
          req.flash("error", "You are not authorized to edit this post.");
          return req.session.save(function (err) {
            if (err) next(err);
            res.redirect("/"); // Redirect to the main page or an appropriate page
          });
        }

        // The current user is the author, so continue to the next middleware/route handler
        next();
      })
      .catch((error) => {
        next(error);
      });
  },
};

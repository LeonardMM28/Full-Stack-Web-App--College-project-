require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const favicon = require("serve-favicon");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const handlebars = require("express-handlebars");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const comentsRouter = require("./routes/comments");

const sessions = require("express-session");
const MySQLStore = require("express-mysql-session")(sessions);
const flash = require("express-flash");
const app = express();
const userIdEquals = function (userId1, userId2, options) {
  if (userId1 === userId2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};

const private = function (value, options) {
  if (value === 1) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};

app.engine(
  "hbs",
  handlebars({
    layoutsDir: path.join(__dirname, "views/layouts"), //where to look for layouts
    partialsDir: path.join(__dirname, "views/partials"), // where to look for partials
    extname: ".hbs", //expected file extension for handlebars files
    defaultLayout: "layout", //default layout for app, general template for all pages in app
    helpers: {
      nonEmptyObject: function (obj) {
        return obj && obj.constructor === Object && Object.keys(obj).length > 0;
      },
      formatDateString: function (dateString) {
        return new Date(dateString).toLocaleString("en-us", {
          dateStyle: "long",
          timeStyle: "medium"
        });
      },
      userIdEquals: userIdEquals,
      private: private,
    },
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

const sessionStore = new MySQLStore({}, require("./conf/database"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("csc317 secret key"));
app.use(favicon(__dirname + "/public/favicon.ico"));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(
  sessions({
    secret: "csc317 secret key",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: { httpOnly: true, secure: false, maxAge: 600000 },
  })
);

app.use(flash());

app.use(function (req, res, next) {
  if (req.session.user) {
    res.locals.isLoggedIn = true;
    res.locals.user = req.session.user;
  }
  next();
});

app.use("/", indexRouter); // route middleware from ./routes/index.js
app.use("/users", usersRouter); // route middleware from ./routes/users.js
app.use("/posts", postsRouter);
app.use("/comments", comentsRouter);

/**
 * Catch all route, if we get to here then the
 * resource requested could not be found.
 */
app.use((req, res, next) => {
  next(
    createError(404, `The route ${req.method} : ${req.url} does not exist.`)
  );
});

/**
 * Error Handler, used to render the error html file
 * with relevant error information.
 */
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = err;
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

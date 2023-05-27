// profile.js
document.addEventListener("DOMContentLoaded", function () {
  var watchBtns = document.querySelectorAll("#watch-btn");

  watchBtns.forEach(function (btn) {
    btn.addEventListener("click", function (event) {
      var postId = event.target.getAttribute("data-postid");
      var url = "/posts/" + postId; // Update the URL based on your routing setup

      // Navigate to the viewPost page
      window.location.href = url;
    });
  });
});

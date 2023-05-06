//FETCHING POSTS
document.addEventListener("DOMContentLoaded", () => {
  fetch("https://jsonplaceholder.typicode.com/albums/2/photos")
    .then((response) => response.json())
    .then((data) => {
      var htmlString = data.reduce(function (prev, product) {
        return (
          prev +
          `
                <div class="prod">
                    <img class="prod-img" src="${product.url}" />
                    <div class="prod-info">
                        <p class="prod-title">${product.title}</p>
                    </div>
                </div>
            `
        );
      }, "");
      var count = data.length;
      var countString =
        '<div class="count">' +
        "Number of photos displayed: " +
        count +
        "</div>";
      document.getElementById("content").innerHTML = htmlString;
      document.getElementById("No").innerHTML = countString;

      var prodElements = document.getElementsByClassName("prod");
      for (var i = 0; i < prodElements.length; i++) {
        prodElements[i].addEventListener("click", (event) => {
          event.currentTarget.remove();
          count--;
          countString =
            '<div class="count">' +
            "Number of photos displayed: " +
            count +
            "</div>";
          document.getElementById("No").innerHTML = countString;
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});




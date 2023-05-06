const messageContainer = document.querySelector(".alert-danger");
const MESSAGE_TIMEOUT = 2000;
const MESSAGE_FADEOUT = 100;

setTimeout(() => {
  messageContainer.classList.add("show");

  setTimeout(() => {
    messageContainer.classList.remove("show");
    messageContainer.classList.add("hide");

    setTimeout(() => {
      messageContainer.remove();
    }, MESSAGE_FADEOUT);
  }, MESSAGE_TIMEOUT);
}, MESSAGE_FADEOUT);

const messageContainer2 = document.querySelector(".alert-success");

setTimeout(() => {
  messageContainer2.classList.add("show");

  setTimeout(() => {
    messageContainer2.classList.remove("show");
    messageContainer2.classList.add("hide");

    setTimeout(() => {
      messageContainer2.remove();
    }, MESSAGE_FADEOUT);
  }, MESSAGE_TIMEOUT);
}, MESSAGE_FADEOUT);

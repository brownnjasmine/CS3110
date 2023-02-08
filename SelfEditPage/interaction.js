const cats = document.querySelectorAll(".Cat")
cats.forEach(cat => cat.addEventListener("click", ev => console.log("meow?"), false))

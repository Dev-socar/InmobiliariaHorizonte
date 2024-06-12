(function () {
  const galeria = document.querySelector("#galeria-propiedades");
  if (galeria) {
    const imagenes = document.querySelectorAll(".galeria__imagen img");
    imagenes.forEach((imagen) => {
      imagen.addEventListener("click", mostrarImagen);
    });

    function mostrarImagen(e) {
      const urlImagen = e.target.attributes.src.value;
      const body = document.querySelector("body");
      body.classList.add("body__fijo");
      const contenedorImg = document.createElement("div");
      contenedorImg.classList.add("galeria__fullscreen");
      contenedorImg.style.display = "flex";

      contenedorImg.innerHTML = `
    <div class="galeria__fullscreen-imagen">
        <span class="galeria__close">X</span>
        <img src="${urlImagen}" alt="IMG FULL" />
      </div>
    `;
      body.appendChild(contenedorImg);
      const boton = document.querySelector(".galeria__close");

      boton.addEventListener("click", cerrarGaleria);
    }

    function cerrarGaleria() {
      const imagen = document.querySelector(".galeria__fullscreen");
      const body = document.querySelector("body");
      imagen.remove();
      body.classList.remove("body__fijo");
    }
  }
})();

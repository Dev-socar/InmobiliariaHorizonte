(function () {
  const propiedadesRenta = document.querySelector(".propiedades-renta");
  const bathsSelect = document.querySelector("#baths-propiedad");
  const recamarasSelect = document.querySelector("#recamaras-propiedad");

  const formularioPrecio = document.querySelector("#formulario-precio");
  const rentasContenedor = document.querySelector("#renta");
  if (propiedadesRenta) {
    const url = `http://localhost:4001/renta`;

    bathsSelect.addEventListener("change", (e) => {
      bathsFiltrado(parseInt(e.target.value));
    });
    recamarasSelect.addEventListener("change", (e) => {
      recamarasFiltrado(parseInt(e.target.value));
    });
    formularioPrecio.addEventListener("submit", precioFiltrado);

    function bathsFiltrado(valor) {
      fetch(`${url}?description.baths_max=${valor}`)
        .then((respuesta) => respuesta.json())
        .then((resultado) => mostrarPropiedadesRenta(resultado));

      recamarasSelect.selectedIndex = 0;
      formularioPrecio.reset();
    }
    function recamarasFiltrado(valor) {
      fetch(`${url}?description.beds_max=${valor}`)
        .then((respuesta) => respuesta.json())
        .then((resultado) => mostrarPropiedadesRenta(resultado));

      bathsSelect.selectedIndex = 0;
      formularioPrecio.reset();
    }
    function precioFiltrado(e) {
      e.preventDefault();
      const minimoInput = document.querySelector("#minimo").value;
      const maximoInput = document.querySelector("#maximo").value;

      if (minimoInput === "" || maximoInput === "") {
        Swal.fire({
          title: "Campos Vacios",
          text: "Ambos Campos son obligatorios",
          icon: "warning",
        });
        return;
      }

      fetch(
        `${url}?list_price_max_gte=${minimoInput}&list_price_max_lte=${maximoInput}`
      )
        .then((respuesta) => respuesta.json())
        .then((resultado) => mostrarPropiedadesRenta(resultado));
      bathsSelect.selectedIndex = 0;
      recamarasSelect.selectedIndex = 0;
    }

    function mostrarPropiedadesRenta(propiedades) {
      limpiarHTML();
      if (propiedades.length !== 0) {
        propiedades.forEach((propiedad) => {
          let {
            property_id,
            photos: [firstPhoto] = [{ href: "" }],
            list_price_max,
            type,
            description: {
              baths_max,
              garage_max,
              sqft_max,
              beds_max,
              year_built,
              name,
            } = {},
          } = propiedad;
          let { href } = firstPhoto;
          const divPropiedad = document.createElement("div");
          divPropiedad.classList.add("propiedad", "swiper-slide");

          // imagen
          if (href) {
            const divPropiedadImg = document.createElement("div");
            divPropiedadImg.classList.add("propiedad__img");
            const propiedadImg = document.createElement("img");
            propiedadImg.src = href;
            divPropiedadImg.appendChild(propiedadImg);
            divPropiedad.appendChild(divPropiedadImg);
          }

          // informacion
          const divPropiedadInformacion = document.createElement("div");
          divPropiedadInformacion.classList.add("propiedad__informacion");

          if (name) {
            const propiedadNombre = document.createElement("h3");
            propiedadNombre.classList.add("propiedad__titulo");
            propiedadNombre.textContent = name;
            divPropiedadInformacion.appendChild(propiedadNombre);
          }
          if (list_price_max) {
            const propiedadPrecio = document.createElement("p");
            propiedadPrecio.classList.add("propiedad__precio");
            propiedadPrecio.textContent = `$${list_price_max}`;
            divPropiedadInformacion.appendChild(propiedadPrecio);
          }
          if (type) {
            const propiedadTipo = document.createElement("p");
            propiedadTipo.classList.add("propiedad__tipo");
            propiedadTipo.textContent = type;
            divPropiedadInformacion.appendChild(propiedadTipo);
          }

          if (year_built) {
            const propiedadYear = document.createElement("p");
            propiedadYear.classList.add("propiedad__year");
            propiedadYear.textContent = `Construido en ${year_built}`;
            divPropiedadInformacion.appendChild(propiedadYear);
          }

          // Propiedad Detalles
          const divPropiedadDetalles = document.createElement("div");
          divPropiedadDetalles.classList.add("propiedad__detalles");

          if (sqft_max) {
            const divPropiedadDetalleSuperficie = document.createElement("div");
            divPropiedadDetalleSuperficie.classList.add("propiedad__detalle");
            const propiedadIconoSuperficie = document.createElement("i");
            propiedadIconoSuperficie.classList.add("fa-regular", "fa-square");
            const propiedadSpanSuperficie = document.createElement("span");
            propiedadSpanSuperficie.innerHTML = ` ${sqft_max}ft<sup>2</sup>`;
            divPropiedadDetalleSuperficie.appendChild(propiedadIconoSuperficie);
            divPropiedadDetalleSuperficie.appendChild(propiedadSpanSuperficie);
            divPropiedadDetalles.appendChild(divPropiedadDetalleSuperficie);
          }

          if (baths_max) {
            const divPropiedadDetalleBath = document.createElement("div");
            divPropiedadDetalleBath.classList.add("propiedad__detalle");
            const propiedadIconoBath = document.createElement("i");
            propiedadIconoBath.classList.add("fa-solid", "fa-bath");
            const propiedadSpanBath = document.createElement("span");
            propiedadSpanBath.textContent = ` ${baths_max}`;

            divPropiedadDetalleBath.appendChild(propiedadIconoBath);
            divPropiedadDetalleBath.appendChild(propiedadSpanBath);
            divPropiedadDetalles.appendChild(divPropiedadDetalleBath);
          }

          if (garage_max) {
            const divPropiedadDetalleGarage = document.createElement("div");
            divPropiedadDetalleGarage.classList.add("propiedad__detalle");
            const propiedadIconoGarage = document.createElement("i");
            propiedadIconoGarage.classList.add("fa-solid", "fa-car");
            const propiedadSpanGarage = document.createElement("span");
            propiedadSpanGarage.textContent = ` ${garage_max}`;

            divPropiedadDetalleGarage.appendChild(propiedadIconoGarage);
            divPropiedadDetalleGarage.appendChild(propiedadSpanGarage);
            divPropiedadDetalles.appendChild(divPropiedadDetalleGarage);
          }

          if (beds_max) {
            const divPropiedadDetalleCamas = document.createElement("div");
            divPropiedadDetalleCamas.classList.add("propiedad__detalle");
            const propiedadIconoCamas = document.createElement("i");
            propiedadIconoCamas.classList.add("fa-solid", "fa-bed");
            const propiedadSpanCamas = document.createElement("span");
            propiedadSpanCamas.textContent = ` ${beds_max}`;

            divPropiedadDetalleCamas.appendChild(propiedadIconoCamas);
            divPropiedadDetalleCamas.appendChild(propiedadSpanCamas);
            divPropiedadDetalles.appendChild(divPropiedadDetalleCamas);
          }

          // Div de detalles
          divPropiedadInformacion.appendChild(divPropiedadDetalles);

          // Enlace
          const enlacePropiedad = document.createElement("a");
          enlacePropiedad.classList.add("propiedad__enlace");
          enlacePropiedad.textContent = "Ver Propiedad";
          enlacePropiedad.href = `propiedad.html?property_id=${property_id}&estado=renta`;

          divPropiedad.appendChild(divPropiedadInformacion);
          divPropiedad.appendChild(enlacePropiedad);

          rentasContenedor.appendChild(divPropiedad);
        });
        return;
      }
      sinResultado();
    }

    function limpiarHTML() {
      while (rentasContenedor.firstChild) {
        rentasContenedor.removeChild(rentasContenedor.firstChild);
      }
    }

    function sinResultado() {
      const heading = document.createElement("h2");
      heading.classList.add(
        "propiedades__titulo",
        "propiedades__titulo--sin-resultado"
      );
      heading.textContent = "No Hubieron Resultados";
      rentasContenedor.appendChild(heading);
    }
  }
})();

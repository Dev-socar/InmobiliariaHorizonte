(function () {
  const tipoSelect = document.querySelector("#tipo-propiedad");
  const bathsSelect = document.querySelector("#baths-propiedad");
  const recamarasSelect = document.querySelector("#recamaras-propiedad");

  const formularioPrecio = document.querySelector("#formulario-precio");
  const ventasContenedor = document.querySelector("#venta");

  const url = `http://localhost:4001/venta`;

  if (tipoSelect) {
    getTipo();
    tipoSelect.addEventListener("change", (e) => {
      tipoFiltrado(e.target.value);
    });
    bathsSelect.addEventListener("change", (e) => {
      bathsFiltrado(e.target.value);
    });
    recamarasSelect.addEventListener("change", (e) => {
      recamarasFiltrado(e.target.value);
    });
    formularioPrecio.addEventListener("submit", precioFiltrado);

    function getTipo() {
      fetch(url)
        .then((response) => response.json())
        .then((result) => filtrarTipo(result));
    }

    function filtrarTipo(propiedades) {
      const tiposPropiedadesSet = new Set();
      propiedades.forEach((propiedad) => {
        tiposPropiedadesSet.add(propiedad.type);
      });

      let tiposPropiedadesTexto = Array.from(tiposPropiedadesSet).map((tipo) =>
        tipo.replace(/_/g, " ")
      );
      let tiposPropiedadesValue = Array.from(tiposPropiedadesSet);
      llenarSelect(tiposPropiedadesTexto, tiposPropiedadesValue);
    }

    function llenarSelect(opciones, values) {
      opciones.forEach((opcion, index) => {
        const option = document.createElement("option");
        option.value = values[index];
        option.textContent = opcion;
        tipoSelect.appendChild(option);
      });
    }

    function tipoFiltrado(valor) {
      fetch(`${url}?type=${valor}`)
        .then((respuesta) => respuesta.json())
        .then((resultado) => mostrarPropiedadesVenta(resultado));
      bathsSelect.selectedIndex = 0;
      recamarasSelect.selectedIndex = 0;
      formularioPrecio.reset();
    }
    function bathsFiltrado(valor) {
      fetch(`${url}?description.baths=${valor}`)
        .then((respuesta) => respuesta.json())
        .then((resultado) => mostrarPropiedadesVenta(resultado));
      tipoSelect.selectedIndex = 0;
      recamarasSelect.selectedIndex = 0;
      formularioPrecio.reset();
    }
    function recamarasFiltrado(valor) {
      fetch(`${url}?description.beds=${valor}`)
        .then((respuesta) => respuesta.json())
        .then((resultado) => mostrarPropiedadesVenta(resultado));
      tipoSelect.selectedIndex = 0;
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
        `${url}?description.sold_price_gte=${minimoInput}&description.sold_price_lte=${maximoInput}`
      )
        .then((respuesta) => respuesta.json())
        .then((resultado) => mostrarPropiedadesVenta(resultado));

      tipoSelect.selectedIndex = 0;
      bathsSelect.selectedIndex = 0;
      recamarasSelect.selectedIndex = 0;
    }

    function mostrarPropiedadesVenta(propiedades) {
      limpiarHTML();
      if (propiedades.length !== 0) {
        propiedades.forEach((propiedad) => {
          let {
            property_id,
            primary_photo: { href } = { href: "" },
            branding: [{ name } = { name: "" }],
            type,
            description: {
              sold_price,
              baths,
              garage,
              lot_sqft,
              beds,
              year_built,
            } = {},
          } = propiedad;

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
          if (sold_price) {
            const propiedadPrecio = document.createElement("p");
            propiedadPrecio.classList.add("propiedad__precio");
            propiedadPrecio.textContent = `$${sold_price}`;
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

          if (lot_sqft) {
            const divPropiedadDetalleSuperficie = document.createElement("div");
            divPropiedadDetalleSuperficie.classList.add("propiedad__detalle");
            const propiedadIconoSuperficie = document.createElement("i");
            propiedadIconoSuperficie.classList.add("fa-regular", "fa-square");
            const propiedadSpanSuperficie = document.createElement("span");
            propiedadSpanSuperficie.innerHTML = ` ${lot_sqft}ft<sup>2</sup>`;
            divPropiedadDetalleSuperficie.appendChild(propiedadIconoSuperficie);
            divPropiedadDetalleSuperficie.appendChild(propiedadSpanSuperficie);
            divPropiedadDetalles.appendChild(divPropiedadDetalleSuperficie);
          }

          if (baths) {
            const divPropiedadDetalleBath = document.createElement("div");
            divPropiedadDetalleBath.classList.add("propiedad__detalle");
            const propiedadIconoBath = document.createElement("i");
            propiedadIconoBath.classList.add("fa-solid", "fa-bath");
            const propiedadSpanBath = document.createElement("span");
            propiedadSpanBath.textContent = ` ${baths}`;

            divPropiedadDetalleBath.appendChild(propiedadIconoBath);
            divPropiedadDetalleBath.appendChild(propiedadSpanBath);
            divPropiedadDetalles.appendChild(divPropiedadDetalleBath);
          }

          if (garage) {
            const divPropiedadDetalleGarage = document.createElement("div");
            divPropiedadDetalleGarage.classList.add("propiedad__detalle");
            const propiedadIconoGarage = document.createElement("i");
            propiedadIconoGarage.classList.add("fa-solid", "fa-car");
            const propiedadSpanGarage = document.createElement("span");
            propiedadSpanGarage.textContent = ` ${garage}`;

            divPropiedadDetalleGarage.appendChild(propiedadIconoGarage);
            divPropiedadDetalleGarage.appendChild(propiedadSpanGarage);
            divPropiedadDetalles.appendChild(divPropiedadDetalleGarage);
          }

          if (beds) {
            const divPropiedadDetalleCamas = document.createElement("div");
            divPropiedadDetalleCamas.classList.add("propiedad__detalle");
            const propiedadIconoCamas = document.createElement("i");
            propiedadIconoCamas.classList.add("fa-solid", "fa-bed");
            const propiedadSpanCamas = document.createElement("span");
            propiedadSpanCamas.textContent = ` ${beds}`;

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
          enlacePropiedad.href = `propiedad.html?property_id=${property_id}&estado=venta`;

          divPropiedad.appendChild(divPropiedadInformacion);
          divPropiedad.appendChild(enlacePropiedad);

          ventasContenedor.appendChild(divPropiedad);
        });
        return;
      }
      sinResultado();
    }

    function limpiarHTML() {
      while (ventasContenedor.firstChild) {
        ventasContenedor.removeChild(ventasContenedor.firstChild);
      }
    }

    function sinResultado() {
      const heading = document.createElement("h2");
      heading.classList.add(
        "propiedades__titulo",
        "propiedades__titulo--sin-resultado"
      );
      heading.textContent = "No Hubieron Resultados";
      ventasContenedor.appendChild(heading);
    }
  }
})();

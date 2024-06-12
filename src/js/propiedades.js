(function () {
  const ventasContenedor = document.querySelector("#venta");
  const rentasContenedor = document.querySelector("#renta");
  if (ventasContenedor || rentasContenedor) {
    if (window.location.pathname === "/index.html") {
      getPropiedadesVenta();
      getPropiedadesRenta();
      return;
    }
    if (window.location.pathname === "/renta.html") {
      getPropiedadesRenta();
      return;
    }
    if (window.location.pathname === "/venta.html") {
      getPropiedadesVenta();
      return;
    }

    function getPropiedadesVenta() {
      const url = "http://localhost:4001/venta";

      fetch(url)
        .then((response) => response.json())
        .then((propiedades) => {
          if (window.location.pathname === "/venta.html") {
            mostrarPropiedadesVenta(propiedades, 22);
            return;
          }
          const propiedadesFormateadas = propiedades.filter(
            (propiedad) => propiedad.type === "single_family"
          );
          mostrarPropiedadesVenta(propiedadesFormateadas, 10);
        });
    }
    
    function getPropiedadesRenta() {
      const url = "http://localhost:4001/renta";

      fetch(url)
        .then((response) => response.json())
        .then((propiedades) => mostrarPropiedadesRenta(propiedades, 4));
    }

    function mostrarPropiedadesVenta(propiedades, limite) {
      propiedades.slice(0, limite).forEach((propiedad) => {
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
          if (sold_price === 'Not Price') {
            propiedadPrecio.textContent = sold_price;
            propiedadPrecio.classList.add("propiedad__precio--no-definido");
          } else {
            propiedadPrecio.textContent = `$${sold_price}`;
          }
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
    }
    function mostrarPropiedadesRenta(propiedades, limite) {
      propiedades.slice(0, limite).forEach((propiedad) => {
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
    }
  }
})();

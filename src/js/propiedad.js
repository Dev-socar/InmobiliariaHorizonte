import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
(function () {
  const inmueble = document.querySelector("#inmueble");
  if (inmueble) {
    document.addEventListener("DOMContentLoaded", () => {
      const parametros = new URLSearchParams(window.location.search);
      if (parametros.size === 0) {
        window.location.href = "index.html";
        return;
      }
      const idPropiedad = parametros.get("property_id");
      const estadoPropiedad = parametros.get("estado");
      let url;
      if (estadoPropiedad === "venta") {
        url = `http://localhost:4001/venta`;
        getPropiedadVenta(idPropiedad);
      } else {
        url = `http://localhost:4001/renta`;
        getPropiedadRenta(idPropiedad);
      }

      async function getPropiedadVenta(idPropiedad) {
        try {
          const resultado = await fetch(`${url}?property_id=${idPropiedad}`);
          const propiedad = await resultado.json();
          const swiper = mostrarPropiedadVenta(propiedad[0]);
          if (swiper) {
            setTimeout(() => {
              inicializarSwiper();
            }, 1000);
          }
        } catch (error) {
          console.log(error);
        }
      }

      async function getPropiedadRenta(idPropiedad) {
        try {
          const resultado = await fetch(`${url}?property_id=${idPropiedad}`);
          const propiedad = await resultado.json();
          const swiper = await mostrarPropiedadRenta(propiedad[0]);
          if (swiper) {
            setTimeout(() => {
              inicializarSwiper();
            }, 1000);
          }
        } catch (error) {
          console.log(error);
        }
      }

      async function mostrarPropiedadVenta(propiedad) {
        limpiarHTML();
        if (!propiedad) {
          window.location.href = "venta.html";
          return;
        }
        let {
          branding: [{ name }],
          status,
          type,
          description: { year_built, sold_price, sqft, baths, garage, beds },
          location: {
            address: {
              coordinate: { lon, lat },
              state,
              city,
              line,
              postal_code,
            },
            county: { name: nameCounty },
          },
          photos,
          id_agent,
        } = propiedad;
        const agente = await getAgente(id_agent);
        let {
          full_name,
          email,
          slogan,
          photo: { href },
          phones: [{ number }],
        } = agente[0];

        //Div del nombre,precio,estado y ubicacion
        const divInmuebleEncabezados = document.createElement("div");
        divInmuebleEncabezados.classList.add("inmueble__encabezados");

        //Div de nombre y ubicacion
        const divInmuebleEncabezado = document.createElement("div");
        divInmuebleEncabezado.classList.add("inmueble__encabezado");

        //Nombre
        const headingInmuebleTitulo = document.createElement("h2");
        headingInmuebleTitulo.classList.add("inmueble__titulo");
        headingInmuebleTitulo.textContent = name;

        //Ubicacion
        const parrafoInmuebleUbicacion = document.createElement("p");
        parrafoInmuebleUbicacion.classList.add("inmueble__ubicacion");
        parrafoInmuebleUbicacion.textContent = `${nameCounty}, ${city}, ${state}`;

        //Agregamos al nombre y ubicacion en un div
        divInmuebleEncabezado.appendChild(headingInmuebleTitulo);
        divInmuebleEncabezado.appendChild(parrafoInmuebleUbicacion);

        //Divs del precio y estado
        const divInmuebleEstado = document.createElement("div");
        divInmuebleEstado.classList.add("inmueble__estado");

        //precio
        const headingInmueblePrecio = document.createElement("h3");
        headingInmueblePrecio.classList.add("inmueble__precio");
        headingInmueblePrecio.textContent =
          sold_price === "Not Price" ? "" : `$${sold_price}`;
        divInmuebleEstado.appendChild(headingInmueblePrecio);

        //Estado
        const parrafoInmuebleEstado = document.createElement("p");
        parrafoInmuebleEstado.classList.add("inmueble__disponible");
        parrafoInmuebleEstado.textContent = status;

        //Agregamos precio y estado en un div

        divInmuebleEstado.appendChild(parrafoInmuebleEstado);

        //Agregamos los div anteriores al div de encabezados
        divInmuebleEncabezados.appendChild(divInmuebleEncabezado);
        divInmuebleEncabezados.appendChild(divInmuebleEstado);

        //Div galeria
        const divInmuebleGaleria = document.createElement("div");
        divInmuebleGaleria.classList.add("inmueble__galeria");

        const divInmuebleSwiper = document.createElement("div");
        divInmuebleSwiper.classList.add(
          "swiper",
          "swiper--galeria",
          "inmueble__swiper"
        );

        const divInmuebleSwiperWrapper = document.createElement("div");
        divInmuebleSwiperWrapper.classList.add("swiper-wrapper");
        divInmuebleSwiperWrapper.id = "inmueble__imagenes";

        photos ? (photos = photos) : (photos = [propiedad.primary_photo]);

        photos.forEach((img) => {
          const { href } = img;
          const divSwiperSlide = document.createElement("div");
          divSwiperSlide.classList.add("swiper-slide", "swiper-slide--galeria");
          const inmuebleImg = document.createElement("img");
          inmuebleImg.src = href;
          inmuebleImg.alt = name;
          divSwiperSlide.appendChild(inmuebleImg);
          divInmuebleSwiperWrapper.appendChild(divSwiperSlide);
        });
        divInmuebleSwiper.appendChild(divInmuebleSwiperWrapper);
        const divSwiperNext = document.createElement("div");
        divSwiperNext.classList.add("swiper-button-next");
        const divSwiperPrev = document.createElement("div");
        divSwiperPrev.classList.add("swiper-button-prev");
        const divSwiperPagination = document.createElement("div");
        divSwiperPagination.classList.add("swiper-pagination");

        divInmuebleSwiper.appendChild(divSwiperNext);
        divInmuebleSwiper.appendChild(divSwiperPrev);
        divInmuebleSwiper.appendChild(divSwiperPagination);

        divInmuebleGaleria.appendChild(divInmuebleSwiper);
        //Caracteristicas principales

        //div caracteristcas principales
        const divInmueblePrincipales = document.createElement("div");
        divInmueblePrincipales.classList.add(
          "imbueble__caracteristicas-principales"
        );

        //listado caracteristicas
        const inmuebleCaracteristicasListado = document.createElement("ul");
        inmuebleCaracteristicasListado.classList.add(
          "inmueble__caracteristicas-listado"
        );

        //item Remacaras
        const inmuebleLiRecamaras = document.createElement("li");
        inmuebleLiRecamaras.classList.add("inmueble__caracteristicas-lista");
        const inmuebleSpanRecamaras = document.createElement("span");
        inmuebleSpanRecamaras.textContent = beds;
        const inmuebleSmallRecamaras = document.createElement("small");
        inmuebleSmallRecamaras.textContent = "Recamaras";
        inmuebleLiRecamaras.appendChild(inmuebleSpanRecamaras);
        inmuebleLiRecamaras.appendChild(inmuebleSmallRecamaras);

        inmuebleCaracteristicasListado.appendChild(inmuebleLiRecamaras);

        //item Baths
        const inmuebleLiBaths = document.createElement("li");
        inmuebleLiBaths.classList.add("inmueble__caracteristicas-lista");
        const inmuebleSpanBaths = document.createElement("span");
        inmuebleSpanBaths.textContent = baths;
        const inmuebleSmallBaths = document.createElement("small");
        inmuebleSmallBaths.textContent = "Baths";
        inmuebleLiBaths.appendChild(inmuebleSpanBaths);
        inmuebleLiBaths.appendChild(inmuebleSmallBaths);

        inmuebleCaracteristicasListado.appendChild(inmuebleLiBaths);

        //item FT
        const inmuebleLiFt = document.createElement("li");
        inmuebleLiFt.classList.add("inmueble__caracteristicas-lista");
        const inmuebleSpanFt = document.createElement("span");
        inmuebleSpanFt.innerHTML = `${sqft} ft<sup>2</sup>`;
        const inmuebleSmallFt = document.createElement("small");
        inmuebleSmallFt.textContent = "De construccion";
        inmuebleLiFt.appendChild(inmuebleSpanFt);
        inmuebleLiFt.appendChild(inmuebleSmallFt);

        inmuebleCaracteristicasListado.appendChild(inmuebleLiFt);

        //item Estaionamiento
        const inmuebleLiEstacionamiento = document.createElement("li");
        inmuebleLiEstacionamiento.classList.add(
          "inmueble__caracteristicas-lista"
        );
        const inmuebleSpanEstacionamiento = document.createElement("span");
        inmuebleSpanEstacionamiento.textContent = garage;
        const inmuebleSmallEstacionamiento = document.createElement("small");
        inmuebleSmallEstacionamiento.textContent = "Estacionamientos";
        inmuebleLiEstacionamiento.appendChild(inmuebleSpanEstacionamiento);
        inmuebleLiEstacionamiento.appendChild(inmuebleSmallEstacionamiento);

        inmuebleCaracteristicasListado.appendChild(inmuebleLiEstacionamiento);

        //Ponemos la lista ul al div
        divInmueblePrincipales.appendChild(inmuebleCaracteristicasListado);

        //Div Grid
        const divInmuebleDetallesGrid = document.createElement("div");
        divInmuebleDetallesGrid.classList.add("inmueble__detalles-grid");

        //div caracteristicas
        const divInmuebleCaracteristicas = document.createElement("div");
        divInmuebleCaracteristicas.classList.add("inmueble__caracteristicas");

        //Inmueble detalles
        const divInmuebleDetalles = document.createElement("div");
        divInmuebleDetalles.classList.add("inmueble__detalles");
        const inmuebleDetallesHeading = document.createElement("h3");
        inmuebleDetallesHeading.classList.add("inmueble__subtitulo");
        inmuebleDetallesHeading.textContent = "Detalles";
        const inmuebleDetallesListado = document.createElement("ul");
        inmuebleDetallesListado.classList.add("inmueble__detalles-listado");

        //Li Tipo
        const inmuebleDetallesLiTipo = document.createElement("li");
        inmuebleDetallesLiTipo.classList.add("inmueble__detalles-lista");
        const inmuebleDetallesLiParrafoTipo = document.createElement("p");
        inmuebleDetallesLiParrafoTipo.textContent = "Tipo:";
        const inmuebleDetallesLiSpanTipo = document.createElement("span");
        inmuebleDetallesLiSpanTipo.textContent = type;
        inmuebleDetallesLiTipo.appendChild(inmuebleDetallesLiParrafoTipo);
        inmuebleDetallesLiTipo.appendChild(inmuebleDetallesLiSpanTipo);

        //Li Year
        if (year_built) {
          const inmuebleDetallesLiYear = document.createElement("li");
          inmuebleDetallesLiYear.classList.add("inmueble__detalles-lista");
          const inmuebleDetallesLiParrafoYear = document.createElement("p");
          inmuebleDetallesLiParrafoYear.textContent = "Year de construccion:";
          const inmuebleDetallesLiSpanYear = document.createElement("span");
          inmuebleDetallesLiSpanYear.textContent = year_built;
          inmuebleDetallesLiYear.appendChild(inmuebleDetallesLiParrafoYear);
          inmuebleDetallesLiYear.appendChild(inmuebleDetallesLiSpanYear);
          inmuebleDetallesListado.appendChild(inmuebleDetallesLiYear);
        }

        //Li Recamaras
        const inmuebleDetallesLiBeds = document.createElement("li");
        inmuebleDetallesLiBeds.classList.add("inmueble__detalles-lista");
        const inmuebleDetallesLiParrafoBeds = document.createElement("p");
        inmuebleDetallesLiParrafoBeds.textContent = "Beds:";
        const inmuebleDetallesLiSpanBeds = document.createElement("span");
        inmuebleDetallesLiSpanBeds.textContent = beds;
        inmuebleDetallesLiBeds.appendChild(inmuebleDetallesLiParrafoBeds);
        inmuebleDetallesLiBeds.appendChild(inmuebleDetallesLiSpanBeds);

        //Li Baths
        const inmuebleDetallesLiBaths = document.createElement("li");
        inmuebleDetallesLiBaths.classList.add("inmueble__detalles-lista");
        const inmuebleDetallesLiParrafoBaths = document.createElement("p");
        inmuebleDetallesLiParrafoBaths.textContent = "Baths:";
        const inmuebleDetallesLiSpanBaths = document.createElement("span");
        inmuebleDetallesLiSpanBaths.textContent = baths;
        inmuebleDetallesLiBaths.appendChild(inmuebleDetallesLiParrafoBaths);
        inmuebleDetallesLiBaths.appendChild(inmuebleDetallesLiSpanBaths);

        //Li Asesor
        const inmuebleDetallesLiAsesor = document.createElement("li");
        inmuebleDetallesLiAsesor.classList.add("inmueble__detalles-lista");
        const inmuebleDetallesLiParrafoAsesor = document.createElement("p");
        inmuebleDetallesLiParrafoAsesor.textContent = "Asesor:";
        const inmuebleDetallesLiSpanAsesor = document.createElement("span");
        inmuebleDetallesLiSpanAsesor.textContent = full_name;
        inmuebleDetallesLiAsesor.appendChild(inmuebleDetallesLiParrafoAsesor);
        inmuebleDetallesLiAsesor.appendChild(inmuebleDetallesLiSpanAsesor);

        //Agregamos a la Lista de detalles
        inmuebleDetallesListado.appendChild(inmuebleDetallesLiTipo);

        inmuebleDetallesListado.appendChild(inmuebleDetallesLiBeds);
        inmuebleDetallesListado.appendChild(inmuebleDetallesLiBaths);
        inmuebleDetallesListado.appendChild(inmuebleDetallesLiAsesor);

        divInmuebleDetalles.appendChild(inmuebleDetallesHeading);
        divInmuebleDetalles.appendChild(inmuebleDetallesListado);

        //Mapa
        const divInmuebleMapa = document.createElement("div");
        divInmuebleMapa.classList.add("inmueble__mapa");
        const inmuebleMapaHeading = document.createElement("h3");
        inmuebleMapaHeading.classList.add("inmueble__subtitulo");
        inmuebleMapaHeading.textContent = "Ubicacion";

        const divMapa = document.createElement("div");
        divMapa.classList.add("mapa");
        divMapa.id = "mapa";

        divInmuebleMapa.appendChild(inmuebleMapaHeading);
        divInmuebleMapa.appendChild(divMapa);

        divInmuebleCaracteristicas.appendChild(divInmuebleDetalles);
        divInmuebleCaracteristicas.appendChild(divInmuebleMapa);

        //Asesor
        const divInmuebleAsesor = document.createElement("div");
        divInmuebleAsesor.classList.add("inmueble__asesor");

        const divAsesor = document.createElement("div");
        divAsesor.classList.add("asesor");
        const divAsesorImg = document.createElement("div");
        divAsesorImg.classList.add("asesor__img");
        const asesorImg = document.createElement("img");
        asesorImg.src = href;
        asesorImg.alt = `Imagen de ${full_name}`;
        divAsesorImg.appendChild(asesorImg);
        divAsesor.appendChild(divAsesorImg);

        const divAsesorInformacion = document.createElement("div");
        divAsesorInformacion.classList.add("asesor__informacion");

        const asesorSlogan = document.createElement("q");
        asesorSlogan.classList.add("asesor__slogan");
        asesorSlogan.textContent = slogan;
        divAsesorInformacion.appendChild(asesorSlogan);

        const asesorNombre = document.createElement("p");
        asesorNombre.classList.add("asesor__nombre");
        asesorNombre.textContent = full_name;
        divAsesorInformacion.appendChild(asesorNombre);

        const asesorTelefono = document.createElement("a");
        asesorTelefono.classList.add("asesor__telefono");
        asesorTelefono.textContent = number;
        asesorTelefono.href = `tel:${number}`;
        divAsesorInformacion.appendChild(asesorTelefono);

        const asesorEmail = document.createElement("a");
        asesorEmail.classList.add("asesor__email");
        asesorEmail.textContent = email;
        asesorEmail.href = `mailto:${email}`;
        divAsesorInformacion.appendChild(asesorEmail);

        const asesorFormulario = document.createElement("div");
        asesorFormulario.classList.add("asesor__formulario");
        asesorFormulario.innerHTML = `
        <form class="formulario">
                            <div class="formulario__campo">
                                <label for="nombre">Nombre</label>
                                <input type="text" placeholder="Escribe Tu Nombre">
                            </div>
                            <div class="formulario__campo">
                                <label for="email">Email</label>
                                <input type="email" name="email" id="email" placeholder="Escribe Tu Email">
                            </div>
                            <div class="formulario__campo">
                                <label for="telefono">Telefono</label>
                                <input type="tel" name="telefono" id="telefono" placeholder="Escribe Tu Telefono"
                                    max="10">
                            </div>
                            <div class="formulario__campo">
                                <label for="mensaje">Mensaje</label>
                                <textarea name="mensaje"
                                    id="mensaje">Me interesa mucho esta propiedad y quiero recibir más información.</textarea>
                            </div>
                            <button type="submit" class="formulario__submit asesor__boton">Enviar</button>
                        </form>
        `;

        divAsesor.appendChild(divAsesorInformacion);
        divAsesor.appendChild(asesorFormulario);

        divInmuebleAsesor.appendChild(divAsesor);

        divInmuebleDetallesGrid.appendChild(divInmuebleCaracteristicas);
        divInmuebleDetallesGrid.appendChild(divInmuebleAsesor);

        //Agregamos al div principal
        inmueble.appendChild(divInmuebleEncabezados);
        inmueble.appendChild(divInmuebleGaleria);
        inmueble.appendChild(divInmueblePrincipales);
        inmueble.appendChild(divInmuebleDetallesGrid);
        drawMapa(
          lat,
          lon,
          name,
          state,
          city,
          nameCounty,
          postal_code,
          line,
          divMapa.id
        );
        return true;
      }

      async function mostrarPropiedadRenta(propiedad) {
        limpiarHTML();
        if (!propiedad) {
          window.location.href = "renta.html";
          return;
        }
        let {
          id_agent,
          photos,
          type,
          status,
          location: {
            county: { name: nameCounty },
            address: {
              state,
              postal_code,
              coordinate: { lon, lat },
              line,
              city,
            },
          },
          description: {
            garage,
            name,
            year_built,
            sqft_max: sqft,
            baths_max: baths,
            beds_max: beds,
          },
          list_price_max: sold_price,
        } = propiedad;

        const agente = await getAgente(id_agent);
        let {
          full_name,
          email,
          slogan,
          photo: { href },
          phones: [{ number }],
        } = agente[0];
        //Div del nombre,precio,estado y ubicacion
        const divInmuebleEncabezados = document.createElement("div");
        divInmuebleEncabezados.classList.add("inmueble__encabezados");

        //Div de nombre y ubicacion
        const divInmuebleEncabezado = document.createElement("div");
        divInmuebleEncabezado.classList.add("inmueble__encabezado");

        //Nombre
        const headingInmuebleTitulo = document.createElement("h2");
        headingInmuebleTitulo.classList.add("inmueble__titulo");
        headingInmuebleTitulo.textContent = name;

        //Ubicacion
        const parrafoInmuebleUbicacion = document.createElement("p");
        parrafoInmuebleUbicacion.classList.add("inmueble__ubicacion");
        parrafoInmuebleUbicacion.textContent = `${nameCounty}, ${city}, ${state}`;

        //Agregamos al nombre y ubicacion en un div
        divInmuebleEncabezado.appendChild(headingInmuebleTitulo);
        divInmuebleEncabezado.appendChild(parrafoInmuebleUbicacion);

        //Divs del precio y estado
        const divInmuebleEstado = document.createElement("div");
        divInmuebleEstado.classList.add("inmueble__estado");

        //precio
        const headingInmueblePrecio = document.createElement("h3");
        headingInmueblePrecio.classList.add("inmueble__precio");
        headingInmueblePrecio.textContent = `$${sold_price}`;
        divInmuebleEstado.appendChild(headingInmueblePrecio);

        //Estado
        const parrafoInmuebleEstado = document.createElement("p");
        parrafoInmuebleEstado.classList.add("inmueble__disponible");
        parrafoInmuebleEstado.textContent = status;

        //Agregamos precio y estado en un div

        divInmuebleEstado.appendChild(parrafoInmuebleEstado);

        //Agregamos los div anteriores al div de encabezados
        divInmuebleEncabezados.appendChild(divInmuebleEncabezado);
        divInmuebleEncabezados.appendChild(divInmuebleEstado);

        //Div galeria
        const divInmuebleGaleria = document.createElement("div");
        divInmuebleGaleria.classList.add("inmueble__galeria");

        const divInmuebleSwiper = document.createElement("div");
        divInmuebleSwiper.classList.add(
          "swiper",
          "swiper--galeria",
          "inmueble__swiper"
        );

        const divInmuebleSwiperWrapper = document.createElement("div");
        divInmuebleSwiperWrapper.classList.add("swiper-wrapper");
        divInmuebleSwiperWrapper.id = "inmueble__imagenes";

        photos.forEach((img) => {
          const { href } = img;
          const divSwiperSlide = document.createElement("div");
          divSwiperSlide.classList.add("swiper-slide", "swiper-slide--galeria");
          const inmuebleImg = document.createElement("img");
          inmuebleImg.src = href;
          inmuebleImg.alt = name;
          divSwiperSlide.appendChild(inmuebleImg);
          divInmuebleSwiperWrapper.appendChild(divSwiperSlide);
        });
        divInmuebleSwiper.appendChild(divInmuebleSwiperWrapper);
        const divSwiperNext = document.createElement("div");
        divSwiperNext.classList.add("swiper-button-next");
        const divSwiperPrev = document.createElement("div");
        divSwiperPrev.classList.add("swiper-button-prev");
        const divSwiperPagination = document.createElement("div");
        divSwiperPagination.classList.add("swiper-pagination");

        divInmuebleSwiper.appendChild(divSwiperNext);
        divInmuebleSwiper.appendChild(divSwiperPrev);
        divInmuebleSwiper.appendChild(divSwiperPagination);

        divInmuebleGaleria.appendChild(divInmuebleSwiper);
        //Caracteristicas principales

        //div caracteristcas principales
        const divInmueblePrincipales = document.createElement("div");
        divInmueblePrincipales.classList.add(
          "imbueble__caracteristicas-principales"
        );

        //listado caracteristicas
        const inmuebleCaracteristicasListado = document.createElement("ul");
        inmuebleCaracteristicasListado.classList.add(
          "inmueble__caracteristicas-listado"
        );

        //item Remacaras
        const inmuebleLiRecamaras = document.createElement("li");
        inmuebleLiRecamaras.classList.add("inmueble__caracteristicas-lista");
        const inmuebleSpanRecamaras = document.createElement("span");
        inmuebleSpanRecamaras.textContent = beds;
        const inmuebleSmallRecamaras = document.createElement("small");
        inmuebleSmallRecamaras.textContent = "Recamaras";
        inmuebleLiRecamaras.appendChild(inmuebleSpanRecamaras);
        inmuebleLiRecamaras.appendChild(inmuebleSmallRecamaras);

        inmuebleCaracteristicasListado.appendChild(inmuebleLiRecamaras);

        //item Baths
        const inmuebleLiBaths = document.createElement("li");
        inmuebleLiBaths.classList.add("inmueble__caracteristicas-lista");
        const inmuebleSpanBaths = document.createElement("span");
        inmuebleSpanBaths.textContent = baths;
        const inmuebleSmallBaths = document.createElement("small");
        inmuebleSmallBaths.textContent = "Baths";
        inmuebleLiBaths.appendChild(inmuebleSpanBaths);
        inmuebleLiBaths.appendChild(inmuebleSmallBaths);

        inmuebleCaracteristicasListado.appendChild(inmuebleLiBaths);

        //item FT
        const inmuebleLiFt = document.createElement("li");
        inmuebleLiFt.classList.add("inmueble__caracteristicas-lista");
        const inmuebleSpanFt = document.createElement("span");
        inmuebleSpanFt.innerHTML = `${sqft} ft<sup>2</sup>`;
        const inmuebleSmallFt = document.createElement("small");
        inmuebleSmallFt.textContent = "De construccion";
        inmuebleLiFt.appendChild(inmuebleSpanFt);
        inmuebleLiFt.appendChild(inmuebleSmallFt);

        inmuebleCaracteristicasListado.appendChild(inmuebleLiFt);

        //item Estaionamiento
        const inmuebleLiEstacionamiento = document.createElement("li");
        inmuebleLiEstacionamiento.classList.add(
          "inmueble__caracteristicas-lista"
        );
        const inmuebleSpanEstacionamiento = document.createElement("span");
        inmuebleSpanEstacionamiento.textContent = garage;
        const inmuebleSmallEstacionamiento = document.createElement("small");
        inmuebleSmallEstacionamiento.textContent = "Estacionamientos";
        inmuebleLiEstacionamiento.appendChild(inmuebleSpanEstacionamiento);
        inmuebleLiEstacionamiento.appendChild(inmuebleSmallEstacionamiento);

        inmuebleCaracteristicasListado.appendChild(inmuebleLiEstacionamiento);

        //Ponemos la lista ul al div
        divInmueblePrincipales.appendChild(inmuebleCaracteristicasListado);

        //Div Grid
        const divInmuebleDetallesGrid = document.createElement("div");
        divInmuebleDetallesGrid.classList.add("inmueble__detalles-grid");

        //div caracteristicas
        const divInmuebleCaracteristicas = document.createElement("div");
        divInmuebleCaracteristicas.classList.add("inmueble__caracteristicas");

        //Inmueble detalles
        const divInmuebleDetalles = document.createElement("div");
        divInmuebleDetalles.classList.add("inmueble__detalles");
        const inmuebleDetallesHeading = document.createElement("h3");
        inmuebleDetallesHeading.classList.add("inmueble__subtitulo");
        inmuebleDetallesHeading.textContent = "Detalles";
        const inmuebleDetallesListado = document.createElement("ul");
        inmuebleDetallesListado.classList.add("inmueble__detalles-listado");

        //Li Tipo
        const inmuebleDetallesLiTipo = document.createElement("li");
        inmuebleDetallesLiTipo.classList.add("inmueble__detalles-lista");
        const inmuebleDetallesLiParrafoTipo = document.createElement("p");
        inmuebleDetallesLiParrafoTipo.textContent = "Tipo:";
        const inmuebleDetallesLiSpanTipo = document.createElement("span");
        inmuebleDetallesLiSpanTipo.textContent = type;
        inmuebleDetallesLiTipo.appendChild(inmuebleDetallesLiParrafoTipo);
        inmuebleDetallesLiTipo.appendChild(inmuebleDetallesLiSpanTipo);

        //Li Year
        if (year_built) {
          const inmuebleDetallesLiYear = document.createElement("li");
          inmuebleDetallesLiYear.classList.add("inmueble__detalles-lista");
          const inmuebleDetallesLiParrafoYear = document.createElement("p");
          inmuebleDetallesLiParrafoYear.textContent = "Year de construccion:";
          const inmuebleDetallesLiSpanYear = document.createElement("span");
          inmuebleDetallesLiSpanYear.textContent = year_built;
          inmuebleDetallesLiYear.appendChild(inmuebleDetallesLiParrafoYear);
          inmuebleDetallesLiYear.appendChild(inmuebleDetallesLiSpanYear);
          inmuebleDetallesListado.appendChild(inmuebleDetallesLiYear);
        }

        //Li Recamaras
        const inmuebleDetallesLiBeds = document.createElement("li");
        inmuebleDetallesLiBeds.classList.add("inmueble__detalles-lista");
        const inmuebleDetallesLiParrafoBeds = document.createElement("p");
        inmuebleDetallesLiParrafoBeds.textContent = "Beds:";
        const inmuebleDetallesLiSpanBeds = document.createElement("span");
        inmuebleDetallesLiSpanBeds.textContent = beds;
        inmuebleDetallesLiBeds.appendChild(inmuebleDetallesLiParrafoBeds);
        inmuebleDetallesLiBeds.appendChild(inmuebleDetallesLiSpanBeds);

        //Li Baths
        const inmuebleDetallesLiBaths = document.createElement("li");
        inmuebleDetallesLiBaths.classList.add("inmueble__detalles-lista");
        const inmuebleDetallesLiParrafoBaths = document.createElement("p");
        inmuebleDetallesLiParrafoBaths.textContent = "Baths:";
        const inmuebleDetallesLiSpanBaths = document.createElement("span");
        inmuebleDetallesLiSpanBaths.textContent = baths;
        inmuebleDetallesLiBaths.appendChild(inmuebleDetallesLiParrafoBaths);
        inmuebleDetallesLiBaths.appendChild(inmuebleDetallesLiSpanBaths);

        //Li Asesor
        const inmuebleDetallesLiAsesor = document.createElement("li");
        inmuebleDetallesLiAsesor.classList.add("inmueble__detalles-lista");
        const inmuebleDetallesLiParrafoAsesor = document.createElement("p");
        inmuebleDetallesLiParrafoAsesor.textContent = "Asesor:";
        const inmuebleDetallesLiSpanAsesor = document.createElement("span");
        inmuebleDetallesLiSpanAsesor.textContent = full_name;
        inmuebleDetallesLiAsesor.appendChild(inmuebleDetallesLiParrafoAsesor);
        inmuebleDetallesLiAsesor.appendChild(inmuebleDetallesLiSpanAsesor);

        //Agregamos a la Lista de detalles
        inmuebleDetallesListado.appendChild(inmuebleDetallesLiTipo);

        inmuebleDetallesListado.appendChild(inmuebleDetallesLiBeds);
        inmuebleDetallesListado.appendChild(inmuebleDetallesLiBaths);
        inmuebleDetallesListado.appendChild(inmuebleDetallesLiAsesor);

        divInmuebleDetalles.appendChild(inmuebleDetallesHeading);
        divInmuebleDetalles.appendChild(inmuebleDetallesListado);

        //Mapa
        const divInmuebleMapa = document.createElement("div");
        divInmuebleMapa.classList.add("inmueble__mapa");
        const inmuebleMapaHeading = document.createElement("h3");
        inmuebleMapaHeading.classList.add("inmueble__subtitulo");
        inmuebleMapaHeading.textContent = "Ubicacion";

        const divMapa = document.createElement("div");
        divMapa.classList.add("mapa");
        divMapa.id = "mapa";

        divInmuebleMapa.appendChild(inmuebleMapaHeading);
        divInmuebleMapa.appendChild(divMapa);

        divInmuebleCaracteristicas.appendChild(divInmuebleDetalles);
        divInmuebleCaracteristicas.appendChild(divInmuebleMapa);

        //Asesor
        const divInmuebleAsesor = document.createElement("div");
        divInmuebleAsesor.classList.add("inmueble__asesor");

        const divAsesor = document.createElement("div");
        divAsesor.classList.add("asesor");
        const divAsesorImg = document.createElement("div");
        divAsesorImg.classList.add("asesor__img");
        const asesorImg = document.createElement("img");
        asesorImg.src = href;
        asesorImg.alt = `Imagen de ${full_name}`;
        divAsesorImg.appendChild(asesorImg);
        divAsesor.appendChild(divAsesorImg);

        const divAsesorInformacion = document.createElement("div");
        divAsesorInformacion.classList.add("asesor__informacion");

        const asesorSlogan = document.createElement("q");
        asesorSlogan.classList.add("asesor__slogan");
        asesorSlogan.textContent = slogan;
        divAsesorInformacion.appendChild(asesorSlogan);

        const asesorNombre = document.createElement("p");
        asesorNombre.classList.add("asesor__nombre");
        asesorNombre.textContent = full_name;
        divAsesorInformacion.appendChild(asesorNombre);

        const asesorTelefono = document.createElement("a");
        asesorTelefono.classList.add("asesor__telefono");
        asesorTelefono.textContent = number;
        asesorTelefono.href = `tel:${number}`;
        divAsesorInformacion.appendChild(asesorTelefono);

        const asesorEmail = document.createElement("a");
        asesorEmail.classList.add("asesor__email");
        asesorEmail.textContent = email;
        asesorEmail.href = `mailto:${email}`;
        divAsesorInformacion.appendChild(asesorEmail);

        const asesorFormulario = document.createElement("div");
        asesorFormulario.classList.add("asesor__formulario");
        asesorFormulario.innerHTML = `
        <form class="formulario">
                            <div class="formulario__campo">
                                <label for="nombre">Nombre</label>
                                <input type="text" placeholder="Escribe Tu Nombre">
                            </div>
                            <div class="formulario__campo">
                                <label for="email">Email</label>
                                <input type="email" name="email" id="email" placeholder="Escribe Tu Email">
                            </div>
                            <div class="formulario__campo">
                                <label for="telefono">Telefono</label>
                                <input type="tel" name="telefono" id="telefono" placeholder="Escribe Tu Telefono"
                                    max="10">
                            </div>
                            <div class="formulario__campo">
                                <label for="mensaje">Mensaje</label>
                                <textarea name="mensaje"
                                    id="mensaje">Me interesa mucho esta propiedad y quiero recibir más información.</textarea>
                            </div>
                            <button type="submit" class="formulario__submit asesor__boton">Enviar</button>
                        </form>
        `;

        divAsesor.appendChild(divAsesorInformacion);
        divAsesor.appendChild(asesorFormulario);

        divInmuebleAsesor.appendChild(divAsesor);

        divInmuebleDetallesGrid.appendChild(divInmuebleCaracteristicas);
        divInmuebleDetallesGrid.appendChild(divInmuebleAsesor);

        //Agregamos al div principal
        inmueble.appendChild(divInmuebleEncabezados);
        inmueble.appendChild(divInmuebleGaleria);
        inmueble.appendChild(divInmueblePrincipales);
        inmueble.appendChild(divInmuebleDetallesGrid);
        drawMapa(
          lat,
          lon,
          name,
          state,
          city,
          nameCounty,
          postal_code,
          line,
          divMapa.id
        );
        return true;
      }
      const getAgente = async (id) => {
        try {
          const respuesta = await fetch(
            `http://localhost:4001/agents?id=${id}`
          );
          const agente = await respuesta.json();
          return agente;
        } catch (error) {
          console.log(error);
        }
      };

      function inicializarSwiper() {
        const opciones = {
          slidesPerView: 1,
          spaceBetween: 30,
          loop: false,
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
          },
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
        };
        Swiper.use(Navigation);
        Swiper.use(Pagination);
        new Swiper(".inmueble__swiper", opciones);
      }

      function drawMapa(
        lat,
        lon,
        nombre,
        state,
        city,
        nameCounty,
        postal_code,
        line,
        id
      ) {
        const zoom = 16;
        const map = L.map(`${id}`).setView([lat, lon], zoom);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        L.marker([lat, lon])
          .addTo(map)
          .bindPopup(
            `
        <h2 class="mapa__nombre">${nombre}</h2>
        <p class="mapa__ubicacion">${line} ${postal_code} <br> 
        ${nameCounty}, ${city}, ${state}</p>
    `
          )
          .openPopup();
      }
      function limpiarHTML() {
        while (inmueble.firstChild) {
          inmueble.removeChild(inmueble.firstChild);
        }
      }
    }); //DOMCONTENTLOADED
  }
})();

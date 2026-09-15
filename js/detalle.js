const estadoCargando = document.getElementById("estadoCargando");
const estadoError = document.getElementById("estadoError");
const detalleProveedor = document.getElementById("detalleProveedor");

const nombreProveedor = document.getElementById("nombreProveedor");
const fotoProveedor = document.getElementById("fotoProveedor");
const categoriaProveedor = document.getElementById("categoriaProveedor");
const calificacionProveedor = document.getElementById("calificacionProveedor");
const descripcionProveedor = document.getElementById("descripcionProveedor");
const llamarProveedor = document.getElementById("llamarProveedor");
const whatsappProveedor = document.getElementById("whatsappProveedor");

// FUNCION PARA GENERAR LA CANTIDAD DE ESTRELLAS SEGUN CALIFICACION
function generarEstrellas(calificacion) {
  const llenas = Math.round(calificacion);
  let estrellas = "";
  for (let i = 1; i <= 5; i++) {
    estrellas += i <= llenas ? "★" : "☆";
  }
  return estrellas;
}

// SE OBTIENE EL ID DEL PROFESIONAL DE LA URL
function obtenerIdDeUrl() {
  const parametros = new URLSearchParams(window.location.search); // CAPTURA LA CADENA DE CONSULTA DE LA URL ACTUAL
  return Number(parametros.get("id")); // EXTRAE Y RETORNA EL VALOR DE ID
}

// FUNCION PARA VER LOS DATOS DEL PROFESIONAL
function mostrarProveedor(proveedor) {
  // ACTUALIZA LAS PROPIEDADES DDE LAS ETIQUETAS HTMLCON LAS DEL PROFESIONAL
  fotoProveedor.src = proveedor.foto;
  fotoProveedor.alt = proveedor.nombre;
  nombreProveedor.textContent = proveedor.nombre;
  categoriaProveedor.textContent = proveedor.categoria;
  calificacionProveedor.textContent = generarEstrellas(proveedor.calificacion) + " (" + proveedor.calificacion + ")";
  descripcionProveedor.textContent = proveedor.descripcion;
  llamarProveedor.href = "tel:" + proveedor.telefono;
  whatsappProveedor.href = "https://wa.me/" + proveedor.telefono.replace("+", "");

  estadoCargando.hidden = true; // OCULTA EL ESTADO DE CARGA
  detalleProveedor.hidden = false; // MUESTRA DETALLES
}

// FUNCION QUE INDICA SI HUBO UN ERROR
function mostrarError() {
  estadoCargando.hidden = true; // OCULTA EL ESTADO DE CARGA
  estadoError.hidden = false; // MUESTRA ESTADO DE ERROR
}

// FUNCION PARA CARGAR DETTALES DEL PROFESIONAL
function cargarDetalle() {
  const id = obtenerIdDeUrl(); // OBTIENE EL ID

  // REALIZA PETICION PARA VER LOS PROVEEDORES
  fetch("data/proveedores.json")
    .then((respuesta) => {
      if (!respuesta.ok) {
        throw new Error("Error de red");
      }
      return respuesta.json();
    })
    // SI TODO SALE BIEN
    .then((proveedores) => {
      const proveedor = proveedores.find((p) => p.id === id); // RECORRE EL ARRAY DE PROFESIONALES Y GUARDA AL QUE COINCIDA CON EL ID
      // SI EL PROVEEDOR NO EXISTE MUESTRA ERROR
      if (!proveedor) {
        mostrarError();
        return;
      }
      // MUESTRA LOS DETALLES DEL PROVEEDOR SELECCIONADO
      mostrarProveedor(proveedor);
    })
    // SI OCURRE UN ERROR MUESTRA SU ESTADO CORRESPONDIENTE
    .catch(() => {
      mostrarError();
    });
}

// LLAMA A LA FUNCION PARA CARGAR DETALLES
cargarDetalle();
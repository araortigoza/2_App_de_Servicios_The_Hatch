const estadoCargando = document.getElementById("estadoCargando");
const estadoError = document.getElementById("estadoError");
const detalleProveedor = document.getElementById("detalleProveedor");

const nombreProveedor = document.getElementById("nombreProveedor");
const categoriaProveedor = document.getElementById("categoriaProveedor");
const calificacionProveedor = document.getElementById("calificacionProveedor");
const descripcionProveedor = document.getElementById("descripcionProveedor");
const llamarProveedor = document.getElementById("llamarProveedor");

function generarEstrellas(calificacion) {
  const llenas = Math.round(calificacion);
  let estrellas = "";
  for (let i = 1; i <= 5; i++) {
    estrellas += i <= llenas ? "★" : "☆";
  }
  return estrellas;
}

function obtenerIdDeUrl() {
  const parametros = new URLSearchParams(window.location.search);
  return Number(parametros.get("id"));
}

function mostrarProveedor(proveedor) {
  nombreProveedor.textContent = proveedor.nombre;
  categoriaProveedor.textContent = proveedor.categoria;
  calificacionProveedor.textContent = generarEstrellas(proveedor.calificacion) + " (" + proveedor.calificacion + ")";
  descripcionProveedor.textContent = proveedor.descripcion;
  llamarProveedor.href = "tel:" + proveedor.telefono;

  estadoCargando.hidden = true;
  detalleProveedor.hidden = false;
}

function mostrarError() {
  estadoCargando.hidden = true;
  estadoError.hidden = false;
}

function cargarDetalle() {
  const id = obtenerIdDeUrl();

  fetch("data/proveedores.json")
    .then((respuesta) => {
      if (!respuesta.ok) {
        throw new Error("Error de red");
      }
      return respuesta.json();
    })
    .then((proveedores) => {
      const proveedor = proveedores.find((p) => p.id === id);
      if (!proveedor) {
        mostrarError();
        return;
      }
      mostrarProveedor(proveedor);
    })
    .catch(() => {
      mostrarError();
    });
}

cargarDetalle();
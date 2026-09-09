const listaProveedores = document.getElementById("listaProveedores");
const estadoCargando = document.getElementById("estadoCargando");
const estadoSinResultados = document.getElementById("estadoSinResultados");
const estadoError = document.getElementById("estadoError");
const filtroCategoria = document.getElementById("filtroCategoria");
const btnForzarError = document.getElementById("btnForzarError");

let todosLosProveedores = [];
let forzarError = false;

function mostrarEstado(estado) {
  estadoCargando.hidden = estado !== "cargando";
  estadoSinResultados.hidden = estado !== "sinResultados";
  estadoError.hidden = estado !== "error";
  listaProveedores.hidden = estado !== "listo";
}

function generarEstrellas(calificacion) {
  const llenas = Math.round(calificacion);
  let estrellas = "";
  for (let i = 1; i <= 5; i++) {
    estrellas += i <= llenas ? "★" : "☆";
  }
  return estrellas;
}

function cargarCategorias(proveedores) {
  const categorias = [...new Set(proveedores.map((p) => p.categoria))];
  categorias.forEach((categoria) => {
    const option = document.createElement("option");
    option.value = categoria;
    option.textContent = categoria;
    filtroCategoria.appendChild(option);
  });
}

function renderizarProveedores(proveedores) {
  listaProveedores.innerHTML = "";

  if (proveedores.length === 0) {
    mostrarEstado("sinResultados");
    return;
  }

  proveedores.forEach((proveedor) => {
    const item = document.createElement("li");

    const nombre = document.createElement("h2");
    nombre.textContent = proveedor.nombre;

    const categoria = document.createElement("p");
    categoria.textContent = proveedor.categoria;

    const calificacion = document.createElement("p");
    calificacion.textContent = generarEstrellas(proveedor.calificacion) + " (" + proveedor.calificacion + ")";

    const verMas = document.createElement("a");
    verMas.href = "detalle.html?id=" + proveedor.id;
    verMas.textContent = "Ver más";

    const llamar = document.createElement("a");
    llamar.href = "tel:" + proveedor.telefono;
    llamar.textContent = "Llamar";

    item.appendChild(nombre);
    item.appendChild(categoria);
    item.appendChild(calificacion);
    item.appendChild(verMas);
    item.appendChild(llamar);

    listaProveedores.appendChild(item);
  });

  mostrarEstado("listo");
}

function filtrarPorCategoria() {
  const categoriaElegida = filtroCategoria.value;
  if (categoriaElegida === "todas") {
    renderizarProveedores(todosLosProveedores);
  } else {
    const filtrados = todosLosProveedores.filter((p) => p.categoria === categoriaElegida);
    renderizarProveedores(filtrados);
  }
}

function cargarProveedores() {
  mostrarEstado("cargando");

  setTimeout(() => {
    if (forzarError) {
      mostrarEstado("error");
      forzarError = false;
      return;
    }

    fetch("data/proveedores.json")
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error("Error de red");
        }
        return respuesta.json();
      })
      .then((proveedores) => {
        todosLosProveedores = proveedores;
        cargarCategorias(proveedores);
        renderizarProveedores(proveedores);
      })
      .catch(() => {
        mostrarEstado("error");
      });
  }, 800);
}

filtroCategoria.addEventListener("change", filtrarPorCategoria);
btnForzarError.addEventListener("click", () => {
  forzarError = true;
  cargarProveedores();
});

cargarProveedores();
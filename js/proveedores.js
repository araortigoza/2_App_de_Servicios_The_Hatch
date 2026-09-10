const listaProveedores = document.getElementById("listaProveedores");
const estadoCargando = document.getElementById("estadoCargando");
const estadoSinResultados = document.getElementById("estadoSinResultados");
const estadoError = document.getElementById("estadoError");
const botonDropdown = document.getElementById("botonDropdown");
const listaDropdown = document.getElementById("listaDropdown");
const textoSeleccionado = document.getElementById("textoSeleccionado");

let todosLosProveedores = [];
let categoriaActual = "todas";

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

function abrirDropdown() {
  listaDropdown.hidden = false;
  botonDropdown.setAttribute("aria-expanded", "true");
}

function cerrarDropdown() {
  listaDropdown.hidden = true;
  botonDropdown.setAttribute("aria-expanded", "false");
}

function seleccionarOpcion(opcion) {
  const opciones = listaDropdown.querySelectorAll(".dropdownOpcion");
  opciones.forEach((o) => o.classList.remove("seleccionada"));
  opcion.classList.add("seleccionada");
  textoSeleccionado.textContent = opcion.textContent;
  categoriaActual = opcion.dataset.valor;
  cerrarDropdown();
  filtrarPorCategoria();
}

function cargarCategorias(proveedores) {
  const categorias = [...new Set(proveedores.map((p) => p.categoria))];
  categorias.forEach((categoria) => {
    const opcion = document.createElement("li");
    opcion.role = "option";
    opcion.tabIndex = -1;
    opcion.dataset.valor = categoria;
    opcion.className = "dropdownOpcion";
    opcion.textContent = categoria;
    opcion.addEventListener("click", () => seleccionarOpcion(opcion));
    listaDropdown.appendChild(opcion);
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
  if (categoriaActual === "todas") {
    renderizarProveedores(todosLosProveedores);
  } else {
    const filtrados = todosLosProveedores.filter((p) => p.categoria === categoriaActual);
    renderizarProveedores(filtrados);
  }
}

function cargarProveedores() {
  mostrarEstado("cargando");

  setTimeout(() => {
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

botonDropdown.addEventListener("click", () => {
  if (listaDropdown.hidden) {
    abrirDropdown();
  } else {
    cerrarDropdown();
  }
});

listaDropdown.querySelector(".dropdownOpcion").addEventListener("click", (evento) => {
  seleccionarOpcion(evento.target);
});

document.addEventListener("click", (evento) => {
  if (!evento.target.closest(".dropdown")) {
    cerrarDropdown();
  }
});

botonDropdown.addEventListener("keydown", (evento) => {
  const opciones = Array.from(listaDropdown.querySelectorAll(".dropdownOpcion"));
  const resaltada = listaDropdown.querySelector(".resaltada");
  const indiceActual = resaltada ? opciones.indexOf(resaltada) : -1;

  if (evento.key === "ArrowDown" || evento.key === "Enter" || evento.key === " ") {
    evento.preventDefault();
    if (listaDropdown.hidden) {
      abrirDropdown();
      opciones[0].classList.add("resaltada");
    } else if (evento.key === "ArrowDown") {
      if (resaltada) resaltada.classList.remove("resaltada");
      const siguiente = opciones[(indiceActual + 1) % opciones.length];
      siguiente.classList.add("resaltada");
    } else if (resaltada) {
      seleccionarOpcion(resaltada);
    }
  }

  if (evento.key === "ArrowUp" && !listaDropdown.hidden) {
    evento.preventDefault();
    if (resaltada) resaltada.classList.remove("resaltada");
    const anterior = opciones[(indiceActual - 1 + opciones.length) % opciones.length];
    anterior.classList.add("resaltada");
  }

  if (evento.key === "Escape") {
    cerrarDropdown();
  }
});

cargarProveedores();
// SE GUARDA EN CONSTANTES LAS ETIQUETAS DE HTML A UTILIZAR
const listaProveedores = document.getElementById("listaProveedores");
const estadoCargando = document.getElementById("estadoCargando");
const estadoSinResultados = document.getElementById("estadoSinResultados");
const estadoError = document.getElementById("estadoError");
const botonDropdown = document.getElementById("botonDropdown");
const listaDropdown = document.getElementById("listaDropdown");
const textoSeleccionado = document.getElementById("textoSeleccionado");

let todosLosProveedores = []; // VARIABLE PARA ALMACENAR A LOS PROVEEDORES
let categoriaActual = "todas"; // VARIABLE DE CATEGORIAS SELECCIONADA POR EL USUARIO

// FUNCION PARA EL RENDERIZADO SEGUN ESTADO
function mostrarEstado(estado) {
  // COMPARAMOS EL ESTADO ACTUAL DE LA PAGINA CON LOS VALORES CORRESPONDIENTES
  estadoCargando.hidden = estado !== "cargando";
  estadoSinResultados.hidden = estado !== "sinResultados";
  estadoError.hidden = estado !== "error";
  listaProveedores.hidden = estado !== "listo";
}

// FUNCION PARA GENERAR LA CANTIDAD DE ESTRELLAS SEGUN CALIFICACION
function generarEstrellas(calificacion) {
  const llenas = Math.round(calificacion); // SE REDONDEA EL NUMERO DE LA CALIFICACION
  let estrellas = ""; // VARIABLE PARA INSERTAR LA CANTIDAD CORRECTA DE ESTRELLAS
  // SE RECORRE DEL 1 AL 5 QUE ES LA CALIFICACION MAXIMA
  for (let i = 1; i <= 5; i++) {
    estrellas += i <= llenas ? "★" : "☆"; // SE VA RELLENANDO LAS ESTRELLAS SEGUN LA CALIFICACION
  }
  return estrellas; // SE RETORNA LA CANTIDAD DE ESTRELLAS CORRESPONDIENTE
}

// FUNCION PARA ABRIR LA LISTA DE CATEGORIAS
function abrirDropdown() {
  listaDropdown.hidden = false; // SE CAMBIA A FALSE PARA QUE EL NAVEGADOR QUITE EL ATRIBUTO DE OCULTACION Y MUESTRE EL MENU DESPLEGABLE
  botonDropdown.setAttribute("aria-expanded", "true"); // CAMBIA LOS ATRIBUTOS DE ACCESIBILIDAD DE HTML DE WAI-ARIA
}

// FUNCION PARA CERRAR LA LISTA DE CATEGORIAS
function cerrarDropdown() {
  listaDropdown.hidden = true; // SE CAMBIA A TRUE PARA QUE EL NAVEGADOR PONGA EL ATRIBUTO DE OCULTACION Y DESAPAREZCA EL MENU DESPLEGABLE
  botonDropdown.setAttribute("aria-expanded", "false"); // CAMBIA LOS ATRIBUTOS DE ACCESIBILIDAD DE HTML DE WAI-ARIA
}

// FUNCION PARA SELECCIONAR UNA OPCION DE LA LSITA DE CATEGORIAS
function seleccionarOpcion(opcion) {
  const opciones = listaDropdown.querySelectorAll(".dropdownOpcion"); // BUSCA DENTRO DE LA LISTA EL SELECTOR CSS .dropdownOpcion Y DEVUELVE UNA NODELIST
  opciones.forEach((o) => o.classList.remove("seleccionada")); // RECORRE EL NODELIST Y REMUEVE LA CLASE SELECCIONADA DE LA OPCION PARA QUE NO QUEDEN DOS OPCIONES RESALTADAS AL MISMO TIEMPO
  opcion.classList.add("seleccionada"); // TOMA EL ELEMENTO HTML OPCION Y LE INYECTA LA CLASE CSS "SELECCIONADA"
  textoSeleccionado.textContent = opcion.textContent; // TOMA EL TEXTO DE LA OPCION DEL USUARIO Y LO TRANSCRIBE EN EL BOTON
  categoriaActual = opcion.dataset.valor; // SE GUARDA LA CATEGORIA ACTUAL
  cerrarDropdown(); // SE CIERRA LA LSITA DE CATEGORIAS
  filtrarPorCategoria(); // FILTRAMOS LA CATEGORIA
}


function cargarCategorias(proveedores) {
  const categorias = [...new Set(proveedores.map((p) => p.categoria))]; // SE RECORRE EL ARREGLO DE PROVEEDORES, SE CONVIERTE EN UN SET PARA EVITAR DUBLICADOS Y SE CONVIERTE NUEVAMENTE EN UN ARRAY PARA RECORRERLO
  // SE RECORREN LAS CATEGORIAS
  categorias.forEach((categoria) => {
    // CREA NUEVOS ELEMENTOS HTML DENTRO DE LI
    const opcion = document.createElement("li");
    opcion.role = "option";
    opcion.tabIndex = -1;
    opcion.dataset.valor = categoria;
    opcion.className = "dropdownOpcion";
    opcion.textContent = categoria;
    opcion.addEventListener("click", () => seleccionarOpcion(opcion)); // PONE A ESCUCHA Y LE DA A CADA OPCION LA CAPACIADAD DE REACCIONAR A CUALQUIER CLIC
    listaDropdown.appendChild(opcion); // AGREGA EL NUEVO NODO LI AL DOM COMO HIJO DE UL
  });
}

// FUNCION QUE PREPARA TODO PARA EL RENDERIZADO DE PROVEEDORES
function renderizarProveedores(proveedores) {
  listaProveedores.innerHTML = ""; // BORRA EL CONTENIDO HTML PREVIO QUE EXISTA DENTRO DE UL PARA EVITAR DUPLICACIONES

  // SI LA CANTIDAD DE PROVEEDORES ES 0, MUESTRA MENSAJE DEL ESTADO CORRESPONDIENDE
  if (proveedores.length === 0) {
    mostrarEstado("sinResultados");
    return;
  }

  // SE RECORRE EN CADA PROVEEDOR DENTRO DEL ARRAY DE PROVEEDORES
  proveedores.forEach((proveedor) => {
    const item = document.createElement("li"); // SE CREA UN ELEMENTO LI

    // SE EXTRAE TODOS LOS DATOS DEL PROVEEDOR Y LE LOS PREPARA PARA LA ETIQUETA LI CON SUS ELEMENTOS CORRESPONDIENTES
    const foto = document.createElement("img");
    foto.src = proveedor.foto;
    foto.alt = proveedor.nombre;
    foto.className = "fotoProveedor";

    const nombre = document.createElement("h2");
    nombre.textContent = proveedor.nombre;

    const categoria = document.createElement("p");
    categoria.textContent = proveedor.categoria;

    const calificacion = document.createElement("p");
    calificacion.textContent = generarEstrellas(proveedor.calificacion) + " (" + proveedor.calificacion + ")";

    const verMas = document.createElement("a");
    verMas.href = "detalle.html?id=" + proveedor.id;
    verMas.textContent = "Ver más";
    verMas.className = "botonVerMas";

    const llamar = document.createElement("a");
    llamar.href = "tel:" + proveedor.telefono;
    llamar.textContent = "Llamar";
    llamar.className = "botonLlamar";

    const whatsapp = document.createElement("a");
    whatsapp.href = "https://wa.me/" + proveedor.telefono.replace("+", "");
    whatsapp.textContent = "WhatsApp";
    whatsapp.target = "_blank";
    whatsapp.rel = "noopener";
    whatsapp.className = "botonWhatsapp";

    // SE AGREGA CADA UNO DE ESTOS ELEMENTOS A LA ETIQUETA LI
    item.appendChild(foto);
    item.appendChild(nombre);
    item.appendChild(categoria);
    item.appendChild(calificacion);
    item.appendChild(verMas);
    item.appendChild(llamar);
    item.appendChild(whatsapp);

    listaProveedores.appendChild(item); // AGREGA EL NUEVO NODO LI AL DOM COMO HIJO DE UL
  });

  // CUANDO TODO SALGA BIEN MOSTRAMOS EL ESTADO CORRESPONDIENTE
  mostrarEstado("listo");
}

// FUNCION PARA FILTRAR POR CATEGORIAS
function filtrarPorCategoria() {
  // SI LA CATEGORIA ACTUAL ES "TODAS"
  if (categoriaActual === "todas") {
    renderizarProveedores(todosLosProveedores); // MUESTRA TODOS LOS PROVEEDORES
  // SI LA CATEGORIA ACTUAL NO ES "TODAS"
  } else {
    const filtrados = todosLosProveedores.filter((p) => p.categoria === categoriaActual); // SE GUARDA EN UN NUEVO ARRAY TODOS LOS PROVEEDORES CON LA CATEGORIA ACTUAL
    renderizarProveedores(filtrados); // MUESTRA SOLO LOS PROVEEDORES CON DICHA CATEGORIA
  }
}

// FUNCION PARA MOSTRAR LOS PROVEEDORES
function cargarProveedores() {
  mostrarEstado("cargando"); // SE MUESTRA EL ESTADO CARGANDO

  setTimeout(() => {
    fetch("data/proveedores.json") // SE HACE UNA PETICION CON LOS DATOS DE PROFESIONALES
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error("Error de red");
        }
        return respuesta.json();
      })
      // SI TODO SALE BIEN LLAMAMOS A ESAS FUNCIONES
      .then((proveedores) => {
        todosLosProveedores = proveedores;
        cargarCategorias(proveedores);
        renderizarProveedores(proveedores);
      })
      // SI OCURRE UN ERROR SE MUESTRA EL ESTADO CORRESPONDIENTE
      .catch(() => {
        mostrarEstado("error");
      });
  }, 800);
}

// EL ESCUCHADOR DEL EVENTO PARA LA LISTA DE CATEGORIAS
botonDropdown.addEventListener("click", () => {
  if (listaDropdown.hidden) {
    abrirDropdown();
  } else {
    cerrarDropdown();
  }
});

// EL ESCUCHADOR DE LA LISTA DE CATEGORIAS AL FILTRAR CATEGORIAS
listaDropdown.querySelector(".dropdownOpcion").addEventListener("click", (evento) => {
  seleccionarOpcion(evento.target); // LLAMA A LA FUNCION PASANDO EL ELEMENTO EXACTO EN DONDE SE HIZO CLIC
});

// ESCUCHADOR PARA CERRAR LA LISTA DE CATEGORIAS
// SE PONE EN ESCUCHA EN TODO EL DOCUMENTO
document.addEventListener("click", (evento) => {
  if (!evento.target.closest(".dropdown")) {
    cerrarDropdown(); // CIERRA LA LISTA DE CATEGORIAS
  }
});

// FUNCION QUE PERMITE NAVEGAR CON TECLADO
botonDropdown.addEventListener("keydown", (evento) => {
  const opciones = Array.from(listaDropdown.querySelectorAll(".dropdownOpcion")); // DEVUELVE UN ARRAY DE LAS OPCIONES
  const resaltada = listaDropdown.querySelector(".resaltada"); // BUSCA QUE OPCION ESTA RESALTADA ACTUALMENTE
  const indiceActual = resaltada ? opciones.indexOf(resaltada) : -1; // GUARDA EL INDICE DE LA OPCION RESALTADA Y AGREGA -1 SI NO HAY NINGUNA

  if (evento.key === "ArrowDown" || evento.key === "Enter" || evento.key === " ") {
    evento.preventDefault(); // DESACTIVA EL COMPORTAMIENTO POR DEFAULT DEL DAVEGADOR COMO IR SCROLLEAR HACIA ABAJO SI SE PRESIONA LA FLECHA DE ABAJO
    // SI LA LSITA ESTA CERRADA
    if (listaDropdown.hidden) {
      abrirDropdown(); // ABRE EL DESPLEGABLE
      opciones[0].classList.add("resaltada"); // Y RESALTA LA PRIMERA OPCION
    // SI SE PRESIONA LA FLECHA DE ABAJO
    } else if (evento.key === "ArrowDown") {
      if (resaltada) resaltada.classList.remove("resaltada"); // QUITA A LA OPCION LA CLASE RESALTADA
      const siguiente = opciones[(indiceActual + 1) % opciones.length]; // BUCLE INFINITO QUE SUMA 1 AL INDICE Y AL TERMINAR LA LISTA VUELVE A SER 0
      siguiente.classList.add("resaltada"); // LE AGREGA AL SIGUIENTE OPCION LA CLASE RESALTADA
    // SI SE PRESION ENTER O ESPACIO LO TOMA COMO LA OPCION SELECCIONADA
    } else if (resaltada) {
      seleccionarOpcion(resaltada);
    }
  }

  // BLOQUE IDENTICO A LA ANTERIOR PERO CON FLECHA ARRIBA
  if (evento.key === "ArrowUp" && !listaDropdown.hidden) {
    evento.preventDefault();
    if (resaltada) resaltada.classList.remove("resaltada");
    const anterior = opciones[(indiceActual - 1 + opciones.length) % opciones.length];
    anterior.classList.add("resaltada");
  }

  // CERRAR LISTA SI SE OPRIME ESC
  if (evento.key === "Escape") {
    cerrarDropdown();
  }
});

// SE LLAMA A LA FUBCION PARA CARGAR PROVEEDORES
cargarProveedores();
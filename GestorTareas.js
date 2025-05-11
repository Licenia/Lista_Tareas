
class GestorTareas {
    constructor(idTabla) {
        const tabla = document.getElementById(idTabla);
        if (!tabla) {
            console.error("No se encontro el id de la tabla ")
        }
        this.tabla = tabla.querySelector("tbody");
    }

    agregarTarea(nombreTarea, opcionesEstado, estadoSeleccionado = opcionesEstado[0]){
        const fila = document.createElement("tr");

        const celdaTarea = document.createElement("td");
        celdaTarea.textContent = nombreTarea;
        fila.appendChild(celdaTarea);

        const celdaEstado = document.createElement("td");
        const select = document.createElement("select");
        
        opcionesEstado.forEach(opcion => {
            const option = document.createElement("option");
            option.value = opcion;
            option.textContent = opcion;

            if(opcion === estadoSeleccionado){
                option.selected = true;
            }
            select.appendChild(option);
        });

        select.classList.remove("pendiente", "completada");
        if (estadoSeleccionado.toLowerCase() === "pendiente") {
            select.classList.add("pendiente");
        }else{
            select.classList.add("completada")
        }

        select.addEventListener("change", () => {
        const op = select.value;

        select.classList.remove("pendiente", "completada");
            if (op.toLowerCase() === "pendiente" ) {
                select.classList.add("pendiente")
            }else{
                select.classList.add("completada");
            }
            this.guardarLocalStorage();
        
        });
        
        celdaEstado.appendChild(select);
        fila.appendChild(celdaEstado);
        
        this.tabla.appendChild(fila)
        
        celdaTarea.addEventListener("click", ()=>{
            const tareaActual = celdaTarea.textContent; 

            const input = document.createElement("input");
            input.type = "text";
            input.value = tareaActual;
            celdaTarea.textContent = "";
            celdaTarea.appendChild(input);
            input.focus();
            
            input.addEventListener("blur", ()=>{
                const nuevaTarea = input.value.trim() || tareaActual;
                celdaTarea.textContent = nuevaTarea;
                this.guardarLocalStorage();
            })
            
            input.addEventListener("keydown", (e) =>{
                if (e.key === "Enter") {
                    input.blur();
                }
            }) 
        })

        this.agregarIconoEliminar(fila);
    }

    agregarFilaEditable(opcionesEstado){
        const fila = document.createElement("tr");

        const celdaTarea = document.createElement("td");
        const inputTarea = document.createElement("input");

        inputTarea.placeholder = "Añadir nueva tarea";
        celdaTarea.appendChild(inputTarea);
        fila.appendChild(celdaTarea);

        const celdaEstado = document.createElement("td");
        const select = document.createElement("select");

        opcionesEstado.forEach(opcion => {
            const option = document.createElement("option");
            option.value = opcion;
            option.textContent = opcion;
            select.appendChild(option);
        })
        
        celdaEstado.appendChild(select);
        fila.appendChild(celdaEstado);

        this.tabla.appendChild(fila);

        // cuando pierde el foco, si hay texto , crea una nueva fila editable
        inputTarea.addEventListener("blur", ()=>{
            const valor = inputTarea.value.trim();
            if (valor !== "") {
                this.tabla.removeChild(fila);
                this.agregarTarea(valor, opcionesEstado);
                this.agregarFilaEditable(opcionesEstado);
                this.guardarLocalStorage();

            }
        })
    }

    agregarIconoEliminar(fila){
        const icono = document.createElement("img");
        icono.setAttribute("src", "./icono-eliminar.svg");
        icono.setAttribute("alt", "Eliminar Tarea");
        icono.classList.add("btn-eliminar");

        const celdaIcono = document.createElement("td");
        celdaIcono.appendChild(icono) 
        fila.appendChild(celdaIcono);

        icono.addEventListener("click", () =>{
            fila.remove();
            this.guardarLocalStorage();
        })

        icono.addEventListener("keydown", (e) =>{
            if (e.key === "Delete") {
                fila.remove()
                 this.guardarLocalStorage();
            }
        })
    }

    obtenerTareas(){
        const tareas = [];
        const filas = this.tabla.querySelectorAll("tr");

        filas.forEach(fila => {
            const nombre = fila.cells[0]?.textContent;
            const estado = fila.cells[1]?.querySelector("select")?.value;

            if (nombre && estado) {
                tareas.push({nombre, estado})
            }
        });
        return tareas;
    }

    buscarCategoria(){
        const input= document.getElementById("buscarCategoria");
        const buscador = input.value;
        const filas = this.tabla.querySelectorAll("tr");

        filas.forEach(fila => {
            const estado = fila.cells[1]?.querySelector("select")?.value;

            if(estado !== undefined){
                if (buscador === "" ||buscador.toLowerCase() === estado.toLowerCase()) {
                    fila.style.display="table-row"
                }else{
                    fila.style.display = "none";
                }
            }else{
                console.error("No se pudo obtener el estado")
            }
        })
    }



    guardarLocalStorage(){
        const tareas = this.obtenerTareas();
        localStorage.setItem("tareas", JSON.stringify(tareas));
    }
    
    cargarLocalStorage(opcionesEstado){
        const texto = localStorage.getItem("tareas");
        try {
            const datos = JSON.parse(texto);
            if (Array.isArray(datos)) {
                datos.forEach(tarea => {
                    this.agregarTarea(tarea.nombre, opcionesEstado , tarea.estado);

                })
            }else{
                console.warn("Los datoss en el localStorage no son un array:", datos);
            }
            
        } catch (error) {
         console.error("Error al parsear localStorage:", error);   
        }
    }
    
}

const gestor = new GestorTareas("tablaTareas");

gestor.cargarLocalStorage(["Pendiente", "Completada"]);
gestor.agregarFilaEditable(["Pendiente", "Completada"]);



const boton = document.getElementById("buscar");
boton.addEventListener("click",() => gestor.buscarCategoria());






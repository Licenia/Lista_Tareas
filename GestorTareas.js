
class GestorTareas {
    constructor(idTabla) {
        const tabla = document.getElementById(idTabla);
        if (!tabla) {
            console.error("No se encontro el id de la tabla ")
        }
        this.tabla = tabla.querySelector("tbody");
    }

    agregarTarea(nombreTarea, opcionesEstado){
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
            select.appendChild(option);
        });

        celdaEstado.appendChild(select);
        fila.appendChild(celdaEstado);

        this.tabla.appendChild(fila)
    }

    agregarFilaEditable(opcionesEstado){
        const fila = document.createElement("tr");

        const celdaTarea = document.createElement("td");
        const inputTarea = document.createElement("input");
        inputTarea.placeholder = "Escribe una tarea";
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

                this.agregarTarea(valor, opcionesEstado),
                
                this.agregarFilaEditable(opcionesEstado);
            }
        })
    }
}

const gestor = new GestorTareas("tablaTareas");
gestor.agregarFilaEditable(["Completada", "Pendiente"])



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
}

const gestor = new GestorTareas("tablaTareas");
gestor.agregarTarea("Hacer la clase de la tabla" ,["Completada", "Pendiente"]);
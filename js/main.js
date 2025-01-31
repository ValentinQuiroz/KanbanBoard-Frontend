document.addEventListener('DOMContentLoaded', async () => {
    try {
        const columnas = await obtenerColumnas(); // Obtenemos columnas
        const headersRow = document.getElementById('kanban-headers');
        const body = document.getElementById('kanban-body');

        // Crear encabezados de tabla
        columnas.forEach(columna => {
            const th = document.createElement('th');
            th.textContent = columna.nombre + ' (' + columna.tareas.length + ')';
            headersRow.appendChild(th);
        });

        // Determinar el número máximo de tareas
        const maxTareas = Math.max(...columnas.map(c => c.tareas.length));

        // Crear filas para las tareas
        for (let i = 0; i < maxTareas; i++) {
            const row = document.createElement('tr');

            columnas.forEach(columna => {
                const td = document.createElement('td');
                const tarea = columna.tareas[i];

                if (tarea) {
                    const taskDiv = document.createElement('div');
                    taskDiv.classList.add('task');
                    taskDiv.textContent = tarea.titulo;

                    // Hacer la tarea arrastrable
                    taskDiv.setAttribute('draggable', true);
                    taskDiv.setAttribute('data-id', tarea.id);

                    taskDiv.addEventListener('dragstart', (e) => {
                        e.dataTransfer.setData('text/plain', tarea.id);
                    });

                    td.appendChild(taskDiv);
                }
                row.appendChild(td);
            });

            body.appendChild(row);
        }

        // Agregar lógica para arrastrar y soltar en columnas
        const cells = document.querySelectorAll('td');
        cells.forEach(cell => {
            cell.addEventListener('dragover', (e) => e.preventDefault());
            cell.addEventListener('drop', async (e) => {
                e.preventDefault();
                const tareaId = e.dataTransfer.getData('text/plain');
                const nuevaColumnaId = Array.from(cell.parentNode.children).indexOf(cell) + 1;

                // Llamar al backend para actualizar la tarea
                await moverTarea(tareaId, nuevaColumnaId);

                // Recargar la tabla
                location.reload();
            });
        });
    } catch (error) {
        console.error('Error al cargar el tablero Kanban:', error);
    }
});
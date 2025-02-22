document.addEventListener('DOMContentLoaded', async () => {
    try {
        const columnas = await obtenerColumnas();
        setupKanbanHeaders(columnas);
        setupKanbanBody(columnas);
        setupModalHandlers();
        darkMode();
    } catch (error) {
        console.error('Error al cargar el tablero Kanban:', error);
    }
});

function darkMode(){
    let darkmode = localStorage.getItem('darkmode');
    const themeSwitch = document.getElementById('theme-switch');
    
    const enableDarkmode = () => {
      document.body.classList.add('darkmode');
      localStorage.setItem('darkmode', 'active');
    }
    
    const disableDarkmode = () => {
      document.body.classList.remove('darkmode');
      localStorage.setItem('darkmode', '');
    }
    
    if(darkmode === 'active') enableDarkmode();
    
    themeSwitch.addEventListener('click', () => {
      darkmode = localStorage.getItem('darkmode');
      darkmode !== 'active' ? enableDarkmode() : disableDarkmode();
    });

}


function setupKanbanHeaders(columnas) {
    const headersRow = document.getElementById('kanban-headers');
    columnas.forEach(columna => {
        const th = document.createElement('th');
        th.textContent = `${columna.nombre} (${columna.tareas.length})`;
        headersRow.appendChild(th);
    });
}

function setupKanbanBody(columnas) {
    const body = document.getElementById('kanban-body');
    const maxTareas = Math.max(...columnas.map(c => c.tareas.length));

    for (let i = 0; i < maxTareas; i++) {
        const row = document.createElement('tr');
        columnas.forEach(columna => {
            const td = document.createElement('td');
            const tarea = columna.tareas[i];
            if (tarea) td.appendChild(createTaskElement(tarea));
            row.appendChild(td);
        });
        body.appendChild(row);
    }

    setupAddTaskButtons(columnas, body);
    setupDragAndDrop();
}

function createTaskElement(tarea) {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');
    taskDiv.textContent = tarea.titulo;
    taskDiv.dataset.titulo = tarea.titulo;
    taskDiv.dataset.descripcion = tarea.descripcion;
    taskDiv.dataset.id = tarea.id;
    taskDiv.setAttribute('draggable', true);
    taskDiv.addEventListener('click', toggleTaskDetails);
    taskDiv.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('columnaId', tarea.columnaId);
        e.dataTransfer.setData('text/plain', tarea.id);
    });
    return taskDiv;
}

function setupAddTaskButtons(columnas, body) {
    const btnRow = document.createElement('tr');
    columnas.forEach(columna => {
        const td = document.createElement('td');
        const btn = document.createElement('button');
        btn.textContent = 'Agregar tarea';
        btn.addEventListener('click', () => btnAddTask(columna.id));
        td.appendChild(btn);
        btnRow.appendChild(td);
    });
    body.appendChild(btnRow);
}

function setupModalHandlers() {
    document.getElementById('save-task-btn').addEventListener('click', saveTask);
    document.querySelector('.close-btn').addEventListener('click', closeModal);
}

function btnAddTask(columnaId) {
    document.getElementById('task-modal').style.display = 'flex';
    currentColumnId = columnaId;
}

async function saveTask() {
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-desc').value;
    if (title && description) {
        resultado = await crearTarea({ titulo: title, descripcion: description, columnaId: currentColumnId });
        if(resultado === 409){
            alert('Titulo de tarea ya existente');
            return;
        };
        closeModal();
        location.reload();
    }
    else{alert('Por favor, complete todos los campos')}
}

function closeModal() {
    document.getElementById('task-modal').style.display = 'none';
    clearModal();
}

function clearModal() {
    document.getElementById('task-title').value = '';
    document.getElementById('task-desc').value = '';
    currentColumnId = null;
}

function setupDragAndDrop() {
    document.querySelectorAll('td').forEach(cell => {
        cell.addEventListener('dragover', (e) => e.preventDefault());
        cell.addEventListener('drop', async (e) => {
            e.preventDefault();
            const columnaId = e.dataTransfer.getData('columnaId');
            const tareaId = e.dataTransfer.getData('text/plain');
            const nuevaColumnaId = Array.from(cell.parentNode.children).indexOf(cell) + 1;
            if(columnaId != nuevaColumnaId){
                await moverTarea(tareaId, nuevaColumnaId);
                location.reload();
            }
        });
    });
}

function toggleTaskDetails(event) {
    const taskDiv = event.currentTarget;
    const isExpanded = taskDiv.classList.contains('details');

    if (isExpanded) {
        taskDiv.querySelector('p')?.remove();
        taskDiv.querySelector('.btn-delete-task')?.remove();
    } else {
        const descripcion = document.createElement('p');
        descripcion.textContent = taskDiv.dataset.descripcion;
        taskDiv.appendChild(descripcion);

        const btnDelete = document.createElement('button');
        btnDelete.textContent = 'Eliminar';
        btnDelete.classList.add('btn-delete-task');

        btnDelete.addEventListener('click', async (e) => {
            e.stopPropagation();
            const confirm = await modalConfirmation();
            if(confirm){
                await eliminarTarea(taskDiv.dataset.id);
                location.reload();
            }

        });

        taskDiv.appendChild(btnDelete);
    }
    taskDiv.classList.toggle('details');
}


function modalConfirmation() {
    return new Promise((resolve) => {
        const modal = document.getElementById('delete-task-modal');
        modal.style.display = 'flex';

        const btnConfirm = document.getElementById('delete-task-btn');
        const btnCancel = document.getElementById('cancel-task-btn');
        const btnClose = modal.querySelector('.close-btn');

        function cerrarModal(confirmado) {
                modal.style.display = 'none';
                btnConfirm.removeEventListener('click', onConfirm);
                btnCancel.removeEventListener('click', onCancel);
                btnClose.removeEventListener('click', onCancel);
            resolve(confirmado);
        }

        function onConfirm() {
            cerrarModal(true);
        }

        function onCancel() {
            cerrarModal(false);
        }

        btnConfirm.addEventListener('click', onConfirm);
        btnCancel.addEventListener('click', onCancel);
        btnClose.addEventListener('click', onCancel);
    });
}
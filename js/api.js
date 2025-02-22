const connection = 'http://localhost:5033';

const opciones = {
    headers: {          
        'Content-Type': 'application/json',
      },
    withCredentials: true,
};

const moverTarea = async (idTarea, nuevaColumnaId) => {
    try{
        const respuesta = await axios.patch(
            `${connection}/api/Tarea/${idTarea}`,
            nuevaColumnaId,
            opciones
        );

        console.log('Tarea movida:', respuesta.data);
        return respuesta.data;
    }
    catch(error){
        console.error("Error al mover la tarea", error);
        throw error;
    }
}

const obtenerColumnas = async () => {
    try{
    const respuesta = await axios.get(connection+'/api/Columna', opciones);   
    return respuesta.data;
    }
    catch (error){
        console.error('Error al obtener las columnas:', error);
        throw error;
    }
}

const crearTarea = async (tarea) => {
    try{
        const respuesta = await axios.post(
            `${connection}/api/Tarea`,
            tarea,
            opciones
        );
        
        console.log('Tarea creada:', respuesta.data);
        return respuesta.data;
    }
    catch(error){
        console.error("Error al crear la tarea", error);
        return error.response.status;
    }
    
}

const eliminarTarea = async (idTarea) => {
    try{
        const respuesta = await axios.delete(
            `${connection}/api/Tarea/${idTarea}`,
            opciones
        );

        console.log('Tarea eliminada:', respuesta.data);
        return respuesta.data;
    }
    catch(error){
        console.error("Error al eliminar la tarea", error);
        throw error;
    }
}



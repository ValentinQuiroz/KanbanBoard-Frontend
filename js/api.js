const connection = 'http://localhost:5033';
const opciones = {

    headers: {          
        'Content-Type': 'application/json',
      },
    withCredentials: true,
};


const obtenerTareas = async () => {
    try {
        
        const respuesta = await axios.get(connection+'/API/Tarea', opciones);      
        
        
        return respuesta.data;
    } catch (error) {
        console.error('Error al obtener las tareas:', error);
        throw error;
    }
}

const moverTarea = async (idTarea, nuevaColumnaId) => {
    try{
        const respuesta = await axios.patch(
            `${connection}/API/Tarea/${idTarea}`,
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

    const respuesta = await axios.get(connection+'/API/Columna', opciones);   
    return respuesta.data;
    }
    catch (error){
        console.error('Error al obtener las columnas:', error);
        throw error;
    }

}


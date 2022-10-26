let nombre = document.querySelector('#nombre')
const dni = document.querySelector('#dni')
const condicion = document.querySelector('#condicion')
const especialidad = document.querySelector('#especialidad')
const fecha = document.querySelector('#fecha')
let datosPaciente = document.querySelector('#datosPaciente')
let turnosPaciente = document.querySelector('.paciente')
const boton = document.querySelector('#btn')
const recuperar = document.querySelector('#recuperar')
const botonEnviar = document.querySelector('#btnEnviar')
const limpiar = document.querySelector('#limpiar')
let obraSocial = []
let especialistas = []
const turnos = []
const misTurnos = []
const urlEsp = "/bbdd/especialistas.json"
const urlOs = "/bbdd/obraSocial.json"
let numeroTurno = 0
let sede = ""

//----------------------------------- LISTA OBRA SOCIAL ----------------------

const cargaCondicion = async () => {
    fetch(urlOs)
        .then(respuesta => respuesta.json())
        .then(datos => obraSocial = datos)
        .catch(error => Swal.fire({ // ------------------ ALERT 
            title: '¡Error!',
            text: 'No se pudo cargar las obras sociales. Comuníquese al número de atención al cliente',
            icon: 'error',
            confirmButtonText: 'Entendido'
        }))
        .finally(
            () => obraSocial.forEach(elemento => {
            condicion.innerHTML += `<option>${elemento.opcion}</option>`
        }))
}
cargaCondicion()
//---------------------- FIN LSITA OBRA SOCIAL---------------------------------------

// -------------------------Lista especialistas----------------------------------------

const cargaEspecialidad = async () => {
    fetch(urlEsp)
        .then(respuesta => respuesta.json())
        .then(datos => especialistas = datos)
        .catch(error => Swal.fire({ // ------------------ ALERT 
            title: '¡Error!',
            text: 'No se pudo cargar las especialidades. Comuníquese al número de atención al cliente.',
            icon: 'error',
            confirmButtonText: 'Entendido'
        }))
        .finally(
            () => especialistas.forEach(elemento => {
            especialidad.innerHTML += `<option>${elemento.especializacion}</option>`
        }))}
cargaEspecialidad()

// ---------------------------------Fin lista especialistas-------------------------

//-----------------------SACAR TURNO---------------------------------

const sacarTurno = () => {
    numeroTurno++
    
    if (numeroTurno == 4) {
        Swal.fire({ // ------------------ ALERT 
            title: '¡Lo sentimos!',
            text: 'Alcanzó el número máximos de turnos',
            icon: 'error',
            confirmButtonText: 'Entendido'
        })
    } else if (nombre.value === "" || dni.value === "" || condicion.value === "" || especialidad.value === "..." || fecha.value === "") {
        Swal.fire({ // ------------------ ALERT 
            title: '¡Ups!',
            text: 'Debe completar todos los campos',
            icon: 'error',
            confirmButtonText: 'Entendido'
        })
    } else {
        let sede = especialistas.find((el) => el.especializacion === especialidad.value)
    
        datosPaciente.setAttribute('class', 'dPacientes')
        datosPaciente.innerHTML = `<h3>SU TURNO:</h3>
                                <p> Nombre: ${nombre.value}</p>
                                <p> DNI: ${dni.value}</p>
                                <p> Condicion: ${condicion.value}</p>
                                <p> Especialidad: ${especialidad.value}</p>
                                <p> Fecha: ${fecha.value}</p>
                                <p> Médico/a: ${sede.nombre}</p>
                                <p> Sede: ${sede.sede}</p>`
        document.body.appendChild(datosPaciente)
        misTurnos.push({
            numero: numeroTurno,
            nombre: nombre.value,
            dni: dni.value,
            condicion: condicion.value,
            especialidad: especialidad.value,
            fecha: fecha.value,
            medico: sede.nombre,
            sede: sede.sede
        })
    }
    localStorage.setItem('turnos', JSON.stringify(misTurnos))
}
boton.addEventListener('click', (event) => {
    event.preventDefault()
    sacarTurno()
})

//--------------------- FIN SACAR TURNO ----------------------------

//-------------------- RECUPERAR DATOS--------------------------

function recuperarTurno() {

    let turnos = JSON.parse(localStorage.getItem('turnos'))
    for (const turno of turnos) {
        let div = document.createElement('div')
        div.setAttribute('class', 'dPacientes')
        div.innerHTML = `<h3>SU TURNO:</h3>
                                <p> Nombre: ${turno.nombre}</p>
                                <p> DNI: ${turno.dni}</p>
                                <p> Condicion: ${turno.condicion}</p>
                                <p> Especialidad: ${turno.especialidad}</p>
                                <p> Fecha: ${turno.fecha}</p>
                                <p> Médico/a: ${turno.medico}</p>
                                <p> Sede: ${turno.sede}</p>`
        turnosPaciente.append(div)
    }
}
recuperar.addEventListener('click', (e) => { //--------------- RECUPERAR TURNO
    e.preventDefault()
    recuperarTurno()
})

//------------------ FIN RECUPERAR DATOS---------------------------

//---------------- ENVIAR DATOS POR EMAIL---------------------

const enviarPorEmail = () => {
    const suTurno = {
        fecha: new Date().toLocaleString(),
        Nombre: nombre.value,
        DNI: dni.value,
        Especialidad: especialidad.value,
        Medico: sede.nombre,
        sede: sede.sede
    }
    localStorage.setItem("suTurno", JSON.stringify(suTurno))

    Swal.fire({ // ------------------ ALERT 
        title: '¡Enviado!',
        text: 'Los datos de su turno fueron enviados exitosamente',
        icon: 'success',
        confirmButtonText: 'Entendido'
    })
}
botonEnviar.addEventListener("click", (e) => {
    e.preventDefault()
    enviarPorEmail()
})
//--------------------- FIN EVIAR DATOS ----------------------------

limpiar.addEventListener('click', ()=>{ //------------ LIMPIAR DATOS FORM
    datosPaciente.innerHTML = ""
})
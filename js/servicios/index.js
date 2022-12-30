// const URL_API = 'http://localhost:8000'
const main = document.querySelector(".row");
const body = document.querySelector("body");


//Variables Servicio
const crearServicio = document.getElementById("crearServicio")
const nombre_servicio = document.getElementById('name')
const description_servicio = document.getElementById('description')
const logo_servicio = document.getElementById('logo')
let msg = document.getElementById("msg");


crearServicio.addEventListener('submit', (event) => {
    event.preventDefault()
    formValidation()
})

let formValidation = () => {
    if (nombre_servicio.value === "") {
        msg.classList.remove("d-none")
        msg.innerHTML = "Debe ingresar un nombre de servicio"
    }
    if (description_servicio.value === "") {
        msg.classList.remove("d-none")
        msg.innerHTML = "Debe ingresar una descripcion"
    }
    if (nombre_servicio.value === "" && logo_servicio.value === "" && nombre_servicio.value === "") {
        msg.classList.remove("d-none")
        msg.innerHTML = "Por favor rellene todos los campos"

    } else {
        AñadirServicio()
    }
    setTimeout(() => {
        msg.classList.add("d-none")
    }, 2000)

}


async function mostrarServicios() {
    if (localStorage.getItem('access')) {
        const response = await fetch(`${URL_API}/services/`, {
            method: "get",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('access')}`
            }
        })

        if (response.status === 200) {
            const data = await response.json()            
            main.innerHTML = "";

            data.results.forEach((task) => {
                const fechaInicio = new Date(task.created_at).getTime();
                const fechaFin = new Date().getTime();
                const diff = fechaFin - fechaInicio;
                const format_date = Math.round(diff / (1000 * 60 * 60 * 24));
                const { id, name, description, logo } = task;
                main.innerHTML += `
                    <div class="col-4">
                      <div class="card mb-2">
                      <div class="card">
                            <img src="${logo}" class="card-img-top" width="10" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${name}</h5>
                                <p class="card-text">${description}</p>
                                ${localStorage.getItem("is_superuser") ==="true" ? `<button type="button" class="btn btn-primary" onclick="setData(${id})" data-bs-toggle="modal" data-bs-target="#editarModal"
                                data-bs-whatever="@mdo">Editar</button>                                
                                <button onclick="eliminarServicio(${id})" class="btn btn-danger">Eliminar</button> `: `<div></div>`}
                                
                            </div>
                        </div>                        
                      </div>
                    </div>`;


            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Opsiee...',
                text: 'Parece que algo salio mal!'
            })
            window.location.replace('../../index.html')
        }
    } else {
        let timerInterval
        Swal.fire({
            title: 'Usted no tiene acceso a esta vista!',
            html: 'Redireccionando <b>en</b> milliseconds.',
            timer: 1500,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                    b.textContent = Swal.getTimerLeft()
                }, 100)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {                
                window.location.replace('../../index.html')
            }
        })

    }

}

//Añadir Servicio
async function AñadirServicio() {
    const datos = {
        name: nombre_servicio.value,
        description: description_servicio.value,
        logo: logo_servicio.value
    }
    if (localStorage.getItem('access')) {
        try {
            const response = fetch(`${URL_API}/services/`, {
                method: "POST",
                mode: "cors",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('access')}`
                },
                body: JSON.stringify(datos)
            });
            Swal.fire(
                '¡Servicio Creado!',
                'Los datos se guardaron correctamente',
                'success'
            )
            $('#exampleModal').modal('hide')

        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Parece que algo salio mal!'
            })
        }



    } else {
        window.location.replace('../../index.html')
    }

}

//Editar Servicio 
const editarServicioForm = document.getElementById("editarServicio")
const edit_nombre_servicio = document.getElementById('edit_name')
const edit_description_servicio = document.getElementById('edit_description')
const edit_logo_servicio = document.getElementById('edit_logo')
const edit_id_servicio = document.getElementById('id_servicio')

editarServicioForm.addEventListener('submit', (event) => {
    event.preventDefault()
    editarServicio();
})

async function setData(id_servicio) {
    if (localStorage.getItem('access')) {
        try {            
            const response = await fetch(`${URL_API}/services/${id_servicio}/`, {
                method: "get",
                mode: "cors",
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `Token ${localStorage.getItem('access')}`
                }
            })
            const data = await response.json()
            edit_id_servicio.value = data['id']
            edit_nombre_servicio.value = data['name']
            edit_description_servicio.value = data['description']
            edit_logo_servicio.value = data['logo']

        } catch (error) {
            window.location.replace('../../index.html')
        }
    } else {
        window.location.replace('../../index.html')
    }

}
async function editarServicio() {
    if (localStorage.getItem('access')){
        try {
            const data = {
                name: edit_nombre_servicio.value,
                description: edit_description_servicio.value,
                logo: edit_logo_servicio.value
            }
            const response = await fetch(`${URL_API}/services/${edit_id_servicio.value}/`, {
                method: "PUT",
                mode: "cors",
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `Token ${localStorage.getItem('access')}`
                },
                body: JSON.stringify(data)
            })
            Swal.fire(
                '¡Servicio Editado!',
                'Los datos se guardaron correctamente',
                'success'
            ).then((result)=>{
                if (result.isConfirmed){
                    window.location.replace('./index.html')
                }
            })
            //  
            
    
    
    
        } catch (err) {
            window.location.replace('../../index.html')
        }
    }else{
        window.location.replace('../../index.html')
    }
}
//Mostrar Boton
const btnCrear = document.getElementById('btnañadirServicio')
function showOption(){            
    if(localStorage.getItem('is_superuser')==='true'){        
        //pass        
    }else{        
        btnCrear.style.display = 'none'
    }
}
showOption();

//Eliminar Servicio
async function eliminarServicio(id_servicio) {
    Swal.fire({
        title: "¿Deseas Eliminar el servicio?",
        text: "¡No podrás revertir esta acción!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`${URL_API}/services/${id_servicio}/`, {
                    method: "delete",
                    mode: "cors",
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization": `Token ${localStorage.getItem('access')}`
                    }
                })
                Swal.fire(
                    'Eliminado!',
                    'El Servicio ha sido eliminado correctamente.',
                    'success'
                ).then((result)=>{
                    if(result.isConfirmed){
                        window.location.replace("./index.html")
                    }
                })
                
            } catch (err) {
                Swal.fire(
                    'Algo ha ocurrido en el servidor',
                    'Intentelo mas tarde.',
                    'error'
                )
            }

        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
                'Cancelled',
                'Your imaginary file is safe :)',
                'error'
            )
        }
    })
}

mostrarServicios();
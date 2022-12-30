const crearServicio = document.getElementById('crearServicio')
const message = document.getElementById('msg')
//Variables del formulario
const selectService = document.getElementById('selectService')
const monto = document.getElementById('monto')
const fechaPago = document.getElementById('fechaPago')
const fechaVencimiento = document.getElementById('fechaVencimiento')

const pagosList = document.getElementById('pagoslist')

crearServicio.addEventListener('change',(event)=>{
    event.preventDefault()    
})

function formatearFecha(date){    
    let fecha = ''
    let dateformat = new Date(date)    
    fecha +=`${dateformat.getDate()+1}-${dateformat.getMonth()+1}-${dateformat.getFullYear()}`
    return fecha
}

crearServicio.addEventListener('submit',(event)=>{
    event.preventDefault();      
    formValidationPayment();  
   
})

//Validar Formulario de Pago
function formValidationPayment(){
    
    if (selectService.value === undefined ) {
        msg.classList.remove("d-none")
        msg.innerHTML = "Debe Seleccionar un servicio"
    }
    if (monto.value === "") {
        msg.classList.remove("d-none")
        msg.innerHTML = "Debe ingresar una descripcion"
    }
    if (fechaPago.value === "") {        
        msg.classList.remove("d-none")
        msg.innerHTML = "Debe ingresar una descripcion"
    }
    if (fechaVencimiento.value === "") {        
        msg.classList.remove("d-none")
        msg.innerHTML = "Por favor rellene todos los campos"

    }
    if(selectService.value === undefined && monto.value==="" && fechaPago.value === "" && fechaVencimiento === ""){
        msg.classList.remove("d-none")
        msg.innerHTML = "Por favor rellene todos los campos"
    } else {        
        crearPago()
    }
    setTimeout(() => {
        msg.classList.add("d-none")
    }, 2000)

}
//CREAR PAGO
async function crearPago(){
    const data_payment = {
        service: selectService.value,
        amount: monto.value,
        payment_date: fechaPago.value,
        expiration_date:fechaVencimiento.value
    }    
    if (localStorage.getItem('access')){
        try{
            const response = await fetch('http://127.0.0.1:8000/payment_user/',{
                method:"POST",
                mode:"cors",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": `Token ${localStorage.getItem('access')}`
                },
                body:JSON.stringify(data_payment)
            })
            const data = await response.json()            
            Swal.fire(
                '¡Pago Creado!',
                'Los datos se guardaron correctamente',
                'success'
            ).then((result)=>{
                if(result.isConfirmed){
                    window.location.replace('./index.html')
                }
            })
            
            

        }catch(error){            
            window.location.replace('../../index.html')
        }
    }else{
        window.location.replace('../../index.html')
    }
}


async function setServiceData(){
    if (localStorage.getItem('access')){
        try{
            const response = await fetch(`http://127.0.0.1:8000/services`,{
                method:"get",
                mode:"cors",
                headers:{
                    "Content-Type":'applicacion/json',
                    "Authorization": `Token ${localStorage.getItem('access')}`
                }
            })            
            const data = await response.json()              
            data.results.forEach(element => {
                let opcion = document.createElement('option')
                opcion.value = element['id']
                opcion.appendChild(document.createTextNode(element['name']))
                selectService.appendChild(opcion)
            });

        }catch(err){
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')
            localStorage.removeItem('email')
            window.location.replace("../../index.html")
        }
    }else{        
        window.location.replace("../../index.html")
    }
    
}
setServiceData();



//Obtener Pagos ADMIN
async function obtenerPagos(){
    if(localStorage.getItem('access')){
        try{
            
            const response = await fetch(`http://127.0.0.1:8000/payment_user/pagos/`,{
                method:"GET",
                mode:"cors",
                headers:{
                    "Content-Type":'application/json',
                    "Authorization":`Token ${localStorage.getItem('access')}`
                }
            })            
            const data = await response.json()            
            pagosList.innerHTML +=  ""            
            data.forEach(elements=>{        
                let estado = "danger"
                let mensage = 'vencido'
                if (elements['deuda_vigente']){
                    estado="success"
                    mensage = 'vigente'
                }
                pagosList.innerHTML += `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${elements['logo']}" alt=""
                                style="width: 45px; height: 45px" class="rounded-circle" />
                            <div class="ms-3">
                                <p class="fw-bold mb-1">${elements['user']}</p>
                                <p class="text-muted mb-0">${elements['service']}</p>
                            </div>
                        </div>
                    </td>
                    <td>
                        <p class="fw-normal mb-1">${elements['payment_date']}</p>
                        <p class="text-muted mb-0">${elements['service']}</p>
                    </td>
                    <td>
                        <p class="fw-normal mb-1">${elements['expiration_date']}</p>                        
                    </td>
                    <td>                        
                        <span class="badge badge-${estado} rounded-pill d-inline">${mensage}</span>
                    </td>
                    <td>S/ ${elements['amount']}</td>
                    ${localStorage.getItem("is_superuser") ==="true" ? `<td>
                    <button type="button" class="btn btn-primary"
                    onclick="setData(${elements['id']})" data-bs-toggle="modal" data-bs-target="#editarModal"
                    data-bs-whatever="@mdo">Editar</button>
                    <button type="button" onclick="eliminarPago(${elements['id']})" class="btn btn-link btn-sm btn-rounded">
                        Eliminar
                    </button>
                </td>`: `<td></td>`}                    
                </tr>`
            })
            

        }catch(err){
            console.log('Algo Ocurrio en el servidor')
        }
    }else{        
        // cleanLocalStorage()
        window.location.replace("../../index.html")
    }
}

//Editar Pago
const editarPagoForm = document.getElementById("editarPago")
const edit_nombre_servicio = document.getElementById('edit_name')
const edit_description_servicio = document.getElementById('edit_description')
const edit_logo_servicio = document.getElementById('edit_logo')
const edit_id_servicio = document.getElementById('id_servicio')

editarPagoForm.addEventListener('submit', (event) => {
    event.preventDefault()
    editarServicio();
})

async function setData(id_pago) {
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

//Eliminar Pago
async function eliminarPago(id_pago) {
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
                const response = await fetch(`${URL_API}/payment_user/${id_pago}/`, {
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

obtenerPagos();
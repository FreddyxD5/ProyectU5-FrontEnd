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
    console.log("cambio?")    
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

async function crearPago(){
    const data_payment = {
        service: selectService.value,
        amount: monto.value,
        payment_date: fechaPago.value,
        expiration_date:fechaVencimiento.value
    }
    console.log(data_payment)
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
            console.log(data)
            Swal.fire(
                '¡Pago Creado!',
                'Los datos se guardaron correctamente',
                'success'
            )
            $('#newPaymentService').modal('hide')

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
                    <td>
                        <button type="button" class="btn btn-link btn-sm btn-rounded">
                            Editar
                        </button>
                        <button type="button" class="btn btn-link btn-sm btn-rounded">
                            Eliminar
                        </button>
                    </td>
                </tr>`
            })
            

        }catch(err){
            console.log('Algo Ocurrio en el servidor')
        }
    }else{
        console.log('a?')
        // cleanLocalStorage()
        // window.location.replace("../../index.html")
    }
}


obtenerPagos();
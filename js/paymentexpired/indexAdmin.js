const pagosList = document.getElementById('pagoslist')


//Obtener Pagos ADMIN
async function obtenerRecibosVencidos(){
    if(localStorage.getItem('access')){
        try{
            
            const response = await fetch(`http://127.0.0.1:8000/expired_payment/recibos_vencidos/`,{
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
                <tr id=${elements['id']}>
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
                        <p class="fw-normal mb-1">${elements['expiration_date']}</p>
                        <p class="text-muted mb-0">${elements['service']}</p>
                    </td>
                    <td>                        
                        <span class="badge badge-${estado} rounded-pill d-inline">${mensage}</span>
                    </td>
                    <td>
                        <p class="fw-normal mb-1">S/ ${elements['monto']}</p>                        
                    </td>
                    
                    <td>S/ ${elements['penalty_free_amount']}</td>
                    <td>                       
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
        
        cleanLocalStorage()
        window.location.replace("../../index.html")
    }
}


obtenerRecibosVencidos();
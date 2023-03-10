const URL_API = 'http://127.0.0.1:8000'
const loginForm = document.getElementById('loginForm')
const email = document.getElementById('email')
const password = document.getElementById('password')

let msg = document.getElementById("msg");


function cleanLocalStorage(){
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('email')
    localStorage.removeItem('is_superuser')
}

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();    
    loginFormValidation();    
})

let loginFormValidation = () => {
    if (email.value === "" && password.value === "") {
        msg.classList.remove("d-none")
        msg.innerHTML = "Debe ingresar su email y su contraseña."
    }
    else if (email.value === "") {
        msg.classList.remove("d-none")
        msg.innerHTML = "Debe ingresar su email para iniciar sesion."
    }
    else if (password.value === "") {
        msg.innerHTML = "La contraseña no debe estar vacia"
        msg.classList.remove("d-none")
    } else {        
        msg.classList.add("d-none")
        login()
    }
}


async function login() {
    const data = {
        email: email.value,
        password: password.value
    }
    try{
        const response = await fetch(`${URL_API}/login/`, {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const datos = await response.json()
        loginSucess  = Object.keys(datos).length
        if (loginSucess>1) {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })
              
              Toast.fire({
                icon: 'success',
                title: 'Bienvenido de nuevo!',
                text: `${datos['email']}`
              })          
              localStorage.setItem('access', `${datos['tokens']['access']}`)
              localStorage.setItem('refresh', `${datos['tokens']['refresh']}`)        
              localStorage.setItem('email', `${datos['email']}`) 
              localStorage.setItem('is_superuser', `${datos['is_superuser']}`) 
              if (datos['is_superuser']){
                setTimeout(()=>{                        
                    window.location.replace("./pages/adashboard.html");
                  },1500)        
              }else{
                setTimeout(()=>{
                    window.location.replace("./pages/udashboard.html");
                },1500)                  
              }
                      
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Parece que algo salio mal!'            
              })
        }
    }catch(err){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Parece que hay un error en el servidor!'            
          })
    }
    
}



async function checkAuthenticated(){    
    if (localStorage.getItem('access')){
        const response = await fetch(`${URL_API}/users/get_user_data_from_access/`,{
        method: "POST",
        mode: "cors",
        headers:{
            'Content-Type':'application/json',
        },
        body: JSON.stringify({
            'access':localStorage.getItem('access')
            })
        })                
        if (response.status === 200){            
            const data = await response.json()                                    
            if (data['is_superuser']){                
                window.location.replace("./pages/adashboard.html");
            }else{
                window.location.replace("./pages/udashboard.html");
            }            
        }else{
            cleanLocalStorage();
            window.location.replace("../index.html");
        }  
    }else{
        return false
    }
}
checkAuthenticated();
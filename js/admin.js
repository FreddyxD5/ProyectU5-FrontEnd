const logoutButton = document.getElementById('logout')
const username =  document.getElementById('email')


logoutButton.addEventListener('click',(event)=>{
    event.preventDefault()    
    logout();
})  

function setUsername(){    
    if(localStorage.getItem('email')){        
        username.innerHTML = localStorage.getItem('email')
    }else{
        username.innerHTML = 'Desconocido'
    }        
}

setUsername()


const URL_API = 'http://127.0.0.1:8000'
async function logout(){    
    if(localStorage.getItem('access')){
        const response = await fetch(`${URL_API}/logout/`,{
            method: "POST",
            mode: "cors",
            headers:{
                'Content-Type':'application.json',
                'Authorization':localStorage.getItem('access')
            },
            body: JSON.stringify({
                'refresh':localStorage.getItem('refresh')
                })
            })
        
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        localStorage.removeItem('email')        
        window.location.replace('../index.html')                
    }
}





'use strict'
const url ="https://api.thedogapi.com/v1/images/search?limit=8&has_breeds=true"
const api_key = 'live_0X0QybIO969x4QOElvfJAaw9FzLYzUM9f14BcVaKX0vk9l2hSYm5CcuT21IyQI7t'
var dogs = []; // Guarda todas las razas de perros
var dogs_limit = []; // Guarda los perros que se muestran en la galería

fetch(url,{headers: {'x-api-key': api_key}})
    .then(response => response.json())
    .then(data =>{
        console.log(data);
        showDog(data);
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('gallery').classList.remove('d-none');
        dogs_limit = data;
        return getBreads();

    })
    .then(response => response.json())
    .then(data => {
        dogs = data;
        // console.log(dogs);
    })
    .catch(error => console.error(error))


//Esta funcion sirve para mostrar los perros en la galeria
function showDog(data){
    var div = document.getElementById('dog-gallery');
    div.innerHTML = '';
    data.forEach((dog,index)=>{
        var card = document.createElement('div');
        card.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-4';
        card.innerHTML = `<div class="card h-100">
                            <img src="${dog.url}" class="card-img-top" alt="..." width="100" height="200">
                            <div class="card-body">
                                <h4 class="title_card">${dog.breeds[0].name}</h4>
                                <p class="card-text"><b>Bred for:</b> ${dog.breeds[0].bred_for}<br>
                                <b>Temperament:</b> ${dog.breeds[0].temperament}</p>
                                <div class="dog-tags">
                                    <span class="badge bg-primary">life span: ${dog.breeds[0].life_span}</span>
                                </div>
                            </div>
                        </div>`;
        div.appendChild(card);
  
    })

}

//Esta funcion sirve para buscar una raza de perro en especifico
async function searchDog() {
    var spinner = document.getElementById('spinner');
    var div = document.getElementById('dog-gallery');
    div.style.visibility = 'hidden';
    spinner.style.display = 'block';
    var breadSearch = document.getElementById('search-bar').value.toLowerCase().trim(); // Obtén el valor del input
    var filteredDogs = dogs.filter(dog => dog.name.toLowerCase().includes(breadSearch)); // Filtra las razas

    if(filteredDogs.length === 0){
        alert('No se encontraron resultados');
        spinner.style.display = 'none';
        div.style.visibility = 'visible';
    }else{
        var id_referencia = filteredDogs[0].reference_image_id;
        try{
            var breadResponse = await getBread(id_referencia);
            var bread = await breadResponse.json();
            showDog([bread]);
            
        }catch(error){
            console.error('Error fetching bread: ',error);
        }finally{
            spinner.style.display = 'none';
            div.style.visibility = 'visible';
        }
    }
    

}

document.getElementById('search-button').addEventListener('click', searchDog);




    var breadSearch = document.getElementById('search-bar')
    breadSearch.addEventListener('input',function(){
        var input = breadSearch.value.toLowerCase().trim();
        if(input === ''){
            showDog(dogs_limit);
        }

    });



//Esta funcion sirve para traer todos los perros que tengan una raza
function getBreads(){
    return fetch('https://api.thedogapi.com/v1/breeds');
}

//Esta funcion sirve para treer informacion y la imagen de un perro en especifico
function getBread(id_referencia){
    return fetch('https://api.thedogapi.com/v1/images/'+id_referencia);

}

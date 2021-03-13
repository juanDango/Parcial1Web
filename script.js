url = "data.json";

let createModalButton = "<button type='button' class='btn btn-danger' data-bs-toggle='modal' data-bs-target='#staticBackdrop'>\
Cancelar\
</button>"

let addToCart;

let addMore;

let foodInCart = []

let actCateg = "Burguers"

let amountOfFood = 0;

let confirm;

let cancel;

let total = 0;

const myFunction = element => {
    getElementsOfType(element.srcElement.innerHTML)
}

const verCarrito = element => {
    total = 0;
    string = "<div class = 'row'>\
    <table class='table table-striped'>\
    <thead>\
    <tr>\
    <th>Item</th>\
    <th>Description</th>\
    <th>Unit Price</th>\
    <th>Ammount</th>\
    <th>Modify</th>\
    </tr>\
    </thead>\
    <tbody>"
    for(let i = 0; i < foodInCart.length; i++){
        let product = foodInCart[i];
        total += product.unitPrice*product.ammount;
        let item = i+1
        string += "<tr id = 'row"+i+"'>\
        <th scope='row'>"+ item +"</th>\
        <td>"+product.description+"</td>\
        <td>"+product.unitPrice+"</td>\
        <td id = 'amo"+i+"'>"+product.ammount+"</td>\
        <td><a href=\"#\" id = 'add"+i+"' class=\"mod add btn\">+</a><a href=\"#\" id = 'sub"+i+"' class=\"mod add btn\">-</a></td>\
      </tr>"
    }

    string += "<tr>\
    <td id = 'total'>Total: $"+total+"<\/d>\
    <td></td>\
    <td></td>\
    <td></td>\
    <td><a href=\"#\" id = 'Confirm' class=\"btn btn-success\">Confirm</a>" + createModalButton + "\
    </tbody>\
    </table>\
    </div>"
    cuerpo.innerHTML = string
    categ.innerHTML = "Order Detail"
    addMore = document.getElementsByClassName("add")
    confirm = document.getElementById("Confirm");
    cancel = document.getElementById("Cancel");
    confirm.onclick = confirmar
    let l = addMore.length
    for(let i = 0; i<l; i++){
        addMore.item(i).onclick = addToProduct
    }
    let yes = document.getElementById("Yes")
    yes.onclick = ()=>{
        foodInCart=[]
        verCarrito()
        amountOfFood = 0;
        numItems.innerHTML = amountOfFood + " items"
    }
}

const cancelar = element =>{

}

const confirmar = element => {
    console.log(foodInCart)
}

const addFood = element =>{
    getMenu(actCateg, (type, data) => {
        list = data.find(element => element.name === type)
        products = list.products;
        product = products.find(product => product.name.replace(/\s/g, '')===element.srcElement.id)
        item = foodInCart.find(product => product.description.replace(/\s/g, '')===element.srcElement.id)
        if(item){
            item.ammount ++;
        }else{
            item = {
                description: product.name,
                unitPrice: product.price,
                ammount: 1
            }
            foodInCart.push(item)
        }
    })
    amountOfFood ++;
    numItems.innerHTML = amountOfFood + " items"
}

const addToProduct = event =>{
    let id = event.srcElement.id
    let operation = id.substring(0,3);
    let i = parseInt(id.charAt(3));
    let ammToChange = document.getElementById("amo"+i);
    let tot = document.getElementById("total");
    let product = foodInCart[i]
    if(product){
        if(operation === "add"){
            foodInCart[i].ammount ++;
            ammToChange.innerHTML = foodInCart[i].ammount
            total += product.unitPrice 
            tot.innerHTML = total
            amountOfFood ++;
        }
        else if(operation ==="sub"){
            if(foodInCart[i].ammount===1){
                foodInCart.splice(i, 1)
                verCarrito("HolaMundo")
            }else{
                foodInCart[i].ammount --;
                ammToChange.innerHTML = foodInCart[i].ammount 
            }
            total -= product.unitPrice 
            tot.innerHTML = total
            amountOfFood --;
        }
    }
    numItems.innerHTML = amountOfFood + " items"
}

const getMenu = (type, callback) => {
    fetch(url).then(response =>response.json()).then(data=>{
        callback(type, data);
    })
}

const getElementsOfType = (type) => {
    getMenu(type, (type, data) => {
        element = data.find(element => element.name === type)
        products = element.products;
        string = "<div class = 'row'>"
        for(let i = 0; i < products.length; i++){
            product = products[i];
            string += "<div class=\"card tarjeta\" style=\"width: 18rem;\">\
            <img class =\"food\" src=\"" + product.image + "\" class=\"card-img-top\" alt=\" "+ product.name + "\">\
            <div class=\"card-body\">\
            <h5 class=\"card-title\">" + product.name +"</h5>\
            <p class=\"card-text\">"+ product.description + "</p>\
            <strong>$" + product.price + "</strong>\
            <br>\
            <a href=\"#\" id = '" + product.name.replace(/\s/g, '') + "' class=\"AddToCart btn \">Add To Cart</a>\
            </div>\
            </div>"
        }
        string += "</div>"
        cuerpo.innerHTML = string
        categ.innerHTML = type
        actCateg = type
        addToCart = document.getElementsByClassName("AddToCart")

        let l = addToCart.length
        for(let i = 0; i<l; i++){
            addToCart.item(i).onclick = addFood
        }
    })
}

const cuerpo = document.getElementById("cuerpo");

const name = document.getElementById("categ");

getElementsOfType(actCateg)

const burger = document.getElementById("Burger");
const tacos = document.getElementById("Tacos");
const salads = document.getElementById("Salads");
const desserts = document.getElementById("Desserts");
const drinks = document.getElementById("Drinks");

const numItems = document.getElementById("numItems");

const cart = document.getElementById("carroDeCompras")


burger.onclick = myFunction
tacos.onclick = myFunction
salads.onclick = myFunction
desserts.onclick = myFunction
drinks.onclick = myFunction
cart.onclick = verCarrito

var modal = null
 function pop() {
   if(modal === null) {
     document.getElementById("box").style.display = "block";
     modal = true
   } else {
     document.getElementById("box").style.display = "none";
     modal = null
   }
 }
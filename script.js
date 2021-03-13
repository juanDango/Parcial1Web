// Dirección donde está la información
url = "data.json";

// HTML que crea el modal button
let createModalButton = "<button type='button' class='btn btn-danger' data-bs-toggle='modal' data-bs-target='#staticBackdrop'>\
Cancelar\
</button>";

// Lista de elementos con los botones de add to cart
let addToCart;

// Lista con los botones para añadir más o menos a un production
let addMore;

// Lista de comida pedida por la persona
let foodInCart = [];

// Categoría actual en que se encuentra el cliente
let actCateg = "";

// Cantidad de comida que ha pedido
let amountOfFood = 0;

// Boton de confirmar
let confirm;

// Total a pagar por la persona
let total = 0;

// Función a asignar a los links para cambiar de categoría
const myFunction = element => {
  getElementsOfType(element.srcElement.innerHTML);
};

// Función que despliega el carrito
const verCarrito = () => {
  // Asignamos el total a 0
  total = 0;
  //Creamos un código HTML para iniciar una tabla
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
    <tbody>";
  //Por cada producto, creamos la fila respectiva, añadimos los botones con ID addi para añadir
  // subi para eliminar un producto
  for(let i = 0; i < foodInCart.length; i++) {
    let product = foodInCart[i];
    total += product.unitPrice*product.ammount;
    let item = i+1;
    string += "<tr id = 'row"+item+"'>\
        <th scope='row'>"+ item +"</th>\
        <td>"+product.description+"</td>\
        <td>"+product.unitPrice+"</td>\
        <td id = 'amo"+i+"'>"+product.ammount+"</td>\
        <td><a href=\"#\" id = 'add"+i+"' class=\"mod add btn\">+</a><a href=\"#\" id = 'sub"+i+"' class=\"mod add btn\">-</a></td>\
      </tr>";
  }
  // Añadimos el código para terminar la tabla, y creamos los botones de confirmar y cancelar
  string += "<tr>\
    <td id = 'total'>Total: $"+total+"</d>\
    <td></td>\
    <td></td>\
    <td></td>\
    <td><a href=\"#\" id = 'Confirm' class=\"btn btn-success\">Confirm</a>" + createModalButton + "\
    </tbody>\
    </table>\
    </div>";
  // Modifica el dom para tener el pedido y el título deseado
  cuerpo.innerHTML = string;
  categ.innerHTML = "Order Detail";
  // Obtenemos los botones para añadir y quitar productos a la lista
  addMore = document.getElementsByClassName("add");
  // Obtenemos el boton para confirmar a un pedido
  confirm = document.getElementById("Confirm");
  // Obtenemos el boton para cancelar el pedido
  // En caso de confirmar, llamamos el método para imprimir la comida en el carrito
  confirm.onclick = () => {
    console.log(foodInCart);
  };
  // Para cada boton de añadir o sustraer asignamos el método addToProduct
  let l = addMore.length;
  for(let i = 0; i<l; i++) {
    addMore.item(i).onclick = addToProduct;
  }
  // Asignamos la función al boton para confirmar la eliminación de un pedido
  let yes = document.getElementById("Yes");
  yes.onclick = ()=>{
    foodInCart=[];
    verCarrito();
    amountOfFood = 0;
    numItems.innerHTML = amountOfFood + " items";
  };
};

// Método para añadir comida al carrito
const addFood = element =>{
  // Obtenemos el menu
  getMenu(actCateg, (type, data) => {
    // Obtenemos la categoría deseada
    let list = data.find(element => element.name === type);
    // Obtenemos el producto de la categoría
    let products = list.products;
    // Obtenemos el producto a añadir
    let product = products.find(product => product.name.replace(/\s/g, "")===element.srcElement.id);
    // Revisamos si el producto se encuentra ya en el carrito
    let item = foodInCart.find(product => product.description.replace(/\s/g, "")===element.srcElement.id);
    // Si ya está, aumentamos en 1 la cantidad, de lo contrario, creamos un item y lo añadimos con cantidad 1
    if(item) {
      item.ammount ++;
    }else{
      item = {
        description: product.name,
        unitPrice: product.price,
        ammount: 1
      };
      foodInCart.push(item);
    }
  });
  // Se aumenta la cantidad de comida
  amountOfFood ++;
  // Actualizamos el dom con el número de ITEMS
  numItems.innerHTML = amountOfFood + " items";
};

// Método para añadir o quitar una cantida de 1 a un producto que está en el carro
const addToProduct = event =>{
  // Obtenemos el id del evento que invocó este método. En este caso, son los botones con
  // ID add/sub i
  let id = event.srcElement.id;
  // Obtenemos la operación, que es las primeras 3 letras del id
  let operation = id.substring(0,3);
  // Obtenemos el índice del elemento a eliminar, la última letra del id del evento
  let i = parseInt(id.charAt(3));
  // Obtenemos el elemento del DOM que tiene la cantidad de productos del tipo que hay por el ID amoi
  let ammToChange = document.getElementById("amo"+i);
  // Obtenemos el elemento del DOM donde se muestra el total a pagar
  let tot = document.getElementById("total");
  // Obtenemos el producto a eliminar
  let product = foodInCart[i];
  // Si el producto está
  if(product) {
    // Si la operación es añadir, añadimos al carro, aumentamos la cantidad de comida de i
    // Y se actualiza el DOM
    if(operation === "add") {
      foodInCart[i].ammount ++;
      ammToChange.innerHTML = foodInCart[i].ammount;
      total += product.unitPrice;
      tot.innerHTML = "Total: $"+total;
      amountOfFood ++;
    }
    // Si la operación es eliminar
    else if(operation ==="sub") {
      // Si ya es el último elemento, lo eliminamos de la lista y actualizamos la tabla
      if(foodInCart[i].ammount===1) {
        foodInCart.splice(i, 1);
        verCarrito("HolaMundo");
      }
      // Si no es el último, solo quitamos
      else{
        foodInCart[i].ammount --;
        ammToChange.innerHTML = foodInCart[i].ammount;
      }
      // Actualizamos el precio, y la cantidad de comida
      total -= product.unitPrice;
      tot.innerHTML = "Total: $"+total;
      amountOfFood --;
    }
  }
  // Actualizamos el número de items
  numItems.innerHTML = amountOfFood + " items";
};

// Método que obtiene el menú del link donde está la información
const getMenu = (type, callback) => {
  fetch(url).then(response =>response.json()).then(data=>{
    callback(type, data);
  });
};

// Método que obtiene del menú, los elementos de la categoría deseada
const getElementsOfType = (type) => {
  // Obtenemos el menu
  getMenu(type, (type, data) => {
    // Obtenemos la categoría deseada
    element = data.find(element => element.name === type);
    // Obtenemos los productos de esa categoría
    products = element.products;
    // Creamos un row de bootstrap
    string = "<div class = 'row'>";
    // Por cada producto, creamos una tarjeta de bootstrap con la foto, nombre, descripción, precio y un
    // boton para añadir al carrito
    for(let i = 0; i < products.length; i++) {
      product = products[i];
      string += "<div class=\"card tarjeta\" style=\"width: 18rem;\">\
            <img class =\"food\" src=\"" + product.image + "\" class=\"card-img-top\" alt=\" "+ product.name + "\">\
            <div class=\"card-body\">\
            <h5 class=\"card-title\">" + product.name +"</h5>\
            <p class=\"card-text\">"+ product.description + "</p>\
            <strong>$" + product.price + "</strong>\
            <br>\
            <a href=\"#\" id = '" + product.name.replace(/\s/g, "") + "' class=\"AddToCart btn \">Add To Cart</a>\
            </div>\
            </div>";
    }
    // Cerramos el dic
    string += "</div>";
    // Actualizamos el DOM con la info
    cuerpo.innerHTML = string;
    categ.innerHTML = type;
    // Actualizamos la categoría de comidas en que estamos
    actCateg = type;
    // Añadimos los botones de añadir al carrito
    addToCart = document.getElementsByClassName("AddToCart");

    // Para cada boton addToCart añadimos la funcionalidad de añadir comida
    let l = addToCart.length;
    for(let i = 0; i<l; i++) {
      addToCart.item(i).onclick = addFood;
    }
  });
};

// Obtenemos el cuerpo de la página web
const cuerpo = document.getElementById("cuerpo");

// Método para inicializar la página con los nombres de la categoría
const inicializarPagina = () => {
  // Obtenemos el archivo JSON
  fetch(url).then(response =>response.json()).then(data=>{
    // Creamos un arreglo para guardar las categorías existentes
    let categories = [];
    // Creamos un string donde se almacena la INFO del dom
    let string = "";
    // Por cada categoría, la añadimos al STRING como un div que ocupa dos columnas de bootstrap
    for(let i = 0; i < data.length; i++) {
      let category = data[i];
      // añadimos la gategoría a la lista
      categories.push(category.name);
      string += "<div class = 'col-2'>\
            <a id = '"+category.name+"' class = 'category'>"+category.name+"</a>\
            </div>";
    }
    // Actualizamos el DOM con la info de las categorías
    let nav = document.getElementById("categories");
    nav.innerHTML = string;
    actCateg = categories[0];
    // Para cada categoría, obtenemos el elemento respectivo y le asignamos para que cumpla con la Función
    // myFunction
    for(let i = 0; i < categories.length; i++) {
      let category = categories[i];
      element = document.getElementById(category);
      element.onclick = myFunction;
    }
    // Obtenemos los elementos de la primera categoría
    getElementsOfType(actCateg);
  });
};

// Inicializamos la página
inicializarPagina();

// Obtenemos el elemento del carrito de compras y le añadimos el evento para ver el carrito
document.getElementById("carroDeCompras").onclick = verCarrito;
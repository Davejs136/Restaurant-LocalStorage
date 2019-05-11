// Variables
const inputOrder = document.querySelector('#pedido'),
      buttonSend  = document.querySelector('#send'),
      form = document.querySelector('form'),
      listaPedido = document.querySelector('ul');


class LocalStorage {

  getItemsLocalStorage() {

    let orders;
    
    if (localStorage.getItem('orders') == undefined) {
      // console.log(`deberia devolver un arreglo vacio`);
      orders = [];
    } else {
      // console.log(`deberia devolver un arreglo lleno`);      
      orders = JSON.parse( localStorage.getItem('orders') );
    }

    return orders;
  }

  addLocalStorage( order ) {
    let orders = this.getItemsLocalStorage();

    // agrego al arreglo
    orders.push( order );

// convierto en string y lo agrego al localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
  }

  removerOrderLocalStorage( order ) {
    let orders = this.getItemsLocalStorage(),

     lettersOrders = order.textContent.slice(0, -1);

    orders.forEach( orderItem => {

      console.log(orderItem);
      
  
      if ( orderItem === lettersOrders ) {
        let index = orders.indexOf(lettersOrders);

        orders.splice(index, 1)
        
        localStorage.setItem('orders', JSON.stringify(orders));
      }
    })
  }

  leerDatosStorage() {
    let orders = this.getItemsLocalStorage();

    if( orders.length ) {
      orders.forEach( order => {
      listaPedido.innerHTML += `<li>${order}<span class="delete">x</span></li>`
      });

      return true;
    } else {
      return false;
    }
  }
}


const storage = new LocalStorage();

// Funciones
// inicializa el boton en disabled
function _init() {
  buttonSend.disabled = true;

  if( storage.leerDatosStorage() ) {
    deleteTitle();
    storage.leerDatosStorage();
  } 
}

// Valida si los campos estan vacios
function checkInput() {

  if ( !inputOrder.value ) {
    // console.log(`El campo esta vacio`);
    inputOrder.classList.remove('success');
    inputOrder.classList.add('error');
  } else {
    // console.log(`YA no esta vacio!`);
    buttonSend.disabled = false;
    inputOrder.classList.remove('error');
    inputOrder.classList.add('success');
  }
}

// Inserta en una lista los pedidos del usuario
function insertOrder(e) {
  e.preventDefault();

  const
        // creo el elemento li
        li = document.createElement('li'),
        span = document.createElement('span');

  if ( !inputOrder.value ) {
    return false;
  }

  span.innerHTML = 'x';
  span.className = 'delete';
  span.style.backgroundColor = 'red';
  
  li.innerHTML = `${inputOrder.value}`;
  li.appendChild(span);

  // limpiamos el DOM
  deleteTitle();

  // Añado el pedido en el ul
  listaPedido.appendChild(li);
  // añado al localStorage
  storage.addLocalStorage(inputOrder.value);
  // Vacio el input
  inputOrder.value = '';

  // remuevo la clase de success
  inputOrder.classList.remove('success');

}


// Elimina los elementos clickeados por el usuario
function removeOrder( e ) {
  let element;

  element = e.target;

  if (element.className === 'delete') {
    element.parentElement.remove();
    
    storage.removerOrderLocalStorage(element.parentElement)

    if( !listaPedido.children.length ) {
      listaPedido.innerHTML = `<h3 class="title">Empty</h3>`
    }
  }
}

// Borrar el titulo
function deleteTitle() {
  if( listaPedido.children[0].tagName === 'H3') {
    listaPedido.innerHTML = '';
  }
}

// Listeners
document.addEventListener('DOMContentLoaded', _init);
inputOrder.addEventListener('blur', checkInput);
form.addEventListener('submit', insertOrder);
listaPedido.addEventListener('click', removeOrder);
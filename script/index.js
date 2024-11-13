const booksUrl = 'https://striveschool-api.herokuapp.com/books'
const key = 'book'
let totalPrice = 0

// localStorage.clear()

const getBooks = function () {
  fetch(booksUrl)
    .then((response) => {
      console.log('response', response)
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('Errore nella response dal server!')
      }
    })
    .then((booksObject) => {
      let shoppingCart = []
      const booksRow = document.getElementById('books-row')
      for (let i = 0; i < booksObject.length; i++) {
        const newCol = document.createElement('div')
        newCol.classList.add(
          'col',
          'col-12',
          'col-md-4',
          'col-lg-3',
          'text-center',
          'd-flex',
          'align-items-stretch'
        )
        newCol.innerHTML = `
            <div class="card my-3">
              <img
                src="${booksObject[i].img}"
                class="card-img-top"
                alt="book cover"
                style="width: 100%; object-fit: cover;"
              />
              <div class="card-body  d-flex flex-column justify-content-between">
                <h5 class="card-title">${booksObject[i].title}</h5>
                <div>
                <p class="card-text">
                 € ${booksObject[i].price}
                </p>
                <div class="d-flex justify-content-around">
                  <button class="btn btn-success">Acquista</button>
                  <button class="btn btn-danger">Scarta</button>
                </div>
                </div>
            </div>
        `
        booksRow.appendChild(newCol)
        // onclick bottone scarta
        const deleteButton = document.getElementsByClassName('btn-danger')[i]
        deleteButton.addEventListener('click', function () {
          newCol.classList.add('d-none')
        })
        // onclick bottone acquista
        const buyButton = document.getElementsByClassName('btn-success')[i]
        buyButton.addEventListener('click', function () {
          if (localStorage.getItem(key)) {
            shoppingCart = JSON.parse(localStorage.getItem(key))
          }
          shoppingCart.push(booksObject[i])
          localStorage.setItem(key, JSON.stringify(shoppingCart))
          renewShoppingCart()
        })
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

const newShoppingCart = function () {
  const shoppingCartDiv = document.getElementById('shopping-cart')
  const cart = JSON.parse(localStorage.getItem(key))
  if (cart) {
    for (let i = 0; i < cart.length; i++) {
      const newItem = document.createElement('div')
      newItem.classList.add('d-flex', 'justify-content-between')
      newItem.innerHTML = `
      <div class="d-flex mb-3">
      <button class="border border-0 bg-white delete"><i class="fas fa-trash-alt"></i></button>
      <p class="mb-0">${cart[i].title}</p>
      </div>
      <p class="text-nowrap mb-0">€ ${cart[i].price}</p>`

      shoppingCartDiv.appendChild(newItem)

      totalPrice = 0
      if (localStorage.getItem(key)) {
        let partial = JSON.parse(localStorage.getItem(key))
        for (let i = 0; i < partial.length; i++) {
          totalPrice += Number(partial[i].price)
        }
      }
      const total = document.getElementById('total')
      total.innerText = `€ ${totalPrice.toFixed(2)}`
    }
  } else {
    const total = document.getElementById('total')
    total.innerText = '€ 0'
  }
}

const renewShoppingCart = function () {
  const shoppingCartDiv = document.getElementById('shopping-cart')
  const cart = JSON.parse(localStorage.getItem(key))
  const newItem = document.createElement('div')
  newItem.classList.add('d-flex', 'justify-content-between')
  newItem.innerHTML = `
   <div class="d-flex mb-3">
      <button class="border border-0 bg-white delete"><i class="fas fa-trash-alt"></i></button>
      <p class="mb-0">${cart[cart.length - 1].title}</p>
      </div>
      <p class="text-nowrap mb-0">€ ${cart[cart.length - 1].price}</p>`

  shoppingCartDiv.appendChild(newItem)

  totalPrice += Number(cart[cart.length - 1].price)

  const total = document.getElementById('total')
  total.innerText = `€ ${totalPrice.toFixed(2)}`
}

getBooks()
newShoppingCart()

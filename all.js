const api_path = "ssozr";
const token = "iQGiLKVBazMn45KrXxwLAHJkuib2";

//產品列表
const productWrap = document.querySelector(".productWrap")

//篩選產品
const productSelect = document.querySelector(".productSelect")

//購物車列表
const shoppingCart_body = document.querySelector(".shoppingCart_body")
const shoppingCart_foot = document.querySelector(".shoppingCart_foot")

//刪除購物車列表
const discardAllBtn = document.querySelector(".discardAllBtn")
let data = []
let cartsData = [];
//產品列表HTML
function productWrapHtml(item){
    return  `<li class="productCard">
    <h4 class="productType">新品</h4>
    <img src=${item.images} alt="">
    <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
    <h3>${item.title}</h3>
    <del class="originPrice">NT$${item.origin_price}</del>
    <p class="nowPrice">NT$${item.price}</p>
</li>`
}

//取得產品列表
function getProductList() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`).
      then(function (response) {
        data = response.data.products
        renderProductList()
      })
      .catch(function(error){
        console.log(error.response.data)
      })
}

//渲染產品列表
function renderProductList(){
    let str = "";
    data.forEach(function(item){
        str += productWrapHtml(item)
    })
    productWrap.innerHTML = str
}

//篩選產品列表
productSelect.addEventListener("change",function(e){
    const category = e.target.value
    if(category === "全部"){
        renderProductList()
        return
    }

    let str = ""
    data.forEach(function(item){
        if(item.category === category){
            str += productWrapHtml(item)
        }
    })
    productWrap.innerHTML = str
})

//監聽產品列表
productWrap.addEventListener("click",function(e){
    e.preventDefault()
    let addCardBtn = e.target.getAttribute("class")
    if(addCardBtn !== "addCardBtn"){
        return
    }
    let productId = e.target.getAttribute("data-id")
    addCart(productId,cartsData)
    getCartList()
})

//加入購物車
function addCart (productId,cartsData){
    let quantity = 1;
    cartsData.carts.forEach(function(item){
        if(productId === item.product.id){
            quantity = item.quantity +1
            return
        }
    })
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
    data: {
      "productId": productId,
      "quantity": quantity
    }
    }).
    then(function (response) {
      alert("加入購物車成功")
      getCartList()
    })
}

//取得購物車列表
function getCartList(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
    then(function (response) {
      cartsData = response.data
      renderCartList(cartsData)
    })
}

//渲染購物車列表
function renderCartList(cartsData){
    let str = ""
    cartsData.carts.forEach(function(item){
        str += `<tr>
        <td>
            <div class="cardItem-title">
                <img src=${item.product.images} alt="">
                <p>${item.product.title}</p>
            </div>
        </td>
        <td>NT$${item.product.price}</td>
        <td>${item.quantity}</td>
        <td>NT$${item.product.price*item.quantity}</td>
        <td class="discardBtn">
            <a href="#" class="material-icons" data-id=${item.id}>
                clear
            </a>
        </td>
    </tr>`
    })
    shoppingCart_body.innerHTML = str
    shoppingCart_foot.innerHTML = `<tr>
        <td>
            <a href="#" class="discardAllBtn">刪除所有品項</a>
        </td>
        <td></td>
        <td></td>
        <td>
            <p>總金額</p>
        </td>
        <td>NT$${cartsData.total}</td>
    </tr>`
}

//監聽購物車列表
shoppingCart_body.addEventListener("click",function(e){
    e.preventDefault()
    if(e.target.getAttribute("class") !== "material-icons"){
        return
    }
    let CartProductId = e.target.getAttribute("data-id")
    deletCartProduct(CartProductId)
})

//刪除購物車品項
function deletCartProduct(CartProductId){
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${CartProductId}`).
    then(function (response) {
      alert("刪除成功")
      getCartList()
    })
}

//監聽刪除購物車按鈕
shoppingCart_foot.addEventListener("click",function(e){
    e.preventDefault()
    if(e.target.getAttribute("class") === "discardAllBtn"){
        axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
        then(function (response) {
        getCartList()
        })
    }
})

//送出訂單資料

const orderInfo_btn = document.querySelector(".orderInfo_btn")
const customerName = document.querySelector("#customerName")
const customerPhone = document.querySelector("#customerPhone")
const customerEmail = document.querySelector("#customerEmail")
const customerAddress = document.querySelector("#customerAddress")
const tradeWay = document.querySelector("#tradeWay")

orderInfo_btn.addEventListener("click",function(e){
    e.preventDefault()

    if(cartsData.carts.length == null){
        alert("購物車內無商品")
        return
    }else if(customerName.value ==="" || customerPhone.value ==="" || customerEmail.value ==="" || customerAddress.value ===""){
        alert("請填寫完資料")
        return
    }
    createOrder(customerName.value,customerPhone.value,customerEmail.value,customerAddress.value,tradeWay.value)
})

//送出購物車訂單
function createOrder(name,tel,email,address,payment) {
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
      {
        "data": {
          "user": {
            "name": name,
            "tel": tel,
            "email": email,
            "address": address,
            "payment": payment
          }
        }
      }
    ).
      then(function (response) {
        alert("訂單已送出")
        getCartList()
        customerName.value = ""
        customerPhone.value = ""
        customerEmail.value = ""
        customerAddress.value = ""
        tradeWay.value = "ATM"
      })
      .catch(function(error){
        console.log(error.response.data);
      })
  }

  function init(){
    getProductList()
    getCartList()
  }

  init()
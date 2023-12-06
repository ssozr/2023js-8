
const order_list = document.querySelector(".order_list")
const discardAllBtn = document.querySelector(".discardAllBtn")

function getOrdersList(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
    headers:{
        "Authorization":token
    }
})
    .then(function(response){
        renderOrderList(response.data)
        renderChart(response.data)
    })
    .catch(function(error){
        console.log(error)
    })
}

function ordersHtml(item){
    let productStr = ``;
    item.products.forEach(function(productItem){
        productStr += `<p>${productItem.title}x${productItem.quantity}</p>`
    })

    let orderPaidStr = '';
    if( item.paid === true ){
        orderPaidStr = `已付款`
    }else if(item.paid === false){
        orderPaidStr =` 未付款`
    }

    let timeStr = timeChange(item.updatedAt)

    return `<tr>
    <td>${item.id}</td>
    <td>
      <p>${item.user.name}</p>
      <p>${item.user.tel}</p>
    </td>
    <td>${item.user.address}</td>
    <td>${item.user.email}</td>
    <td>
      ${productStr}
    </td>
    <td>${timeStr}</td>
    <td class="orderStatus">
      <a href="#" data-status=${item.paid} data-id=${item.id}>${orderPaidStr}</a>
    </td>
    <td>
      <input type="button" class="delSingleOrder-Btn" value="刪除" data-id=${item.id}>
    </td>
</tr>`
}

function renderOrderList(data){
    let str = ``
    data.orders.forEach(function(item){
        str += ordersHtml(item)
    })
    order_list.innerHTML = str
}

order_list.addEventListener("click",function(e){
    e.preventDefault()
    if(e.target.getAttribute("data-id")){
        if(e.target.getAttribute("value")==='刪除'){
            deletreOrderItem(e.target.getAttribute("data-id"))
        }else{
            deleteOrderItem(e.target.getAttribute("data-id"),e.target.getAttribute("data-status"))
        }
    }
})

function deleteOrderItem(id,status){
    let newStatus;

    if(status == 'false'){
        newStatus = true
    }else {
        newStatus = false
    }

    console.log(newStatus)

    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
        "data": {
          "id": id,
          "paid": newStatus
        }
      },{
    headers:{
        "Authorization":token
    }
    })
    .then(function(response){
        alert("狀態修改成功")
        getOrdersList()
    })
    .catch(function(error){
        console.log(error)
    })
}

function deletreOrderItem(id){
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${id}`,{
    headers:{
        "Authorization":token
    }
    })
    .then(function(response){
        alert("刪除成功")
        getOrdersList()
    })
    .catch(function(error){
        console.log(error)
    })
}

discardAllBtn.addEventListener("click",function(e){
    e.preventDefault()
    allDeleteOrderItem()
})
function allDeleteOrderItem(){
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
    headers:{
        "Authorization":token
    }
    })
    .then(function(response){
        alert("已刪除所有訂單")
        getOrdersList()
    })
    .catch(function(error){
        console.log(error)
    })
}

function renderChart(chartData){
    console.log(chartData.orders)
    let ary =[]
    let obj ={}
    let chartAryData = []
    chartData.orders.forEach(function(item){
        item.products.forEach(function(productItem){
            if(obj[productItem.title] === undefined){
                obj[productItem.title] = productItem.quantity
            }else {
                obj[productItem.title] += productItem.quantity
            }
        })
    })
    let sortedArr = Object.entries(obj).sort((a, b) => b[1] - a[1]);
    console.log("所有",sortedArr)
    let top4Values = sortedArr.slice(0, 4);
    let otherValues = sortedArr.slice(4, sortedArr.length);
    console.log("其它",otherValues)
    ary = Object.keys(obj)
    let otherNum = 0;
    let otherAry = []
    otherValues.forEach(function(item){
        otherNum += item[1]
    })
    otherAry = ["其它", otherNum]
    top4Values.push(otherAry)
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: top4Values,
            colors:{
            }
        },
    });
}

function timeChange(time){
    // 以秒為單位的 UNIX 時間戳
let timestamp = time;

// 使用 Date 物件轉換為日期
let date = new Date(timestamp * 1000); // 乘以 1000 將秒數轉換為毫秒

// 取得日期的各個部分
let year = date.getFullYear();
let month = date.getMonth() + 1; // 月份從 0 開始，所以要加 1
let day = date.getDate();
// 輸出結果
return `${year}-${month}-${day}`;
}

getOrdersList()
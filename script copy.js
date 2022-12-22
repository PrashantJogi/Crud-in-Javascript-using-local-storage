let inputFields 
let definedRoutes = Array.from(document.querySelectorAll("[router-link]"));
let root = document.getElementById("app");
let count = 0;
let final = [];
let btn;
let userArr = [];

function submit() {
  let user = {};
  
  inputFields.forEach((e) => {
    // console.log(e.value);
    console.log(e.name + " name " + e.value + " value");
    user[e.name] = e.value;
  });
  userArr.push(user);
  

  localStorage.setItem("primaryValue", JSON.stringify(userArr));

  clean();
  // 
  // navigate();
}

// function pageJump() {
//   let routeInfo = routerInstance.routes
//   // console.log("🚀 ~ file: script.js ~ line 26 ~ pageJump ~ routeInfo", routeInfo)
//   window.history.pushState({}, "", "result.html");
//   // if (routeInfo.path=="/") {
//   //   window.history.pushState({}, "", "error");
//   //   // root.innerHTML = `This route is not Defined`;
//   // } else {
//   //   window.history.pushState({}, "", routeInfo.path);
//   //   // root.innerHTML = `You are on the ${routeInfo.name} path`;
//   // }
// }

function clean() {
  inputFields.forEach((element) => {
    element.value = "";
  });
}

function ResultOpen() {
  
  let table = document.getElementById("tbody");
  

  

 
    let KeyName = { ...localStorage };

    let values = [];

    values = Object.values(KeyName);
    // console.log("🚀 ~ file: script.js ~ line 40 ~ ResultOpen ~ values", values)

    values.forEach((e) => {
      let temp = {};
      temp = JSON.parse(e);
      // console.log(temp,"values");

      temp.forEach((i) => {
        
        let row = table.insertRow();
        row.setAttribute("id", count);
        count++;
        Object.values(i).forEach((m) => {
          row.insertCell().innerHTML = m;
        });
        row.insertCell().innerHTML =
          "<button onclick='update(this)'>Update</button>" +
          "<button onclick='del(this)'>Delete</button>";
      });
    });
   
 
}

//for update entry
function update(element) {
  console.log("click");
  let id = element.parentElement.parentElement.id;

  let values = [];
  let target = document.getElementById(id);
  let arr = [];
  arr = [target];

  arr.forEach((data) => {
    values = data.children;
  });

  for (i = 0; i < values.length - 1; i++) {
    console.log(values[i].innerHTML);
    // inputFields[i].value = values[i].innerHTML;
  }
  //   inputFields[0].parentElement.id = id;
}

//for delete entry
function del(element) {
  let row = element.parentElement.parentElement;
  let table = document.getElementById("tbody");
  let KeyName = { ...localStorage };
  
  let values = [];

  values = Object.values(KeyName);
  // console.log("🚀 ~ file: script.js ~ line 40 ~ ResultOpen ~ values", values)

  if (confirm("This entry will be deleted !") === true) {
    confirmation = true;
    values.forEach((e) => {
      let temp = {};
      temp = JSON.parse(e);
      console.log(temp,"values");
      row.remove();
      temp.splice(row.id, 1);
      
      localStorage.setItem("primaryValue", JSON.stringify(temp));
    });
  }
}

//router instance
let Router = function (name, routes) {
  return {
    name,
    routes,
  };
};

//   create the route instance
let routerInstance = new Router("routerInstance", [
  {
    path: "/",
    name: "Root",
  },
  {
    path: "/result",
    name: "Result",
  },
]);



// method to navigate
let navigate = e => {
  
  let route = e.target.attributes[0].value;
  console.log(route, "route");
  // redirect to the router instance
  let routeInfo = routerInstance.routes.filter((r) => {
    // console.log(r.path === route, "r");
    return r.path === route;
  });

  // console.log(routeInfo, "routeInfo");

  if (routeInfo[0].name === "Result") {
    window.history.pushState({}, "", "/");
    root.innerHTML = `<div onload="ResultOpen()">
        <h1>User Data</h1>
        <table id="dataTable">
            <thead>
                <tr>
                    <td>First Name</td>
                    <td>Last Name</td>
                    <td>Age</td>
                    <td>Mobile Number</td>
                    <td>Buttons</td>
                </tr>
            </thead>
            <tbody id="tbody">

            </tbody>
        </table>
    </div>`;
    ResultOpen();
    // location.href = routeInfo[0].path;
  } else {
    window.history.pushState({}, "", "/");
    root.innerHTML = `<div id="" class="inputFields">
        <label>First Name</label>
        <input type="text" name="fname" data-validation="required|min:2|max:10|regex:^[a-zA-Z\s]+$">
        <div class="error" style="color: red;" id="fnameErr"></div>
        <br />
        <label>Last Name</label>
        <input type="text" name="lname" data-validation="required|min:2|max:10|regex:^[a-zA-Z\s]+$">
        <div class="error" style="color: red;" id="lnameErr"></div>
        <br />
        <label>Age</label>
        <input type="number" name="age" data-validation="required|min:18">
        <div class="error" style="color: red;" id="ageErr"></div>
        <br />
        <label>Mobile Number</label>
        <input type="phone" name="phone" data-validation="required|min:10|regex:^[1-9]\d{9}">
        <div class="error" style="color: red;" id="phoneErr"></div>
        <br />
    </div>
    <button onclick="submit()" value="login">Submit</button>`;
     inputFields = document.querySelectorAll("input");
    // location.href = routeInfo[0].path;
  }

  // console.log(location.pathname, "location.pathname");
  // if(location.pathname==="/result.html"){

  // }
};

//iterate over all defined routes
definedRoutes.forEach((route) => {
  
  route.addEventListener("click", navigate, false);
});

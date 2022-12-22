let inputFields = document.querySelectorAll("input");
let definedRoutes = Array.from(document.querySelectorAll("[router-link]"));
let root = document.getElementById("app");
let field = document.getElementsByName("inputFields");
let count = 0;
let userArr = [];

function submit() {
  let user = {};

  inputFields.forEach((e) => {
    user[e.name] = e.value;
  });

  console.log(user, "user");

  if (
    localStorage.key("editData") &&
    localStorage.getItem("editData") !== "" &&
    { ...localStorage } !== "undefined"
  ) {
    let targetId = localStorage.getItem("editId");
    let allEntries = localStorage.getItem("primaryValue");
    user["id"] = targetId;
    allEntries = JSON.parse(allEntries);
    // console.log(arr.includes(targetData,0), "check target id");
    // console.log(arr,'arr');
    for (let e = 0; e < allEntries.length; e++) {
      if (targetId == allEntries[e].id) {
        allEntries.splice(allEntries.indexOf(allEntries[e]), 1, user);
      }
    }
    console.log(allEntries, "allEntries");
    localStorage.setItem("editData", "");
    localStorage.setItem("editId", "");
    localStorage.setItem("primaryValue", JSON.stringify(allEntries));
  } else {
    debugger
    user["id"] = guid();
    if ({ ...localStorage } == "") {
      userArr.push(user);
      localStorage.setItem("primaryValue", JSON.stringify(userArr));
    } else {
      console.log({ ...localStorage }, "{ ...localStorage }");
      let storageValue = localStorage.getItem("primaryValue");
      storageValue = JSON.parse(storageValue);
      console.log(storageValue, "storageValue");
      storageValue.push(user);
      localStorage.setItem("primaryValue", JSON.stringify(storageValue));
    }
  }

  clean();
}

//unique Id generator
let guid = () => {
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
};

//checking for update values
function check() {
  if (
    localStorage.key("editData") &&
    localStorage.getItem("editData") !== "" &&
    { ...localStorage } !== "undefined"
  ) {
    let targetData = localStorage.getItem("editData");
    targetData = JSON.parse(targetData);
    targetData = Object.values(targetData);
    for (i = 0; i < targetData.length - 1; i++) {
      inputFields[i].value = targetData[i];
    }
  }
}

function clean() {
  inputFields.forEach((element) => {
    element.value = "";
  });
}

//for get entries on result page
function ResultOpen() {
  let table = document.getElementById("tbody");
  let currentPath = location.pathname;

  if (currentPath == "/result.html") {
    let KeyName = localStorage.getItem("primaryValue");

    let values = [];
    KeyName = JSON.parse(KeyName);
    // values = Object.values(KeyName);
    console.log(
      "🚀 ~ file: script.js ~ line 40 ~ ResultOpen ~ values",
      KeyName
    );
    KeyName.length > 0 &&
      KeyName.forEach((i) => {
        let row = table.insertRow();
        // row.setAttribute("id", count);
        // count++;
        Object.values(i).forEach((m) => {
          if (m.length <= 10) {
            row.insertCell().innerHTML = m;
          } else {
            row.setAttribute("id", m);
          }
        });
        row.insertCell().innerHTML =
          "<button onclick='update(this)'>Update</button>" +
          "<button onclick='del(this)'>Delete</button>";
      });
  }
}

//for update entry
function update(element) {
  // console.log("click");
  let id = element.parentElement.parentElement.id;
  // console.log(id,"id");
  let targetData = localStorage.getItem("primaryValue");
  let arr = JSON.parse(targetData);

  arr &&
    arr.forEach((e) => {
      // console.log(arr.indexOf(e), "e");
      console.log(e, "e");
      if (id == e.id) {
        console.log("matched");
        localStorage.setItem("editData", JSON.stringify(e));
        localStorage.setItem("editId", e.id);
      }
    });
  location.href = "/";
}

//for delete entry
function del(element) {
  let row = element.parentElement.parentElement;
  let table = document.getElementById("tbody");
  // let KeyName = { ...localStorage };
  let KeyName = localStorage.getItem("primaryValue");
  let values = [];

  values = Object.values(KeyName);
  KeyName = JSON.parse([KeyName]);
  console.log(typeof KeyName, KeyName, "KeyName");
  if (confirm("This entry will be deleted !") === true) {
    KeyName.forEach((e) => {
      let temp = {};
      // temp = JSON.parse(e);
      if (row.id === e.id) {
        console.log(KeyName.indexOf(e), "KeyName.indexOf(e)");
        KeyName.splice(KeyName.indexOf(e), 1);

        localStorage.setItem("primaryValue", JSON.stringify(KeyName));
        row.remove();
      }
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
    path: "/result.html",
    name: "Result",
  },
]);

// method to navigate
let navigate = (e) => {
  let route = e.target.attributes[0].value;

  // redirect to the router instance
  let routeInfo = routerInstance.routes.filter((r) => {
    return r.path === route;
  });

  if (routeInfo[0].name === "Result") {
    // window.history.pushState({}, "", routeInfo[0].path);
    // root.innerHTML = `This route is not Defined`;
    location.href = routeInfo[0].path;
  } else {
    // window.history.pushState({}, "", routeInfo[0].path);
    // root.innerHTML = `You are on the ${routeInfo.name} path`;
    location.href = routeInfo[0].path;
  }
};

//iterate over all defined routes
definedRoutes.forEach((route) => {
  route.addEventListener("click", navigate, false);
});

//validation code
function validateForm() {
  let allFields = document.querySelectorAll("input");
  let error = [];
  let dataArr = [];

  allFields.forEach((field) => {
    checkValidation(field, dataArr, error);
  });

  //   console.log(error.length>0 ? error : "empty", "error");
  if (error.length === 0) {
    submit();
  }
}

function checkValidation(field, dataArr, error) {
  if (field.dataset.validation) {
    let isInvalid = false;
    const validationRules = field.dataset.validation.split("|");
    validationRules.map((validation) => {
      // debugger;
      if (!isInvalid) {
        if (validation === "required") {
          let isValidMessage;
          if (field.type.includes("checkbox") || field.type.includes("radio")) {
            isValidMessage = validateCheckBox_And_RadioBtn(field.name);
          } else {
            isValidMessage = validateRequired(field.value, field.name);
          }
          if (isValidMessage) {
            document.getElementById(`${field.name}Err`).innerHTML =
              isValidMessage;
            error.push(field.name);
            isInvalid = true;
          } else {
            document.getElementById(`${field.name}Err`).innerHTML = "";
            // showData({[field.name]:field.value})
          }
        } else if (validation.includes("min:")) {
          const isValidMessage = validateMin(
            field.value,
            validation,
            field.name
          );
          if (isValidMessage) {
            document.getElementById(`${field.name}Err`).innerHTML =
              isValidMessage;
            error.push(field.name);
            isInvalid = true;
          } else {
            document.getElementById(`${field.name}Err`).innerHTML = "";
          }
        } else if (validation.includes("max:")) {
          const isValidMessage = validateMax(
            field.value,
            validation,
            field.name
          );
          if (isValidMessage) {
            document.getElementById(`${field.name}Err`).innerHTML =
              isValidMessage;
            error.push(field.name);
            isInvalid = true;
          } else {
            document.getElementById(`${field.name}Err`).innerHTML = "";
          }
          // logic for max validation
        } else if (validation.includes("regex:")) {
          // logic for regex validation
          const isValidMessage = validateRegex(
            field.value,
            validation,
            field.name
          );
          if (isValidMessage) {
            document.getElementById(`${field.name}Err`).innerHTML =
              isValidMessage;
            error.push(field.name);
            isInvalid = true;
          } else {
            // debugger;

            document.getElementById(`${field.name}Err`).innerHTML = "";
          }
        }
      }
    });
    dataArr.push({ [field.name]: field.value });
  }
}

function validateRequired(value, fieldName) {
  if (!value || value === "" || value.trim() === "") {
    return `${fieldName} is required.`;
  }
  return undefined;
}

function validateMin(value, validationRule, fieldName) {
  const [rule, param] = validationRule.split(":");

  if (
    fieldName === "Age"
      ? parseInt(value) < parseInt(param)
      : !value || parseInt(value.length) < parseInt(param)
  ) {
    if (fieldName === "Age") {
      return `${fieldName} must not les than ${param}.`;
    } else {
      return `${fieldName} must not contain less than ${param} characters.`;
    }
  }
  return undefined;
}

function validateMax(value, validationRule, fieldName) {
  const [rule, param] = validationRule.split(":");
  if (
    fieldName === "Age"
      ? parseInt(value) > parseInt(param)
      : !value || parseInt(value.length) > parseInt(param)
  ) {
    if (fieldName === "Age") {
      return `${fieldName} must not more than ${param}.`;
    } else {
      return `${fieldName} must not contain more than ${param} characters.`;
    }
  }
  return undefined;
}

function validateRegex(value, validationRule, fieldName) {
  const [rule, param] = validationRule.split(":");
  const regex = new RegExp(param);
  if (regex.test(value) === false) {
    return `Please enter a valid ${fieldName} `;
  }
  return undefined;
}

function validateCheckBox_And_RadioBtn(fieldName) {
  let field = document.getElementsByName(fieldName);
  let IsValid = false;

  field.forEach((element) => {
    if (element.checked === true) {
      IsValid = true;
    }
  });
  if (!IsValid) {
    return `${fieldName} is required.`;
  }
}

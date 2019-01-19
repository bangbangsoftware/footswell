import { listPlayers } from "./setup.js";

const pages = [];
export function setupScreen(id) {
  const screen = document.getElementById(id);
  const button = document.getElementById(id + "But");
  button.addEventListener("click", () => {
    console.log(listPlayers());
    const hidden = screen.classList.contains("hide");
    pages.forEach(page => {
      page.screen.classList.add("hide");
      page.button.classList.remove("selected");
    });
    if (hidden) {
      screen.classList.remove("hide");
      button.classList.add("selected");
    }
  });
  const page = { screen, button };
  pages.push(page);
}

const createTakeBut = field => {
  const button = document.createElement("button");
  button.innerText = "-";
  button.classList.add("fieldBut");
  button.onclick = () => {
    field.value = "";
  };
  return button;
};

const createAddBut = (holder, name, id, row, take) => {
  const button = document.createElement("button");
  button.innerText = "+";
  button.classList.add("fieldBut");
  button.onclick = () => {
    adder(holder, name, id, row, take);
  };
  return button
};

const adder = (holder, name, id, add, row, take) => {
  add.classList.add("hide");
  row.appendChild(take);
  createField(holder, name, "", id + 1);
};

const createField = (holder, name, value, id, more = true) => {
  const row = document.createElement("div");

  const field = document.createElement("input");
  field.value = value;
  field.id = name + "--" + id;
  field.classList.add("field");
  field.focus();
 
  const takeBut = createTakeBut(field);
  const addBut = createAddBut(holder, name, id, row, takeBut);

  row.appendChild(field);
  if (value && more) {
    row.appendChild(takeBut);
  } else {
    row.appendChild(addBut);
  }
  row.classList.add("fieldRow");
  holder.appendChild(row);
  return field;
};

const listen = (field,fn) => {
  const changed = e => fn(e);
  field.addEventListener("change", e => changed(e));
  field.addEventListener("keypress", e => {
    if (event.which == 13 || event.keyCode == 13) {
      adder(holder, name, id, row, takeBut);
    }
  });
  field.addEventListener("onpaste", e => changed(e));
  field.addEventListener("oninput", e => changed(e));
}

const save = (fields)=>{
  const players = fields.map((field,index) => {
    const place = (index > 5)? "bench" : "pitch";
    return { name: field.value,place};
  });
  window.localStorage.setItem("players", JSON.stringify(players));
}

export function setupField(name, values = [""]) {
  const main = document.getElementById(name);
  const holder = document.createElement("div");
  holder.classList.add("fieldGrid");
  const fields = values.map((value, i) => {
   const field = createField(holder, name, value, i, i + 1 !== values.length);
   listen(field, e => save(fields));
   return field;
  });
  main.appendChild(holder);
  return fields;
}

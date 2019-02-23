let storage = window.localStorage;
// Just for testing....
export function setStorage(s) {
  storage = s;
}

const registerMap = {};

export function clear() {
  storage.setItem("reg", "");
  for (const field in registerMap) delete registerMap[field];
}

export function reg(fieldname, element, key) {
  const data = registry.get(fieldname);

  const elements = data ? data.elements : [];
  elements.push(element);
  const currentValue = data ? data.currentValue : element.innerText;
  element.innerText = currentValue;
  const newData = { elements, currentValue };
  registry.put(fieldname, newData);

  return registerMap;
}

export function put(fieldname, element, key = "innerText") {
  const data = registry.get(fieldname);
  if (data) {
    data.elements = data.elements.map(el => {
      el.innerText = element[key];
      return el;
    });
    const haveitAlready = data.elements.some(el => el.id === element.id);
    if (!haveitAlready) {
      data.elements.push(element);
    }
    data.currentValue = element[key];
    registry.put(fieldname, data);
    return data.currentValue;
  }

  const elementsValue = {
    currentValue: element.innerText,
    elements: [element]
  };
  registry.put(fieldname, elementsValue);

  return element.innerText;
}

const none = w => {
  if (w === undefined) {
    return true;
  }
  if (!w) {
    return true;
  }

  if (w === null) {
    return true;
  }
  return false;
};

const setup = () => {
  const regString = storage.getItem("reg");
  const newReg = none(regString) ? [] : JSON.parse(regString);
  for (const field in registerMap) delete registerMap[field];
  for (const field in newReg) registerMap[field] = newReg[field];
};

const registry = {
  get: key => {
    if (registerMap.length === 0) {
      setup(storage);
    }
    return registerMap[key];
  },
  put: (key, elementsValue) => {
    registerMap[key] = elementsValue;
    const keyvalue = {};
    Object.keys(registerMap).forEach(key =>{
      keyvalue[key] = registerMap[key].currentValue;
    });
    const reg = JSON.stringify(keyvalue);
    storage.setItem("reg", reg);
  }
};

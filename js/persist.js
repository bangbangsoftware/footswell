const remove = index => () => {
  subs.splice(index, 1);
};

const subs = [];
export function sub(id, fn) {
  const sub = { fn, id };
  subs.push(sub);
  const index = subs.length - 1;
  return remove(index);
}
const keys = [];
const addKey = id => {
  if (keys.indexOf(id) > -1) {
    return;
  }
  keys.push(id);
};

export function reset() {
  const results = keys.map(id => {
    const obj = get(id);
    window.localStorage.removeItem(id);
    return { id, obj };
  });
  return results;
}

export function importData(dataList) {
  dataList.forEach(data => put(data.id, data.obj));
}

export function getAll() {
  const results = keys.map(id => {
    const obj = get(id);
    return { id, obj };
  });
  return results;
}

export function get(id) {
  addKey(id);
  const jstring = window.localStorage.getItem(id);
  try {
    return JSON.parse(jstring);
  } catch (e) {
    console.error(e);
  }
  return jstring;
}

const different = (one, two) => {
  if (!one && !two) {
    return false;
  }

  if (!one || !two) {
    return true;
  }
  const oneKeys = Object.keys(one);
  const twoKeys = Object.keys(two);
  if (oneKeys.length !== twoKeys.length) {
    return true;
  }
  return oneKeys.some(key => one[key] !== two[key]);
};

const getDelta = (oldData, newData) => {
  if (!newData) {
    return null;
  }
  if (!newData.map) {
    const diff = { new: newData, old: oldData };
    return different(oldData, newData) ? diff : null;
  }
  return newData
    .map((newer, i) => {
      const old = !oldData || oldData.length - 1 < i ? null : oldData[i];
      return different(newer, old) ? { old, new: newer } : false;
    })
    .filter(there => there);
};

export function set(id, data) {
  const oldList = get(id);
  const list = oldList || [];
  list.push(data);
  put(id, list);
}

export function del(id) {
  window.localStorage.removeItem(id);
}

export function put(id, newData) {
  addKey(id);
  const oldData = JSON.parse(window.localStorage.getItem(id));
  const jstring = JSON.stringify(newData);
  window.localStorage.setItem(id, jstring);
  const delta = getDelta(oldData, newData);
  if (!delta) {
    return;
  }
  subs
    .filter(sub => sub.id === id)
    .forEach(sub => {
      sub.fn(delta);
    });
}

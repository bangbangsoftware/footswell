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

export function get(id) {
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
  if (!newData.map) {
    const diff = { new: newData, old: oldData };
    return different(oldData, newData) ? diff : null;
  }
  return newData
    .map((newer, i) => {
      
      const old = (oldData.length-1 < i)? null : oldData[i];
      return different(newer, old) ? { old, new: newer } : false;
    })
    .filter(there => there);
};

export function set(id, data){
  const oldList = get(id);
  const list = (oldList)? oldList: [];
  list.push(data);
  put(id,list);
}

export function put(id, newData) {
  const oldData = JSON.parse(window.localStorage.getItem(id));
  const jstring = JSON.stringify(newData);
  window.localStorage.setItem(id, jstring);
  const delta = getDelta(oldData, newData);
  if (!delta) {
    return;
  }
  subs.filter(sub => sub.id === id).forEach(sub => sub.fn(delta));
}

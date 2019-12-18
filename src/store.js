const items = [];
let error = null;

const findById = function (id) {
  return this.items.find(currentItem => currentItem.id === id);
};

const addItem = function (item) {
  item.expand = false;
  item.filter = false;
  this.items.push(item);
};

const findAndDelete = function (id) {
  this.items = this.items.filter(currentItem => currentItem.id !== id);
};

const setError = function (error) {
  this.error = error;
};

const setFilter = function (star) {
  this.items.forEach(current => {
    if(current.rating < star)  
      current.filter = true;
    else 
      current.filter = false;
  });
  this.items.sort(function(a, b){return b.rating-a.rating;});
};

const setExpand = function (id) {
  let found = this.findById(id);
  found.expand = !found.expand;
};

export default {
  items,
  error,
  findById,
  addItem,
  findAndDelete,
  setError, 
  setFilter,
  setExpand
};
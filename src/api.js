const BASE_URL = 'https://thinkful-list-api.herokuapp.com/jjlaguardia/bookmarks';

function listApiFetch(...args) {
  let error;
  return fetch(...args)
    .then(res=> {
      if(!res.ok) {
        error = {code: res.status};
        if (!res.headers.get('content-type').includes('json')) {
          error.message = res.statusText;
          return Promise.reject(error);
        }
      }
      return res.json();
    })
    .then(data => {
      if(error) {
        error.message = data.message;
        return Promise.reject(error);
      }
      return data;
    });
}

function getItems(){
  return listApiFetch(`${BASE_URL}`);
}

function createItem(name, url, desc, rate){
  const newItem = JSON.stringify({ 'title': name, 'url': url, 'desc': desc, 'rating': rate});

  return listApiFetch(`${BASE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: newItem
  });
}

function deleteItem(id) {
  return listApiFetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  });
}

export default {
  getItems,
  createItem,
  deleteItem,
};
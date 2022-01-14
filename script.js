const requestURL = 'http://localhost:3000/todos';

let input = document.getElementById('textInput');
let list = document.getElementById('list');
let createBtn = document.getElementById('textBtn');

const getJSON = function (url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.responseType = 'json';
        xhr.onload = function () {
            if (xhr.status >= 400) {
                reject(xhr.response);
            } else {
                resolve(xhr.response);
            }
        };
        xhr.send();
    });
};

const postJSON = function (url, data) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('post', url, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.responseType = 'json';
        xhr.onload = function () {
            let status = xhr.status;
            if (status === 201) {
                resolve(xhr.response);
            } else {
                reject(status);
            }
        };
        xhr.onerror = function (e) {
            reject('Error' + url);
        };
        xhr.send(JSON.stringify(data));
    });
};

const putJSON = function (url, data) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('put', url, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.responseType = 'json';
        xhr.onload = function () {
            let status = xhr.status;
            if (status === 200) {
                resolve(xhr.response);
            } else {
                reject(status);
            }
        };
        xhr.onerror = function (e) {
            reject('Error' + url);
        };
        xhr.send(JSON.stringify(data));
    });
};

const deleteJSON = function (url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('delete', url, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.responseType = 'json';
        xhr.onload = function () {
            let status = xhr.status;
            if (status === 200) {
                resolve(xhr.response);
            } else {
                reject(status);
            }
        };
        xhr.onerror = function (e) {
            reject('Error' + url);
        };
        xhr.send(null);
    });
};

class TodoList {
    constructor(el) {
        this.el = el;
        this.el.addEventListener('click', (event) => {
            let target = event.target;
            let id = target.closest('li').dataset.id;
            if (target.classList.contains('statusButton')) {
              createLi.changeStatus(id);
            } else if (target.classList.contains('deleteButton')) {
              createLi.removeTodo(id);
            }
          })
    }
    async getData() {
        try {
            return await getJSON(requestURL);
        } catch (error) {
            console.log(new Error(error));
        }
    }

    async render() {
        let lis = '';
        try {
            let data = await this.getData();
            for (let el of data) {
                if (!el) {
                    return;
                }
                let colorToDo = el.complited ? "done" : "notDone";
                lis += `<li data-id="${el.id}" class ="${colorToDo}">${el.task}<button class="statusButton">Change status</button><button class="deleteButton">Delete</button></li>`;
            }
            this.el.innerHTML = lis;
        }
        catch(error) {
            console.log(new Error (error));
        }
    }

    async addTodo() {
        try {
            if (input.value !== '') {
                await postJSON(requestURL, {
                    task: input.value,
                    complited: false,
                });
                this.render()
            }
        } catch (err) {
            console.log(new Error(err));
        }
    }

    async changeStatus(id) {
        try {
            let data = await this.getData();
            for (let el of data) {
                if (el.id == id) {
                    el.complited = !el.complited;
                    let task = document.querySelector(`[data-id="${id}"]`);
                    this.changeTodoColor(task);
                    putJSON(`${requestURL}/${id}`, {
                        task: el.task,
                        complited: el.complited,
                    });
                }
                this.render()
            }
        } catch (error) {
            console.log(new Error(error));
        }
    }

    changeTodoColor(el) {
        el.classList.toggle('done');
    }

    async removeTodo(id) {
        try {
            let data = await this.getData();
            let task = document.querySelector(`[data-id="${id}"]`);
            for (let item of data) {
                if (item.id == id) {
                    deleteJSON(`${requestURL}/${id}`);
                    task.remove();
                }
                this.render()
            }
        } catch (error) {
            console.log(new Error(error));
        }
    }
}

let createLi = new TodoList(list);
createLi.render();
createBtn.addEventListener('click', function () {
    if (input.value) {
        createLi.addTodo();
        input.value = '';
    }
})
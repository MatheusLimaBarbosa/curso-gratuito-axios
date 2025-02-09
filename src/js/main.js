const statusEl = document.getElementById('status');
const dataEl = document.getElementById('data');
const headersEl = document.getElementById('headers');
const configEl = document.getElementById('config');

axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com'

axios.interceptors.request.use(function(config) {
    return config;   
}, function(error){
    console.log('error');
    return Promise.reject(error);
})

axios.interceptors.response.use(function(response) {
    console.log('sucesso') 
    return response
}, function(error) {
    console.log(error.response)
    return Promise.reject(error)
})

const get = () => {
    const config = {
        params: {
            _limit: 5
        }
    }
    axios.get('posts', config)
    .then((response) => renderOutput(response))
}

const post = () => {
    const data = {
        title: 'foo',
        body: 'bar',
        userId: 1,
    }
    axios.post('posts', data)
    .then((response) => renderOutput(response))
}

const put = () => {
    const data = {
        title: 'foo',
        body: 'bar',
        userId: 1,
    }
    axios.put('posts/1', data)
    .then((response) => renderOutput(response))
}

const patch = () => {
    const data = {
        body: 'fodwdo',
    };
    axios.patch('posts/1', data)
    .then((response) => renderOutput(response))
}   

const del = () => {
    axios.delete('posts/2', data)
    .then((response) => renderOutput(response))
}

const multiple = () => {
   Promise.all([ 
    axios.get('posts?_limit=5'),
    axios.get('users?_limit=5')
   ]).then((response) => {
    console.table(response[0].data)
    console.table(response[1].data)
   })
}



const transform = () => {
    const config = {
        params: {
            _limit: 5
        },
        transformResponse: [function(data) {
            const payload = JSON.parse(data).map(o => {
                return {
                    title: o.title
                }
            });
            
            return payload
        }],
    }
    axios.get('posts', config)
    .then((response) => renderOutput(response))
}

const errorHandling = () => {
    axios.get('postsz')
    .then((response) => renderOutput(response))
    .catch((error) => {
        renderOutput(error.response)
        console.log(error.response)
    })
}

const cancel = () => {
    const controller = new AbortController()
    const config = {
        params: {
            _limit: 5
        },
        signal: controller.signal
    }
    axios.get('posts', config)
    .then((response) => renderOutput(response))
    .catch((e) => {
        console.log(e.message)
    })
    controller.abort()
}

const clear = () => {
    statusEl.innerHTML = '';
    statusEl.className = '';
    dataEl.innerHTML = '';
    headersEl.innerHTML = '';
    configEl.innerHTML = '';
}

const renderOutput = (response) => {
    // Status
    const status = response.status;
    statusEl.removeAttribute('class');
    let statusElClass = 'inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium';
    if (status >= 500) {
        statusElClass += ' bg-red-100 text-red-800';
    } else if (status >= 400) {
        statusElClass += ' bg-yellow-100 text-yellow-800';
    } else if (status >= 200) {
        statusElClass += ' bg-green-100 text-green-800';
    }

    statusEl.innerHTML = status;
    statusEl.className = statusElClass;

    // Data
    dataEl.innerHTML = JSON.stringify(response.data, null, 2);
    Prism.highlightElement(dataEl);

    // Headers
    headersEl.innerHTML = JSON.stringify(response.headers, null, 2);
    Prism.highlightElement(headersEl);

    // Config
    configEl.innerHTML = JSON.stringify(response.config, null, 2);
    Prism.highlightElement(configEl);
}

document.getElementById('get').addEventListener('click', get);
document.getElementById('post').addEventListener('click', post);
document.getElementById('put').addEventListener('click', put);
document.getElementById('patch').addEventListener('click', patch);
document.getElementById('delete').addEventListener('click', del);
document.getElementById('multiple').addEventListener('click', multiple);
document.getElementById('transform').addEventListener('click', transform);
document.getElementById('cancel').addEventListener('click', cancel);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('clear').addEventListener('click', clear);

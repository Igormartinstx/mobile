const instance = axios.create({
  baseURL: 'https://curly-winner-vj4gvqqjqp93x5rj-8080.app.github.dev',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});
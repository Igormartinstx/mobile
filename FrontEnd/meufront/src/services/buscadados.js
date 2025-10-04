const BASE_URL = 'https://scaling-space-train-6jp775xjqghrjjp-8080.app.github.dev'


export const buscaPessoa = async() => {
    const response = await fetch(`${BASE_URL}/api/pessoas`,{
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
    });

    if (!response.ok) {
        throw new Error('Erro ao buscar pessoas');
    }

    return await response.json()
} 

export const getPessoaById = async (id) => {
  const response = await fetch(`${BASE_URL}/api/pessoas/${id}`);

  if (!response.ok) {
    throw new Error('Pessoa não encontrada.');
  }

  return await response.json();
};

export const novaPessoa = async(dataPessoa) =>{
    const response = await fetch(`${BASE_URL}/api/pessoas`,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataPessoa),
    });

    if (!response.ok) {
        throw new Error('Pessoa não encontrada.');
    }
    return await response.json();
}

export const deletePessoa = async(id) => {
    const response = await fetch(`${BASE_URL}/api/pessoas/${id}`);
    if (!response.ok) {
        throw new Error('Pessoa não encontrada.');
    }
    return await response.json();
}
import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { novaPessoa, deletePessoa, buscaPessoa } from "../src/services/buscadados";

// --- Hook Customizado ---
const useDataFetcher = (fetchFn) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError("Erro ao carregar.");
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, setData, refetch };
};

// --- Botão ---
const Button = ({ children, onClick, type = "button", variant = "primary" }) => {
  return (
    <button type={type} onClick={onClick} className={`btn ${variant}`}>
      {children}
    </button>
  );
};

// --- Modal ---
const Modal = ({ children, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose}>
        ✖
      </button>
      {children}
    </div>
  </div>
);

// --- App Principal ---
function App() {
  const { data: pessoas, loading, error, setData, refetch } =
    useDataFetcher(buscaPessoa);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: "", idade: "" });

  const handleOpenModal = () => {
    setFormData({ nome: "", idade: "" }); // reseta formulário ao abrir
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleFormChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await novaPessoa(formData); // só adiciona nova pessoa
    await refetch();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    await deletePessoa(id);
    setData((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="app">
      <header className="header">
         <div className="title-box">
    <h1>Painel de Gestão</h1>
  </div>
       
      </header>

      <main className="container">
         <h2>Pessoas Cadastradas</h2>
        <div className="topbar">
          
  <div className="topbar floating-container">
   

    <Button variant="primary1" onClick={handleOpenModal}>
      +
    </Button>
  </div>

  {loading && <p>Carregando...</p>}
  {error && <p className="error">{error}</p>}

  {!loading && !error && (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Idade</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {pessoas.map((p) => (
          <tr key={p.id}>
            <td>#{p.id}</td>
            <td>{p.nome}</td>
            <td>{p.idade}</td>
            <td>
              <Button variant="danger" onClick={() => handleDelete(p.id)}>
                Excluir
              </Button>
            </td>
          </tr>
        ))}
        {pessoas.length === 0 && (
          <tr>
            <td colSpan="4">Nenhuma pessoa cadastrada.</td>
          </tr>
        )}
      </tbody>
    </table>
  )}
  </div>
</main>

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <h2>Nova Pessoa</h2>
          <form onSubmit={handleFormSubmit} className="form">
            <label>
              Nome:
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleFormChange}
                required
              />
            </label>
            <label>
              Idade:
              <input
                type="number"
                name="idade"
                value={formData.idade}
                onChange={handleFormChange}
                required
              />
            </label>
            <div className="form-actions">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Salvar
              </Button>
            </div>
          </form>
        </Modal>
      )}

      <footer className="footer">
        <p>© 2025 - Giovanna y Igor </p>
      </footer>
    </div>
  );
}

export default App;

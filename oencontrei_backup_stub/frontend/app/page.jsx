'use client'

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [isLogged, setIsLogged] = useState(false);
  const [view, setView] = useState('home'); // 'home' | 'cadastro'
  const [objetos, setObjetos] = useState([]);
  
  // Login form
  const emailRef = useRef();
  const senhaRef = useRef();
  
  // Cadastro form
  const [nome, setNome] = useState('');
  const [desc, setDesc] = useState('');
  const [local, setLocal] = useState('');
  const fotoRef = useRef();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const logged = localStorage.getItem('logado');
      if (logged === 'true') {
        setIsLogged(true);
        listar();
      }
    }
  }, []);

  const login = () => {
    if (emailRef.current.value && senhaRef.current.value) {
      localStorage.setItem('logado', 'true');
      setIsLogged(true);
      listar();
    }
  };

  const listar = async () => {
    try {
      const res = await fetch('/api/objetos');
      const data = await res.json();
      setObjetos(data);
    } catch (err) {
      console.error(err);
    }
  };

  const cadastrar = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', desc);
    formData.append('local', local);
    
    if (fotoRef.current.files[0]) {
      formData.append('foto', fotoRef.current.files[0]);
    }

    try {
      await fetch('/api/objetos', {
        method: 'POST',
        body: formData
      });
      setView('home');
      listar();
      
      // Reset
      setNome('');
      setDesc('');
      setLocal('');
    } catch (err) {
      console.error(err);
    }
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
          <div className="space-y-4">
            <input ref={emailRef} type="email" placeholder="Email" className="w-full border p-2 rounded text-gray-800" />
            <input ref={senhaRef} type="password" placeholder="Senha" className="w-full border p-2 rounded text-gray-800" />
            <button onClick={login} className="w-full bg-blue-600 text-white font-bold py-2 rounded mb-2 hover:bg-blue-700">Entrar</button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'cadastro') {
    return (
      <div className="min-h-screen p-8 bg-gray-50 text-gray-800">
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-6">Novo Objeto</h2>
          <form onSubmit={cadastrar} className="space-y-4">
            <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required className="w-full border p-2 rounded text-gray-800" />
            <input placeholder="Descrição" value={desc} onChange={e => setDesc(e.target.value)} required className="w-full border p-2 rounded text-gray-800" />
            <input placeholder="Local" value={local} onChange={e => setLocal(e.target.value)} required className="w-full border p-2 rounded text-gray-800" />
            <input type="file" ref={fotoRef} className="w-full border p-2 rounded text-gray-800" />
            
            <div className="flex space-x-4 pt-4">
              <button type="submit" className="flex-1 bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700">Salvar</button>
              <button type="button" onClick={() => setView('home')} className="flex-1 bg-gray-400 text-white font-bold py-2 rounded hover:bg-gray-500">Voltar</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Objetos Perdidos</h2>
          <button onClick={() => setView('cadastro')} className="bg-blue-600 text-white px-4 py-2 font-bold rounded hover:bg-blue-700">+ Cadastrar</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {objetos.length === 0 && <p className="text-gray-500">Nenhum objeto encontrado.</p>}
          {objetos.map(item => (
            <div key={item.id} className="bg-white p-4 rounded shadow overflow-hidden">
              <h3 className="text-xl font-bold mb-2">{item.nome}</h3>
              <p className="text-gray-600 mb-2 truncate">{item.descricao}</p>
              <p className="text-sm mb-4"><b>Local:</b> {item.local || "Não informado"}</p>
              {item.foto && (
                <img src={`/api/uploads/${item.foto}`} alt={item.nome} className="w-full h-48 object-cover rounded" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

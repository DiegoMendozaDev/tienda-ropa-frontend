import React, { useEffect, useState } from 'react';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  marca: string;
  categoria: number;
  foto: string;
  stock: number;
}

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  roles: Array<string>;
  direccion: string,
  codigo_postal: number
}

const Admin: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState<number>(0);
  const [nuevadescripcion, setNuevaDesc] = useState('');
  const [nuevaMarca, setNuevaMarca] = useState('');
  const [nuevaCategoria, setNuevaCat] = useState<number>(0);
  const [nuevaFoto, setNuevaFoto] = useState('');
  const [nuevoStock, setNuevoStock] = useState<number>(0);

  const [nombreUsuario, setNombreUsuario] = useState('');
  const [emailUsuario, setEmailUsuario] = useState('');
  const [rolUsuario, setRolUsuario] = useState('');
  const [direccion, setDir] = useState('');
  const [codigo_postal, setCp] = useState<number>(0);

  useEffect(() => {
    fetchProductos();
    fetchUsuarios();
  }, []);

  const fetchProductos = () => {
    fetch('https://tienda-ropa-backend-xku2.onrender.com/api/productos/ver')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('Error al cargar productos:', err));
  };

  const fetchUsuarios = () => {
    fetch('https://tienda-ropa-backend-xku2.onrender.com/api/usuario/ver')
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error('Error al cargar usuarios:', err));
  };

  const agregarProducto = () => {
    fetch('https://tienda-ropa-backend-xku2.onrender.com/api/productos/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nuevoNombre,
        precio: nuevoPrecio,
        descripcion: nuevadescripcion,
        marca: nuevaMarca,
        categoria: nuevaCategoria,
        foto: nuevaFoto,
        stock: nuevoStock,
      }),
    }).then(() => {
      setNuevoNombre('');
      setNuevoPrecio(0);
      setNuevaDesc('');
      setNuevaMarca('');
      setNuevaCat(0);
      setNuevaFoto('');
      setNuevoStock(0);
      fetchProductos();
    });
  };

  const editarProducto = (id: number, nombre: string, precio: number, descripcion: string, marca: string, categoria: number, foto: string, stock: number) => {
    fetch(`https://tienda-ropa-backend-xku2.onrender.com/api/productos/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, precio, descripcion, marca, categoria, foto, stock }),
    }).then(() => fetchProductos());
  };

  const eliminarProducto = (id: number) => {
    fetch(`https://tienda-ropa-backend-xku2.onrender.com/api/productos/delete/${id}`, {
      method: 'DELETE',
    }).then(() => fetchProductos());
  };

  const agregarUsuario = () => {
    fetch('https://tienda-ropa-backend-xku2.onrender.com/api/usuario/crear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nombreUsuario,
        email: emailUsuario,
        roles: rolUsuario,
        direccion: direccion,
        codigo_postal : codigo_postal
        
      }),
    }).then(() => {
      setNombreUsuario('');
      setEmailUsuario('');
      setRolUsuario('');
      setDir('');
      setCp(0);
      fetchUsuarios();
    });
  };

  const editarUsuario = (id: number, nombre: string, email: string, roles: Array<string>, direccion:string, codigo_postal:number) => {
    fetch(`https://tienda-ropa-backend-xku2.onrender.com/api/usuario/editar/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, roles, direccion, codigo_postal }),
    }).then(() => fetchUsuarios());
  };

  const eliminarUsuario = (id: number) => {
    fetch(`https://tienda-ropa-backend-xku2.onrender.com/api/usuario/eliminar/${id}`, {
      method: 'DELETE',
    }).then(() => fetchUsuarios());
  };
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Administrador de Productos</h1>

      <h2>Agregar nuevo producto</h2>
      {/* Inputs de productos */}
      <input type="text" placeholder="Nombre..." value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} />
      <input type="number" placeholder="Precio..." value={nuevoPrecio} onChange={e => setNuevoPrecio(Number(e.target.value))} />
      <input type="text" placeholder="Descripción..." value={nuevadescripcion} onChange={e => setNuevaDesc(e.target.value)} />
      <input type="text" placeholder="Marca..." value={nuevaMarca} onChange={e => setNuevaMarca(e.target.value)} />
      <input type="number" placeholder="Categoría..." value={nuevaCategoria} onChange={e => setNuevaCat(Number(e.target.value))} />
      <input type="text" placeholder="Foto..." value={nuevaFoto} onChange={e => setNuevaFoto(e.target.value)} />
      <input type="number" placeholder="Stock..." value={nuevoStock} onChange={e => setNuevoStock(Number(e.target.value))} />
      <button onClick={agregarProducto}>Agregar</button>

      <h2>Lista de productos</h2>
      <ul>
        {productos.map(prod => (
          <li key={prod.id}>
            {/* Inputs de edición para productos */}
            <input defaultValue={prod.nombre} onBlur={e => editarProducto(prod.id, e.target.value, prod.precio, prod.descripcion, prod.marca, prod.categoria, prod.foto, prod.stock)} />
            <input defaultValue={prod.precio} onBlur={e => editarProducto(prod.id, prod.nombre, Number(e.target.value), prod.descripcion, prod.marca, prod.categoria, prod.foto, prod.stock)} />
            <input defaultValue={prod.descripcion} onBlur={e => editarProducto(prod.id, prod.nombre, prod.precio, e.target.value, prod.marca, prod.categoria, prod.foto, prod.stock)} />
            <input defaultValue={prod.marca} onBlur={e => editarProducto(prod.id, prod.nombre, prod.precio, prod.descripcion, e.target.value, prod.categoria, prod.foto, prod.stock)} />
            <input defaultValue={prod.categoria} onBlur={e => editarProducto(prod.id, prod.nombre, prod.precio, prod.descripcion, prod.marca, Number(e.target.value), prod.foto, prod.stock)} />
            <input defaultValue={prod.foto} onBlur={e => editarProducto(prod.id, prod.nombre, prod.precio, prod.descripcion, prod.marca, prod.categoria, e.target.value, prod.stock)} />
            <input defaultValue={prod.stock} onBlur={e => editarProducto(prod.id, prod.nombre, prod.precio, prod.descripcion, prod.marca, prod.categoria, prod.foto, Number(e.target.value))} />
            <button onClick={() => eliminarProducto(prod.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      <hr />

      <h1>Administrador de Usuarios</h1>

      <h2>Agregar nuevo usuario</h2>
      <input type="text" placeholder="Nombre..." value={nombreUsuario} onChange={e => setNombreUsuario(e.target.value)} />
      <input type="email" placeholder="Email..." value={emailUsuario} onChange={e => setEmailUsuario(e.target.value)} />
      <input type="text" placeholder="Rol..." value={rolUsuario} onChange={e => setRolUsuario(e.target.value)} />
      <input type="text" placeholder="Dirección..." value={direccion} onChange={e => setDir(e.target.value)} />
      <input type="text" placeholder="Codigo Postal..." value={codigo_postal} onChange={e => setCp(Number(e.target.value))} />
      <button onClick={agregarUsuario}>Agregar Usuario</button>

      <h2>Lista de usuarios</h2>
      <ul>
        {usuarios.map(user => (
          <li key={user.id}>
            <input defaultValue={user.nombre} onBlur={e => editarUsuario(user.id, e.target.value, user.email, user.roles, user.direccion, user.codigo_postal)} />
            <input defaultValue={user.email} onBlur={e => editarUsuario(user.id, user.nombre, e.target.value, user.roles, user.direccion, user.codigo_postal)} />
            <input defaultValue={user.roles} onBlur={e => editarUsuario(user.id, user.nombre, user.email, Array(e.target.value), user.direccion, user.codigo_postal)} />
            <input defaultValue={user.direccion} onBlur={e => editarUsuario(user.id, user.nombre, user.email, user.roles, e.target.value, user.codigo_postal)} />
            <input defaultValue={user.codigo_postal} onBlur={e => editarUsuario(user.id, user.nombre, user.email, user.roles, user.direccion, Number(e.target.value))} />
            <button onClick={() => eliminarUsuario(user.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;

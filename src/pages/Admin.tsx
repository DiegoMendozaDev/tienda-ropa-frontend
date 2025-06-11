import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
  
interface Producto {
  id: number,
  nombre: string,
  precio: number,
  descripcion: string,
  marca: string,
  id_categoria: number,
  foto: string,
  stock: number,
  unidades_vendidas: number,
  genero: string
}

interface Usuario {
  id: number;
  nombre: string,
  email: string,
  contrasena: string,
  roles: Array<string>,
  direccion: string,
  codigo_postal: number,
  terms: boolean
}


interface Categoria {
  id_categoria: number
  nombre: string,
  descripcion: string
}

const Admin: React.FC = () => {
  const navigate = useNavigate();

  // Helper para leer cookies
  function getCookieValue(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }
  const id = Number(getCookieValue("id_usuario"));
  // Chequeo de rol
  useEffect(() => {
    const rolesCookie = getCookieValue('rol') || 'user';
    if (!rolesCookie.includes('admin')) {
      // no es admin: lo redirijo al home
      navigate('/', { replace: true });
    }
  }, [navigate]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [categoria, setCategoria] = useState<Categoria[]>([]);

  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState<number>(0);
  const [nuevadescripcion, setNuevaDesc] = useState('');
  const [nuevaMarca, setNuevaMarca] = useState('');
  const [nuevaCategoria, setNuevaCat] = useState<number>(0);
  const [nuevaFoto, setNuevaFoto] = useState('');
  const [nuevoStock, setNuevoStock] = useState<number>(0);
  const [genero, setGenero] = useState('');

  const [nombreUsuario, setNombreUsuario] = useState('');
  const [emailUsuario, setEmailUsuario] = useState('');
  const [contrasena, setPwdUsuario] = useState('');
  const [Rcontrasena, setRPwdUsuario] = useState('');
  const [rolUsuario, setRolUsuario] = useState('');
  const [direccion, setDir] = useState('');
  const [codigo_postal, setCp] = useState('');
  const [Terms, setTerms] = useState<boolean>(false);

  const [NombreCat, setNombreCat] = useState('')
  const [DescCat, setDescCat] = useState('')


  const [categorias, setCategorias] = useState<{ [key: number]: string }>({});



  useEffect(() => {
    const cargarCategorias = async () => {
      const nuevasCategorias: { [key: number]: string } = {};
      const idsUnicos = [...new Set(categoria.map(p => p.id_categoria))];
      console.log(idsUnicos)
      await Promise.all(idsUnicos.map(async id => {
        const nombre = await fetchCat(id);
        console.log("Nombre: " + nombre)
        nuevasCategorias[id] = nombre;
      }));
      console.log(nuevasCategorias)
      setCategorias(nuevasCategorias);
    };

    cargarCategorias();
  }, [productos]);

  useEffect(() => {
    fetchProductos();
    fetchUsuarios();

    fetchCategoria()
  }, []);

  const fetchCategoria = () => {
    fetch('https://tienda-ropa-backend-xku2.onrender.com/api/categoria/ver')
      .then(res => res.json())
      .then(data => setCategoria(data))
      .catch(err => console.error('Error al cargar productos:', err));
  } 
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
  const fetchCat = async (id: number): Promise<string> => {
    const res = await fetch(`https://tienda-ropa-backend-xku2.onrender.com/api/categoria/ver_categoria/${id}`);
    const data = await res.json();

    const primeraCategoria = data[0]; // 👈 accede a la primera posición
    if (!primeraCategoria || !primeraCategoria.nombre) {
      console.error("Categoría no válida", data);
      return 'Categoría desconocida';
    }

    return primeraCategoria.nombre; // ✅ devuelve el string correcto
  };

  // const fetchCat = (id: number) => {
  //   fetch(`https://tienda-ropa-backend-xku2.onrender.com/api/categoria/ver_categoria/${id}`)
  //     .then(res => res.json())
  //     .then(data => console.log(data))
  //     .catch(err => console.error('Error al cargar usuarios:', err));
  // };

const agregarProducto = () => {
    fetch('https://tienda-ropa-backend-xku2.onrender.com/api/productos/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nuevoNombre,
        descripcion: nuevadescripcion,
        precio: nuevoPrecio,
        marca: nuevaMarca,
        id_categoria: nuevaCategoria,
        foto: nuevaFoto,
        stock: nuevoStock,
        unidades_vendidas: 0,
        genero: genero


      }),
    }).then(() => {
      console.log({
        nombre: nuevoNombre,
        descripcion: nuevadescripcion,
        precio: nuevoPrecio,
        marca: nuevaMarca,
        id_categoria: nuevaCategoria,
        foto: nuevaFoto,
        stock: nuevoStock
      })
      setNuevoNombre('');
      setNuevoPrecio(0);
      setNuevaDesc('');
      setNuevaMarca('');
      setNuevaCat(0);
      setNuevaFoto('');
      setNuevoStock(0);
      setGenero('');
      fetchProductos();
    }).catch(err => console.error(err));
  };

  const agregarCategoria = () => {
    fetch('https://tienda-ropa-backend-xku2.onrender.com/api/categoria/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: NombreCat,
        descripcion: DescCat,

      }),
    }).then(() => {
      console.log({
        nombre: NombreCat,
        descripcion: DescCat,
      })
      setNombreCat('');
      setDescCat('');
    }).catch(err => console.error(err));
  };

  const editarProducto = (id: number, nombre: string, precio: number, descripcion: string, marca: string, id_categoria: number, foto: string, stock: number, genero: string) => {
    fetch(`https://tienda-ropa-backend-xku2.onrender.com/api/productos/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, precio, descripcion, marca, id_categoria, foto, stock, genero }),
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
        contrasena: contrasena,
        repeatContrasena: Rcontrasena,
        roles: rolUsuario,
        direccion: direccion,
        codigo_postal: codigo_postal,
        terms: Terms

      }),
    }).then(() => {
      console.log({
        nombre: nombreUsuario,
        email: emailUsuario,
        contrasena: contrasena,
        repeatContrasena: Rcontrasena,
        roles: rolUsuario,
        direccion: direccion,
        codigo_postal: codigo_postal,
        terms: Terms

      })
      setNombreUsuario('');
      setEmailUsuario('');
      setPwdUsuario('');
      setRPwdUsuario('');
      setRolUsuario('');
      setDir('');
      setCp('');
      setTerms(false);
      fetchUsuarios();
    }).catch(err => console.error(err));
  };

  const editarUsuario = (id: number, nombre: string, email: string, direccion: string, codigo_postal: number) => {
    fetch(`https://tienda-ropa-backend-xku2.onrender.com/api/usuario/editar/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, contrasena, direccion, codigo_postal }),
    }).then(() => fetchUsuarios());
  };

  const eliminarUsuario = (id: number) => {
    fetch(`https://tienda-ropa-backend-xku2.onrender.com/api/usuario/eliminar/${id}`, {
      method: 'DELETE',
    }).then(() => fetchUsuarios());
  };

    const eliminarCategoria = (id: number) => {
    fetch(`https://tienda-ropa-backend-xku2.onrender.com/api/categoria/delete/${id}`, {
      method: 'DELETE',
    }).then(() => fetchCategoria());
  };

  const editarCategoria = (id: number, nombre: string, descripcion: string) => {
    fetch(`https://tienda-ropa-backend-xku2.onrender.com/api/categoria/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({nombre, descripcion}),
    }).then(() => fetchCategoria());
  };
  

 
  return (
    <>
      <div style={{ padding: '2rem' }}>
        <h1>Administrador de Productos</h1>

        <h2>Agregar nuevo producto</h2>
        {/* Inputs de productos */}
        <input type="text" placeholder="Nombre..." value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} />
        <input type="text" placeholder="Descripción..." value={nuevadescripcion} onChange={e => setNuevaDesc(e.target.value)} />
        <br></br>
        Precio: <input min="0" type="number" placeholder="Precio..." value={nuevoPrecio} onChange={e => setNuevoPrecio(Number(e.target.value))} />
        <input type="text" placeholder="Marca..." value={nuevaMarca} onChange={e => setNuevaMarca(e.target.value)} />
        <br></br>
        <select
          value={nuevaCategoria}
          onChange={e => setNuevaCat(Number(e.target.value))} // aquí dejamos string, sin convertir a Number aún
          required
        >
          <option value="" disabled>
            Selecciona una categoría
          </option>
          {Object.entries(categorias).map(([id, nombre]) => (
            <option key={id} value={id}>
              {nombre}
            </option>
          ))}
        </select>


        {/* Foto: <input type="file" placeholder="Foto..." value={nuevaFoto} onChange={e => setNuevaFoto(e.target.value)} /> */}

Foto: <input type="text" placeholder="Foto..." value={nuevaFoto} onChange={e => setNuevaFoto(e.target.value)} />

        <br></br>
        stock: <input min="0" type="number" placeholder="Stock..." value={nuevoStock} onChange={e => setNuevoStock(Number(e.target.value))} />
        <input type="text" placeholder="Género..." value={genero} onChange={e => setGenero(e.target.value)} />
        <button onClick={agregarProducto}>Agregar</button>

        <h2>Lista de productos</h2>
        <ul style={{ listStyleType: 'none' }}>
          {productos.map(prod => (
            <li key={prod.id}>
              <input defaultValue={prod.nombre} onBlur={e => editarProducto(prod.id, e.target.value, prod.precio, prod.descripcion, prod.marca, prod.id_categoria, prod.foto, prod.stock, prod.genero)} />
              <input min="0" defaultValue={prod.precio} onBlur={e => editarProducto(prod.id, prod.nombre, Number(e.target.value), prod.descripcion, prod.marca, prod.id_categoria, prod.foto, prod.stock, prod.genero)} />
              <input defaultValue={prod.descripcion} onBlur={e => editarProducto(prod.id, prod.nombre, prod.precio, e.target.value, prod.marca, prod.id_categoria, prod.foto, prod.stock, prod.genero)} />
              <input defaultValue={prod.marca} onBlur={e => editarProducto(prod.id, prod.nombre, prod.precio, prod.descripcion, e.target.value, prod.id_categoria, prod.foto, prod.stock, prod.genero)} />
              <select
                value={prod.id_categoria}
                onChange={e =>
                  editarProducto(prod.id, prod.nombre, prod.precio, prod.descripcion, prod.marca, Number(e.target.value), prod.foto, prod.stock, prod.genero
                  )
                }
              >
                <option value={prod.id_categoria}>
                  {categorias[prod.id_categoria] || 'Cargando...'}
                </option>
                {Object.entries(categorias)
                  .filter(([id]) => Number(id) !== prod.id_categoria)
                  .map(([id, nombre]) => (
                    <option key={id} value={id}>
                      {nombre}
                    </option>
                  ))}
              </select>
              <input defaultValue={prod.foto} onBlur={e => editarProducto(prod.id, prod.nombre, prod.precio, prod.descripcion, prod.marca, prod.id_categoria, e.target.value, prod.stock, prod.genero)} />
              <input min="0" defaultValue={prod.stock} onBlur={e => editarProducto(prod.id, prod.nombre, prod.precio, prod.descripcion, prod.marca, prod.id_categoria, prod.foto, Number(e.target.value), prod.genero)} />
              <input defaultValue={prod.genero} onBlur={e => editarProducto(prod.id, prod.nombre, prod.precio, prod.descripcion, prod.marca, prod.id_categoria, prod.foto, prod.stock, e.target.value)} />
              <button onClick={() => eliminarProducto(prod.id)}>Eliminar</button>
            </li>
          ))}

        </ul>

        <hr />

        <h1>Administrador de Usuarios</h1>

        <h2>Agregar nuevo usuario</h2>
        <input type="text" placeholder="Nombre..." value={nombreUsuario} onChange={e => setNombreUsuario(e.target.value)} />
        <input type="email" placeholder="Email..." value={emailUsuario} onChange={e => setEmailUsuario(e.target.value)} />
        <input type="password" placeholder="Contraseña..." value={contrasena} onChange={e => setPwdUsuario(e.target.value)} />
        <input type="password" placeholder="Repite la Contraseña..." value={Rcontrasena} onChange={e => setRPwdUsuario(e.target.value)} />
        <input type="text" placeholder="Rol..." value={rolUsuario} onChange={e => setRolUsuario(e.target.value)} />
        <input type="text" placeholder="Dirección..." value={direccion} onChange={e => setDir(e.target.value)} />
        <input type="text" placeholder="Codigo Postal..." value={codigo_postal} onChange={e => setCp(e.target.value)} />
        Aceptar los términos: <input type="checkbox" placeholder="Terms..." checked={Terms} onChange={e => setTerms(Boolean(e.target.value))} />
        <button onClick={agregarUsuario}>Agregar Usuario</button>

        <h2>Lista de usuarios</h2>
        <ul style={{ listStyleType: 'none' }}>
          {usuarios.filter(user => user.id != id).map(user => (
            <li key={user.id}>
              <input defaultValue={user.nombre} onBlur={e => editarUsuario(user.id, e.target.value, user.email, user.direccion, user.codigo_postal)} />
              <input defaultValue={user.email} onBlur={e => editarUsuario(user.id, user.nombre, e.target.value, user.direccion, user.codigo_postal)} />
              <input defaultValue={user.direccion} onBlur={e => editarUsuario(user.id, user.nombre, user.email, e.target.value, user.codigo_postal)} />
              <input defaultValue={user.codigo_postal} onBlur={e => editarUsuario(user.id, user.nombre, user.email, user.direccion, Number(e.target.value))} />
              <button onClick={() => eliminarUsuario(user.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
          <h1>Administrador de categorias</h1>
          <h2>Lista de usuarios</h2>
        <ul style={{ listStyleType: 'none' }}>
          {categoria.map(cat => (
            <li key={cat.id_categoria}>
              <input defaultValue={cat.nombre} onBlur={e => editarCategoria(cat.id_categoria, e.target.value, cat.descripcion)} />
              <input defaultValue={cat.descripcion} onBlur={e => editarCategoria(cat.id_categoria, cat.nombre, e.target.value)} />
              <button onClick={() => eliminarCategoria(cat.id_categoria)}>Eliminar</button>
            </li>
          ))}
        </ul>
        <h2>Agregar nueva Categoria</h2>
        <input type="text" placeholder="Nombre..." value={NombreCat} onChange={e => setNombreCat(e.target.value)} />
        <input type="text" placeholder='Descripción...' value={DescCat} onChange={e => setDescCat(e.target.value)} />

        <button onClick={agregarCategoria}>Agregar Categoria</button>
      </div>
      <button
        onClick={() => window.location.href = "/"}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        ← Volver atrás
      </button>
    </>
  );
};

export default Admin;

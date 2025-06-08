// src/pages/PerfilUsuario.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
    Container,
    Form,
    Button,
    Spinner,
    Alert
} from "react-bootstrap";

// Interfaz que describe los datos de usuario
interface Usuario {
    id: number;
    nombre: string;
    email: string;
    direccion: string;
    codigo_postal: string;
}

// Componente de perfil de usuario
function PerfilUsuario() {
    const [cookies] = useCookies(["user", "id_usuario"]);
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState<Usuario>({
        id: 0,
        nombre: "",
        email: "",
        direccion: "",
        codigo_postal: ""
    });
    const [contrasenaNueva, setContrasenaNueva] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Al cargar el componente, obtenemos el ID de usuario desde cookie y
    // hacemos fetch a la API para prellenar los datos del formulario.
    useEffect(() => {
        const idUsuario = cookies.id_usuario;
        if (!idUsuario) {
            // Si no hay id_usuario en cookie redirigimos al login
            navigate("/login");
            return;
        }

        async function fetchUsuario() {
            try {
                const res = await fetch(
                    "https://tienda-ropa-backend-xku2.onrender.com/api/usuario/ver",
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" }
                    }
                );
                if (!res.ok) {
                    throw new Error(`Error ${res.status}: ${res.statusText}`);
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const data: any[] = await res.json();
                // Buscamos el objeto usuario cuyo id coincida con idUsuario
                const u = data.find((uObj) => uObj.id === Number(idUsuario));
                if (!u) {
                    throw new Error("Usuario no encontrado");
                }
                setUsuario({
                    id: u.id,
                    nombre: u.nombre,
                    email: u.email,
                    direccion: u.direccion,
                    codigo_postal: u.codigo_postal
                });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.error("Error al cargar datos de usuario:", err);
                setError("No se pudieron cargar los datos de tu perfil.");
            } finally {
                setLoading(false);
            }
        }

        fetchUsuario();
    }, [cookies.id_usuario, navigate]);

    // Manejador de cambio en campos de texto
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setUsuario((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Enviar formulario: hace PUT a /api/usuario/editar/{id}
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccessMsg(null);

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const payload: any = {
                nombre: usuario.nombre,
                email: usuario.email,
                direccion: usuario.direccion,
                codigo_postal: usuario.codigo_postal
            };
            // Si se ingresó nueva contraseña, la incluimos
            if (contrasenaNueva.trim().length > 0) {
                payload.contrasena = contrasenaNueva;
            }

            const res = await fetch(
                `https://tienda-ropa-backend-xku2.onrender.com/api/usuario/editar/${usuario.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                }
            );
            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || res.statusText);
            }
            setSuccessMsg("Perfil actualizado correctamente.");
            // Si el email cambió, actualizar cookie y redirigir a home
            if (cookies.user !== usuario.email) {
                document.cookie = `user=${encodeURIComponent(
                    usuario.email
                )}; path=/; max-age=3600`;
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("Error al guardar perfil:", err);
            setError("No se pudo actualizar tu perfil. Intenta de nuevo.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Container className="py-4 text-center">
                <Spinner animation="border" role="status" />
            </Container>
        );
    }

    return (
        <Container className="py-4" style={{ maxWidth: "600px" }}>
            <h2 className="mb-4 text-center">Mi Perfil</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {successMsg && <Alert variant="success">{successMsg}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formNombre">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        name="nombre"
                        value={usuario.nombre}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Correo electrónico</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={usuario.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formDireccion">
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control
                        type="text"
                        name="direccion"
                        value={usuario.direccion}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCodigoPostal">
                    <Form.Label>Código Postal</Form.Label>
                    <Form.Control
                        type="text"
                        name="codigo_postal"
                        value={usuario.codigo_postal}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formContrasena">
                    <Form.Label>Nueva Contraseña (opcional)</Form.Label>
                    <Form.Control
                        type="password"
                        value={contrasenaNueva}
                        onChange={(e) => setContrasenaNueva(e.target.value)}
                        placeholder="Deja vacío si no la quieres cambiar"
                    />
                </Form.Group>

                <div className="d-flex justify-content-end">
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />{" "}
                                Guardando…
                            </>
                        ) : (
                            "Guardar Cambios"
                        )}
                    </Button>
                </div>
            </Form>
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
        </Container>
    );
}

export default PerfilUsuario;

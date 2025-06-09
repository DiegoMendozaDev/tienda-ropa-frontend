import { useState } from 'react';
import { Formik, Form as FormikForm, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { postFormData } from '../services/PostService';
import Spinner from 'react-bootstrap/Spinner';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

interface FormValues {
  nombre: string;
  email: string;
  contrasena: string;
  repeatContrasena: string;
  direccion: string;
  codigo_postal: number | '';
  terms: boolean;
}
interface ApiResponse {
  message: string;
}
const validationSchema = yup.object().shape({
  nombre: yup.string().required('El nombre es obligatorio'),
  email: yup.string().email('Email inválido').required('El email es obligatorio'),
  contrasena: yup.string().required('La contraseña es obligatoria'),
  repeatContrasena: yup.string()
    .oneOf([yup.ref('contrasena')], 'Las contraseñas deben coincidir')
    .required('Repite la contraseña'),
  direccion: yup.string().required('La dirección es obligatoria'),
  codigo_postal: yup.number()
    .typeError('Debe ser un número')
    .required('El código postal es obligatorio')
    .positive('Debe ser positivo')
    .integer('Debe ser un entero'),
  terms: yup.bool().oneOf([true], 'Debes aceptar los términos'),
});

const initialValues: FormValues = {
  nombre: '',
  email: '',
  contrasena: '',
  repeatContrasena: '',
  direccion: '',
  codigo_postal: 0,
  terms: false,
};

function FormRegister() {
  const navigate = useNavigate();
  // @ts-expect-error: esta variable se declara para un futuro uso
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [responseData, setResponseData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // @ts-expect-error: esta variable se declara para un futuro uso
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies([  'user','id_usuario','rol']);

  const handleSubmit = async (
  values: FormValues,
  { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    setError(null);
    setIsLoading(true);

    try {
      // 1) Crear usuario
      await postFormData<FormValues, ApiResponse>(
        'https://tienda-ropa-backend-xku2.onrender.com/api/usuario/crear',
        values
      );
      // guardar email en cookie
      setCookie('user', values.email, { path: '/', maxAge: 3600 });

      // 2) Obtener id_usuario y rol
      const res2 = await fetch(
        'https://tienda-ropa-backend-xku2.onrender.com/api/usuario/ver_usuario',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: values.email })
        }
      );
      if (!res2.ok) throw new Error('No se pudo obtener id_usuario');
      const info = await res2.json();
      setCookie('id_usuario', info.id, { path: '/', maxAge: 3600 });
      setCookie('rol', info.rol, { path: '/', maxAge: 3600 });

      // 3) Finalmente, redirigir a home
      navigate('/');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err instanceof TypeError) {
        setError('No se pudo conectar con el servidor…');
      } else {
        try {
          const parsed = JSON.parse(err.message);
          setError(parsed.error || 'Error desconocido');
        } catch {
          setError(err.message);
        }
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h1>Registrarse</h1>
          <Formik
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, handleChange, values, errors }) => (
              <FormikForm noValidate>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={values.nombre}
                    placeholder="Jane Doe"
                    onChange={handleChange}
                    isInvalid={!!errors.nombre}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nombre}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text>@</InputGroup.Text>
                    <Form.Control
                      placeholder="Email"
                      type="email"
                      name='email'
                      value={values.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid" tooltip>
                      {errors.email}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text>🔒</InputGroup.Text>
                    <Form.Control
                      type="password"
                      name="contrasena"
                      value={values.contrasena}
                      onChange={handleChange}
                      isInvalid={!!errors.contrasena}
                    />
                    <Form.Control.Feedback type="invalid" tooltip>
                      {errors.contrasena}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Repite la contraseña</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text>🔒</InputGroup.Text>
                    <Form.Control
                      type="password"
                      name="repeatContrasena"
                      value={values.repeatContrasena}
                      onChange={handleChange}
                      isInvalid={!!errors.repeatContrasena}
                    />
                    <Form.Control.Feedback type="invalid" tooltip>
                      {errors.repeatContrasena}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    name="direccion"
                    value={values.direccion}
                    onChange={handleChange}
                    isInvalid={!!errors.direccion}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.direccion}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Código Postal</Form.Label>
                  <Form.Control
                    type="text"
                    name="codigo_postal"
                    value={values.codigo_postal}
                    onChange={handleChange}
                    isInvalid={!!errors.codigo_postal}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.codigo_postal}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="terms"
                    label="Acepto términos y condiciones"
                    onChange={handleChange}
                    isInvalid={!!errors.terms}
                    feedback={errors.terms}
                    feedbackType="invalid"
                  />
                </Form.Group>
                {isSubmitting || isLoading ? (
                  <Spinner animation="grow" size="sm" />
                ) : (
                  <Row>
                    <Col>
                      <Button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                      // onSubmit={}
                      >
                        {isSubmitting || isLoading ? <Spinner animation="grow" /> : 'Register'}
                      </Button>
                    </Col>
                    <Col><a href="/"><Button className="p-2" variant="outline-secondary">Volver</Button></a></Col>
                  </Row>
                )}
              </FormikForm>
            )}
          </Formik>
          {error && <p className="text-danger mt-3">{error}</p>}
        </div>
      </div>
    </Container>
  );
}

export default FormRegister;
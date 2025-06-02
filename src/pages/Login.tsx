import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import * as yup from 'yup';
import { Formik, Form as FormikForm, FormikHelpers } from 'formik';
import { useState } from 'react';
import { postFormData } from '../services/PostService';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import { useCookies } from 'react-cookie';

interface FormValues {
  email: string;
  contrasena: string;
  rememberMe: boolean;
}
interface ApiResponse {
  message: string;
}
const validationSchema = yup.object().shape({
  email: yup.string().email('Email inválido').required('El email es obligatorio'),
  contrasena: yup.string().required('La contraseña es obligatoria'),
});
const initialValues: FormValues = {
  email: '',
  contrasena: '',
  rememberMe: false,
};
function FormLogin() {
  const navigate = useNavigate();
  // @ts-expect-error: esta variable se declara para un futuro uso
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [responseData, setResponseData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // @ts-expect-error: esta variable se declara para un futuro uso
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await postFormData<FormValues, ApiResponse>(
        'https://127.0.0.1:8000/api/usuario/comprobar_usuario',
        values
      );
      setResponseData(result);
      setCookie('user', values.email, { path: '/', maxAge: 3600 });
      navigate('/')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err instanceof TypeError) {
        setError('No se pudo conectar con el servidor. Revisa tu conexión o la configuración del CORS.');
      } else {
        const errorObj = JSON.parse(err.message);
        setError(errorObj.error || 'Error desconocido');
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    } try {
      function getCookieValue(name: string): string | null {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
      }
      // eslint-disable-next-line prefer-const
      let value = getCookieValue("user")
      fetch('https://127.0.0.1:8000/api/usuario/ver_usuario', {
        method: 'POST',
        body: JSON.stringify({
          email: value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json()) // conviertes a JSON aquí
        .then(data => {
          // Ahora sí puedes acceder a data.id
          document.cookie = `id=${encodeURIComponent(data.id)}; path=/; max-age=3600`;
          console.log('Usuario:', data);
        })


    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };
  return (
    <Container className="py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h1>Iniciar Sesión</h1>
          <Formik
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, handleChange, values, errors }) => (
              <FormikForm noValidate>
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text>@</InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="email"
                      value={values.email}
                      placeholder="Email"
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                      required
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
                      placeholder="Contraseña"
                      onChange={handleChange}
                      isInvalid={!!errors.contrasena}
                      required
                    />
                    <Form.Control.Feedback type="invalid" tooltip>
                      {errors.contrasena}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formRememberMe">
                  <Form.Check
                    type="checkbox"
                    name="rememberMe"
                    label="Recuérdame"
                    checked={values.rememberMe}
                    onChange={handleChange}
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
                      >
                        {isSubmitting || isLoading ? (
                          <Spinner animation="grow" size="sm" />
                        ) : (
                          'Login'
                        )}
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        variant="outline-secondary"
                        href="/"
                        className="p-2"
                      >
                        Volver
                      </Button>

                    </Col>
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

export default FormLogin;
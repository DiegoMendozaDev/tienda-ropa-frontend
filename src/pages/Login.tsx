import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import * as formik from 'formik';
import * as yup from 'yup';

function FormLogin() {
  const { Formik } = formik;

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
    repeatPassword: yup.string().required(),
    rememberMe: yup.bool(),
  });
  return (
    <Formik
      validationSchema={schema}
      initialValues={{
        email: '',
        password: '',
        rememberMe: false,
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ handleSubmit, handleChange, values, errors }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label htmlFor="inlineFormInputGroupUsername">
              Email address
            </Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text>@</InputGroup.Text>
              <Form.Control
                id="inlineFormInputGroupEmail"
                placeholder="Email"
                aria-describedby="inputGroupPrepend"
                type="email"
                name='email'
                value={values.email}
                required
                onChange={handleChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Label htmlFor="inlineFormInputGroupPassword">
            Password
          </Form.Label>
          <InputGroup>
            <InputGroup.Text>🔒</InputGroup.Text>
            <Form.Control
              id="inlineFormInputGroupPassword"
              placeholder="Password"
              type="password"
              aria-describedby="inputGroupPrepend"
              name='password'
              value={values.password}
              required
              onChange={handleChange}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid" tooltip>
              {errors.password}
            </Form.Control.Feedback>
          </InputGroup>
          <Form.Group className="mb-3" id="formGridCheckbox">
            <Form.Check
              type="checkbox"
              id="autoSizingCheck2"
              label="rememberMe"
              name='rememberMe'
              checked={values.rememberMe}
              onChange={handleChange}
            />
          </Form.Group>
          <Container>
            <Row>
              <Col><Button type="submit" className="p-2" variant="outline-primary">Login</Button></Col>
              <Col><Button className="p-2" variant="outline-secondary" href="/">Back</Button></Col>
            </Row>
          </Container>
        </Form>
      )}
    </Formik>
  );
}

export default FormLogin;
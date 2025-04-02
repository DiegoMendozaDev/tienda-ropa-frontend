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
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
    repeatPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required(),
    terms: yup.bool().required().oneOf([true], 'Terms must be accepted'),
  });
  return (
    <Formik
      validationSchema={schema}
      initialValues={{
        name: '',
        email: '',
        password: '',
        repeatPassword: '',
        terms: false,
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
            <Form.Label htmlFor="inlineFormInputName">
              Name
            </Form.Label>
            <Form.Control
              required
              type="text"
              name="name"
              id="inlineFormInputName"
              value={values.name}
              placeholder="Jane Doe"
              onChange={handleChange}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
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
              <Form.Control.Feedback type="invalid" tooltip>
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
          <Form.Label htmlFor="inlineFormInputGroupPassword">
            Repeat Password
          </Form.Label>
          <InputGroup>
            <InputGroup.Text>🔒</InputGroup.Text>
            <Form.Control
              id="inlineFormInputGroupRepeatPassword"
              placeholder="Repeat password"
              type="password"
              aria-describedby="inputGroupPrepend"
              name='repeatPassword'
              value={values.repeatPassword}
              required
              onChange={handleChange}
              isInvalid={!!errors.repeatPassword}
            />
            <Form.Control.Feedback type="invalid" tooltip>
              {errors.repeatPassword}
            </Form.Control.Feedback>
          </InputGroup>
          <Form.Group className="mb-3">
            <Form.Check
              required
              name="terms"
              label="Agree to terms and conditions"
              onChange={handleChange}
              isInvalid={!!errors.terms}
              feedback={errors.terms}
              feedbackType="invalid"
              id="validationFormik0"
            />
          </Form.Group>
          <Container>
            <Row>
              <Col><Button type="submit" className="p-2" variant="outline-primary">Login</Button></Col>
              <Col><a href="/"><Button className="p-2" variant="outline-secondary">Back</Button></a></Col>
            </Row>
          </Container>
        </Form>
      )}
    </Formik>
  );
}

export default FormLogin;
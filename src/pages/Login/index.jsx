import { Row, Col, Typography, Form } from 'antd'
import { useNavigate } from 'react-router-dom'
import { loginApi } from '../../api/Auth'
import { LoginBanner, PageLoadingAnimation } from '../../components'
import './style.scss'
import { useEffect, useState } from 'react'
import axiosInstance from '../../api'
import { findKey } from 'lodash'
import { User_Roles } from '../../Constants'
import { useTranslation } from 'react-i18next'
import { getLsObj, updateLs } from '../../utils/localStorage'

const { Title } = Typography

const Login = () => {
  const user = getLsObj('user')
  const token = localStorage.getItem('token')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    if (user.id) {
      const index = findKey(user.roles, (o) => o === User_Roles.Admin)
      // admin
      if (index) {
        navigate('/admin')
      } else {
        navigate('/flights')
      }
    }
    if (user.id && token) {
      navigate(-1)
    }
  }, [])

  const [errTxt, setErrTxt] = useState('')

  const onFinish = async (values) => {
    setIsLoading(true)
    try {
      const { data } = await loginApi(values)
      updateLs('user', data.user)
      axiosInstance.setToken(data.token)
      // Navigate to previous page
      navigate(0)
    } catch (error) {
      setErrTxt('Wrong email or password')
    }
    setIsLoading(false)
  }

  return (
    <>
      {isLoading === true && <PageLoadingAnimation />}
      <div className="login-page">
        <LoginBanner />
        <div className="grid wide">
          <Row justify="center">
            <Col lg={16}>
              <div className="content">
                <div className="box">
                  <Title level={2}>Login</Title>
                  <Form className="form" name="login-form" onFinish={onFinish}>
                    <Form.Item
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: t('login.Please input your email!'),
                        },
                        {
                          type: 'email',
                          message: t('login.Email is not valid'),
                        },
                      ]}
                    >
                      <input
                        type="text"
                        className="form-control"
                        placeholder={t('login.Enter your email')}
                      />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: t('login.Please input your password'),
                        },
                      ]}
                    >
                      <input
                        type="password"
                        className="form-control"
                        placeholder={t('login.Enter password')}
                      />
                    </Form.Item>
                    {errTxt && (
                      <p
                        style={{
                          textAlign: 'right',
                          color: 'var(--ant-error-color)',
                        }}
                      >
                        Wrong email or password
                      </p>
                    )}
                    <div className="form-submit">
                      <button className="btn btn-primary btn-md">
                        {t('login.Login')}
                      </button>
                    </div>
                    <div className="switch">
                      <p>
                        {t("login.Don't have an account?")}{' '}
                        <a href="register.html">{t('login.Register now')}</a>
                      </p>
                    </div>
                  </Form>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Login

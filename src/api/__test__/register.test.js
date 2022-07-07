import axiosInstance from '../'
import MockAdapter from 'axios-mock-adapter'
import { register } from '../Auth/register'

describe('RegisterAPI', () => {
  let mock

  beforeAll(() => {
    mock = new MockAdapter(axiosInstance)
  })

  afterEach(() => {
    mock.reset()
  })

  describe('RegisterApI', () => {
    it('register account with input data', async () => {
      const rs = {
        status: 'success',
      }

      mock
        .onPost(`${process.env.REACT_APP_SERVER_API}/users/register`)
        .reply(200, rs)

      const result = await register({
        username: 'u2fly',
        password: '123',
      })

      expect(mock.history.post[0].url).toEqual(`/users/register`)
      expect(result.data).toEqual(rs)
    })
  })
})

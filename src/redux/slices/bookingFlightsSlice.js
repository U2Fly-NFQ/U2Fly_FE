import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit'
import flightAPI from '../../api/Flight'
import discountInfo from '../../api/Discount'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
const initialState = {
  loadding: false,
  userInformation: {},
  dataFlight: {},
  discountInfo: {
    percent: 0,
  },
  dataRoundTripFlight: {},
  currentMethods: 0,
  priceAfterDiscount: 0,
}
export const getDataFlights = createAsyncThunk(
  'flight/getDataFlights',
  async (idFlight) => {
    const respone = await flightAPI.get(idFlight)
    return respone.data
  }
)

export const getDiscountCheck = createAsyncThunk(
  'flight/getDiscountCheck',
  async (idFlight) => {
    const respone = await discountInfo.getDiscountById(idFlight.idDiscount)
    return respone.data
  }
)
export const getUserDataInBooking = createAsyncThunk(
  'flight/getUserData',
  async (idUser) => {
    const respone = await flightAPI.getUserData(idUser)
    return respone.data
  }
)

export const createBookingFlight = createAsyncThunk(
  'flight/createBooking',
  async (params) => {
    const respone = await flightAPI.createATicket(params)
    return respone.data
  }
)

export const getRoundTripBookingFlight = createAsyncThunk(
  'flight/RoundTripBooking',
  async (idFlight) => {
    const respone = await flightAPI.get(idFlight)
    return respone.data
  }
)
const bookingFlightsSlice = createSlice({
  name: 'filterSlice',
  initialState,
  reducers: {
    addDataIntoBookingFlight: (state, action) => {
      let { apartment, city, country, emailAddress } = action.payload
      state.userInformation = {
        ...state.userInformation,
        ...action.payload,
        dateOfBirth: moment(action.payload.dateTimePicker).format('DD.MM.YYYY'),
      }
    },
    changeCurrentMethod: (state, action) => {
      let value = action.payload
      state.currentMethods = value
    },
  },
  extraReducers: {
    [createBookingFlight.pending]: (state, action) => {
      state.loadding = false
    },
    [createBookingFlight.rejected]: (state, action) => {
      state.loadding = false
      let navigate = useNavigate()
      navigate('/flights')
    },
    [createBookingFlight.fulfilled]: (state, action) => {
      const { status, data } = action.payload
      state.loadding = false
      if (status === 'success') {
        window.location.replace(data.checkoutURL)
      }
    },
    [getUserDataInBooking.pending]: (state, action) => {
      state.loadding = false
    },
    [getUserDataInBooking.rejected]: (state, action) => {
      state.loadding = false
      let navigate = useNavigate()
      navigate('/flights')
    },
    [getUserDataInBooking.fulfilled]: (state, action) => {
      state.loadding = false
      let { data } = action.payload
      // console.log(data)
      state.userInformation = data
    },
    [getDiscountCheck.pending]: (state, action) => {
      state.loadding = false
    },
    [getDiscountCheck.rejected]: (state, action) => {
      state.loadding = false
      state.discountInfo.percent = 0
      let navigate = useNavigate()
      navigate('/flights')
    },
    [getDiscountCheck.fulfilled]: (state, action) => {
      const { status, data } = action.payload
      if (status === 'success') {
        state.discountInfo = data
        let getSeat = current(state.dataFlight).seat
        state.priceAfterDiscount = getSeat.price - getSeat.price * data.percent
      }
    },
    [getDataFlights.pending]: (state) => {
      state.loadding = true
    },
    [getDataFlights.rejected]: (state) => {
      state.loadding = false
      let navigate = useNavigate()
      navigate('/flights')
    },
    [getDataFlights.fulfilled]: (state, action) => {
      state.loadding = false
      // const { status, data } = action.payload
      const data = action.payload

      let allSeatNameAvailable = data.seat.map((item) => item.name)
      let dataSeatChoose = JSON.parse(localStorage.getItem('flight'))
      // if (status === 'success') {
      state.dataFlight = {
        ...data,
        seat: data.seat[
          allSeatNameAvailable.indexOf(dataSeatChoose.setType) < 0
            ? 0
            : allSeatNameAvailable.indexOf(dataSeatChoose.setType)
        ],
      }
      // }
    },
    [getRoundTripBookingFlight.pending]: (state, action) => {
      state.loadding = false
    },
    [getRoundTripBookingFlight.rejected]: (state, action) => {
      state.loadding = false
    },
    [getRoundTripBookingFlight.fulfilled]: (state, action) => {
      state.loadding = false
      const data = action.payload
      console.log(data)
      state.dataRoundTripFlight = {
        ...data,
      }
    },
  },
})
export const { addDataIntoBookingFlight, changeCurrentMethod } =
  bookingFlightsSlice.actions
export default bookingFlightsSlice

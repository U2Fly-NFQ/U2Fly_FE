import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getList } from '../../api/Ticket'
import { getList as getHistory } from '../../api/Ticket/historyBooking'

export const initialState = {
  status: '',
  data: [],
  history: [],
}

const ticketSlice = createSlice({
  name: 'ticketSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch all
      .addCase(fetchTickets.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchTickets.rejected, (state) => {
        state.status = 'error'
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.status = 'idle'
        state.data = action.payload
        // state.data = action.payload.data
      })
      // fetch history booking
      .addCase(fetchHistoryBooking.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchHistoryBooking.rejected, (state) => {
        state.status = 'error'
      })
      .addCase(fetchHistoryBooking.fulfilled, (state, action) => {
        state.status = 'idle'
        state.history = action.payload
      })
  },
})

export default ticketSlice

export const fetchTickets = createAsyncThunk(
  'ticket/fetchTickets',
  async (urlParams) => {
    let response = await getList(urlParams)
    return response.data
  }
)

export const fetchHistoryBooking = createAsyncThunk(
  'ticket/fetchHistoryBooking',
  async (urlParams) => {
    let response = await getHistory(urlParams)
    return response.data
  }
)

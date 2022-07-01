import React from 'react'
import { useSelector } from 'react-redux'
import {
  getDiscountForBookingAirline,
  getInfoFlightInBookingSeat,
} from '../../../redux/selectors'
import './index.scss'
export default function BookingTravelDate() {
  const getPrice = useSelector(getInfoFlightInBookingSeat)
  const getDiscount = useSelector(getDiscountForBookingAirline)
  // let totalValue = getPrice
  console.log(getDiscount)
  return (
    <div className="booking-travel-date">
      <div className="booking-page__container__item__title">
        <h3>Booking amount</h3>
      </div>
      <div className="booking-travel-date__container">
        <ul className="booking-travel-date__container__value">
          <li>
            <div className="booking-travel-date__container__key">
              Adult Price x 1
            </div>
            <div className="booking-travel-date__container__key">
              {'$ ' + getPrice.price}
            </div>
          </li>
          <li>
            <div className="booking-travel-date__container__key">Discount</div>
            <div className="booking-travel-date__container__key">
              - {getDiscount * 100}%
            </div>
          </li>
          <li>
            <div className="booking-travel-date__container__key">Tax</div>
            <div className="booking-travel-date__container__key">5%</div>
          </li>
        </ul>
        <div className="booking-travel-date__container__amount">
          <div className="booking-travel-date__container__amount__remove">
            remove
          </div>
          <ul>
            <li>
              <div className="booking-travel-date__container__key">
                Subtotal
              </div>
              <div className="booking-travel-date__container__value">
                ${getPrice.price}
              </div>
            </li>
            <li>
              <div className="booking-travel-date__container__key">
                Coupon code (OFF 5000)
              </div>
              <div className="booking-travel-date__container__value">
                ${getPrice.price * getDiscount}
              </div>
            </li>
          </ul>
        </div>
        <div className="booking-travel-date__container__total">
          <div className="booking-travel-date__container__amount__total__key">
            Total Amount
          </div>
          <div className="booking-travel-date__container__amount__total__value">
            $
            {getPrice.price -
              getPrice.price * getDiscount -
              getPrice.price * 0.05}
          </div>
        </div>
      </div>
    </div>
  )
}

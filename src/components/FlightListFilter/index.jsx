import {
  Col,
  Row,
  Slider,
  InputNumber,
  Space,
  Typography,
  Radio,
  Select,
  Checkbox,
} from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { fetchAllFilter } from '../../redux/slices/filterSlice'
import { getLsObj } from '../../utils/localStorage'
import './style.scss'
import { useTranslation } from 'react-i18next'

const { Text } = Typography
const { Option } = Select

const Flight = () => {
  const airlinesFetch = useSelector((state) => state.filter.airlines)
  const airlinesOptions = airlinesFetch.map((al) => ({
    label: al.name,
    value: al.icao,
  }))

  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(1500)
  const { t } = useTranslation()
  const [time, setTime] = useState('')
  const [airlines, setAirlines] = useState([])

  const handlePriceChange = (value) => {
    setMinPrice(value[0])
    setMaxPrice(value[1])
  }

  const clearPrice = () => {
    setMinPrice(0)
    setMaxPrice(1500)
  }

  const clearAirline = () => setAirlines([])

  let firstRender = useRef(true)

  // Debounce price
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    const flight = getLsObj('flight')

    if (!flight.ticketType || flight.ticketType === 'oneWay') {
      searchParams.set('startTime', time)
      searchParams.set('airline', airlines)
    }
    if (flight.ticketType === 'roundTrip') {
      searchParams.set('roundStartTime', time)
      searchParams.set('roundAirline', airlines)
    }

    searchParams.set('minPrice', minPrice)
    searchParams.set('maxPrice', maxPrice)

    setSearchParams(searchParams)
  }, [minPrice, maxPrice, time, airlines])

  // Fetch filter options
  useEffect(() => {
    dispatch(fetchAllFilter())
  }, [])

  const changeTime = (e) => {
    const value = e.target.value
    setTime(value)
  }

  const changeAirline = (list) => {
    setAirlines(list)
  }

  return (
    <div className="filter">
      <Row className="filterItem price" justify="center">
        <Col span={24} className="title">
          <Space
            style={{
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Text>{t('flight-list-page.Price')}</Text>
            {(minPrice !== 0 || maxPrice !== 1500) && (
              <Text className="clear-btn" italic onClick={clearPrice}>
                {t('flight-list-page.Clear')}
              </Text>
            )}
          </Space>
        </Col>
        <Col span={24} className="content">
          <Slider
            tipFormatter={(value) => `${value} USD`}
            range
            min={0}
            max={1500}
            defaultValue={[minPrice, maxPrice]}
            onAfterChange={handlePriceChange}
            tooltipPlacement="bottom"
            tooltipVisible={false}
          />

          <Space
            style={{
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              width: '100%',
            }}
          >
            <InputNumber
              min={0}
              max={1500}
              value={minPrice}
              onChange={(value) => handlePriceChange([value, maxPrice])}
              prefix={t('flight-list-page.$')}
            />
            <InputNumber
              min={0}
              max={1500}
              value={maxPrice}
              onChange={(value) => handlePriceChange(minPrice, value)}
              prefix={t('flight-list-page.$')}
            />
          </Space>
        </Col>
      </Row>

      <Row className="filterItem" justify="center">
        <Col span={24} className="title">
          <Space
            style={{
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Text>{t('flight-list-page.Times')}</Text>
          </Space>
        </Col>
        <Col span={24} className="content">
          <Radio.Group onChange={changeTime} value={time}>
            <Space direction="vertical">
              <Radio value={''}>{t('flight-list-page.All time')}</Radio>
              <Radio value={'morning'}>
                {t('flight-list-page.Early Morning')} (00:00 - 06:00)
              </Radio>
              <Radio value={'earlymoning'}>
                {t('flight-list-page.Morning')} (06:00 - 12:00)
              </Radio>
              <Radio value={'afternoon'}>
                {t('flight-list-page.Afternoon')} (12:00 - 18:00)
              </Radio>
              <Radio value={'evening'}>
                {t('flight-list-page.Evening')} (18:00 - 24:00)
              </Radio>
            </Space>
          </Radio.Group>
        </Col>
      </Row>

      <Row className="filterItem" justify="center">
        <Col span={24} className="title">
          <Space
            style={{
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Text>Airline</Text>
            {airlines.length === airlinesOptions.length && (
              <Text className="clear-btn" italic onClick={clearAirline}>
                Clear
              </Text>
            )}
          </Space>
        </Col>
        <Col span={24} className="content">
          <Checkbox.Group
            options={airlinesOptions}
            value={airlines}
            onChange={changeAirline}
          />
        </Col>
      </Row>
    </div>
  )
}

export default Flight

import React, { useState } from 'react'
import { UserBookingDetail } from '../index'
import { Button, Modal, Space, Table } from 'antd'
import { bookingStatus } from '../../Constants'
import { useNavigate } from 'react-router-dom'
import { ExclamationCircleOutlined } from '@ant-design/icons'

function UserBookingTable({ loading, data, onCancel }) {
  //initiation
  const [expandedRowKeys, setExpandedRowKeys] = useState([])
  const navigate = useNavigate()

  //Data for UI
  const confirm = (paymentID) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you want to cancel this booking?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => onCancel(paymentID),
    })
  }
  const bookingListColumn = [
    {
      title: 'Booking ID',
      dataIndex: 'id',
      align: 'center',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Journey',
      dataIndex: 'flights',
      align: 'center',
      render: (_, { flights }) => (
        <>
          {flights[0].departure}
          {flights.length === 2 ? (
            <i
              style={{ padding: '0 10px' }}
              className="fa-solid fa-arrow-right-arrow-left"
            ></i>
          ) : (
            <i
              style={{ padding: '0 10px' }}
              className="fa-solid fa-arrow-right-long"
            ></i>
          )}
          {flights[0].arrival}
        </>
      ),
    },
    {
      title: 'Booking Amount',
      dataIndex: 'totalPrice',
      align: 'center',
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: 'Action',
      key: 'action',
      width: '100px',
      dataIndex: 'id',
      align: 'center',
      render: (_, record) => (
        <Space>
          {/* eslint-disable-next-line react/jsx-no-undef */}
          {record.status === bookingStatus[1] && (
            <Button
              type="default"
              shape="default"
              onClick={() => confirm(record.paymentId)}
            >
              Cancel
            </Button>
          )}
          {record.status !== bookingStatus[1] && (
            <Button
              type="primary"
              shape="default"
              onClick={() => navigate('/')}
            >
              Booking Again
            </Button>
          )}
        </Space>
      ),
    },
  ]
  const onExpandRowKey = (expanded, record) => {
    expanded ? setExpandedRowKeys([record.id]) : setExpandedRowKeys([])
  }

  return (
    <>
      <Table
        columns={bookingListColumn}
        rowKey={(record) => record.id}
        expandable={{
          expandedRowKeys: expandedRowKeys,
          onExpand: onExpandRowKey,
          expandedRowRender: (record) => (
            <UserBookingDetail detailData={record} />
          ),
        }}
        dataSource={data}
        loading={loading}
        scroll={{
          x: 'max-content',
        }}
      />
    </>
  )
}

export default UserBookingTable

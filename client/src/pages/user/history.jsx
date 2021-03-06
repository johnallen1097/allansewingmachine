import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '../../components/loading'
import addComma from '../../utils/helper/add-comma'
import moment from 'moment'
import { getOrderHistory } from '../../redux/order/order-action'

const UserHistory = () => {
  const dispatch = useDispatch()
  const orderState = useSelector(({ order }) => order)
  const { loading, orderHistory, error } = orderState

  useEffect(() => {
    if (orderHistory.length === 0) {
      dispatch(getOrderHistory())
    }
  }, [])

  return (
    <div className='history_cart card'>
      <h1 className='heading-secondary'>History</h1>

      {loading ? (
        <Loading />
      ) : error ? (
        <h1>Error {error}</h1>
      ) : orderHistory.length === 0 ? (
        <h1>No history purchased</h1>
      ) : (
        Object.keys(orderHistory).map((key, index) => {
          return (
            <div key={index}>
              <table>
                <thead>
                  <tr>
                    <th>Order number</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Sub total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderHistory[key]['orderItems'].map((data, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{data.name}</td>
                      <td>{data.quantity}</td>
                      <td>
                        <span>Php </span>
                        {addComma(parseFloat(data.price).toFixed(2))}
                      </td>
                      <td>
                        <span>Php </span>
                        {addComma(
                          parseFloat(data.price * data.quantity).toFixed(2)
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h4>
                <span>Purchased date:</span>
                {moment(orderHistory[key]['createdAt']).format('MM-DD-YYYY')}
              </h4>
              <h5>
                <span>Total purchased: Php </span>
                {addComma(
                  parseFloat(orderHistory[key]['totalPrice']).toFixed(2)
                )}
              </h5>
            </div>
          )
        })
      )}
    </div>
  )
}

export default UserHistory

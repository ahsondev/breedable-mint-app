import React from 'react'
import { useEffect } from 'react'
import './Dashboard.scoped.scss'

const Dashboard = () => {
  return (
    <div className='dashboard-page'>
      <h2>Set whitelist</h2>
      <div className="d-flex w-100">
        <textarea className="w-50" />
        <div className="w-50" style={{padding: '0 0 0 20px'}}>
          <button type='button' className='d-block w-100' style={{margin: '0 0 10px 0'}}>Set Whitelist</button>
          <button type='button' className='d-block w-100'>Set Starttime</button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

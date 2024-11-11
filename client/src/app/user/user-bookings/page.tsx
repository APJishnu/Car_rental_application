import React from 'react'
import BookingList from '../../../modules/user/components/UserBookings/UserBookings';
import styles from './page.module.css'

const page = () => {
  return (
    <div className={styles.main}><BookingList /></div>
  )
}

export default page
import { Typography } from '@mui/material'
import React from 'react'

export default function ValidationComplete() {
  return (
    <div className='flex d-flex h-100 my-5 justify-content-center align-items-center'>
    <div
    className="container px-0 rounded-4  p-0 AdvertisementBG sellAdvertisement"
    style={{
      minHeight: "150px",
      maxWidth: "864px",
      width: "80%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center", 
      textAlign: "center", 
    }}
  >
    <Typography className="fs-18 fw-500">
    شرکت شما تأیید شده است و نماد تأیید به شما اعطا گردید.
    </Typography>
  </div>
  </div>
  )
}

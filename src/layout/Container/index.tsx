import Footer from 'layout/Footer'
import Header from 'layout/Header'
import React from 'react'
import { Outlet } from 'react-router-dom'

export default function Container() {
  return (
    <>
    <div>
        <Header />
        <div>
            <Outlet />
            <Footer />
        </div>
    </div>
    </>
  )
}

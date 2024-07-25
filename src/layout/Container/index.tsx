import Footer from 'layout/Footer'
import Header from 'layout/Header'
import { Outlet } from 'react-router-dom'
import './style.css'

export default function Container() {
  return (
    <div className="container">
        <Header />
        <main>
            <Outlet />
        </main>
        <Footer />
    </div>
  )
}

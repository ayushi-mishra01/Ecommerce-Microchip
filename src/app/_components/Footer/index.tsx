import React from 'react'
import Link from 'next/link'

import { Footer } from '../../../payload/payload-types'
import { fetchFooter, fetchGlobals } from '../../_api/fetchGlobals'
import { ThemeSelector } from '../../_providers/Theme/ThemeSelector'
import { Gutter } from '../Gutter'
import { CMSLink } from '../Link'

import classes from './index.module.scss'
import MicrochipLogo from './footer_image/MicrochipLogo.png'
import '@fortawesome/fontawesome-free/css/all.min.css';

export async function Footer() {
  let footer: Footer | null = null

  try {
    footer = await fetchFooter()
  } catch (error) {
    // When deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // So swallow the error here and simply render the footer without nav items if one occurs
    // in production you may want to redirect to a 404  page or at least log the error somewhere
    // console.error(error)
  }

  const navItems = footer?.navItems || []

  return (
    <>
      <footer className={classes.footer1}>
        <div className="content-container">
        <div className={`${classes.container} accentFont`}>
          <div className={classes.newsletter}>
            <div className={classes.logo} style={{marginTop:"10%"}}>
              <img src="https://www.microchipusa.com/wp-content/uploads/2020/04/MUSA-Logo-outline-sm-300x85.png"
              //{MicrochipLogo.src} 
              alt="Microchip USA Logo" /> 
            </div>
            <h3 style={{marginLeft:"-20%", marginTop:"-5%"}}>Join Our Newsletter</h3>
            <div className={classes.subscribe}>
              <input type="email" placeholder="Email" /><br></br>
              <button type='submit' >Subscribe</button>
            </div>
          </div>

          <div className={classes.contactInfo}>
            <h3>Contact Info</h3>
            <p><i className="fas fa-phone-alt"></i> Call us</p>
            <p><a href="tel:+18882515467">+1-888-251-5467 (Toll Free)</a></p>
            <p><a href="tel:+18134639988" >+1-813-463-9988 (US)</a></p>
            <p><a href="tel:+4903030015566">+49 030 30015566 (DE)</a></p>
            <p><i className="fas fa-envelope"></i> Email:</p>
            <p><a href="mailto:sales@microchipusa.com" >sales@microchipusa.com</a></p>
            <p><i className="fas fa-map-marker-alt"></i> Location: </p>
            <p style={{ marginLeft: "1rem", color: "white"}}> 4511 N Himes Ave, Suite 100, <br/>Tampa, FL 33614</p>
          </div>

          <div className={classes.services}>
            <h3>Our Services</h3>
            <ul>
              <li><a href="/component-supplier">Component Supplier</a></li>
              <li><a href="/tail-spend-management">Tail Spend Management</a></li>
              <li><a href="/quality-control">Quality Control</a></li>
              <li><a href="/excess-inventory">Excess Inventory</a></li>
            </ul>
            <a href="/careers">
              <button className={classes.hiringButton}>📢 WE'RE HIRING!</button>
            </a>
          </div>

          <div className={classes.hours}>
            <h3>Open Hours</h3>
            <p>Monday - Thursday</p>
            <p> 9:00AM - 5:30PM EST</p>
            <p>Friday</p>
            <p> 9:00AM - 4:30PM EST</p>
            <div className={classes.socials}>
              <a href="https://www.facebook.com/microchipusa"><i className="fab fa-facebook"></i></a>
              <a href="https://www.instagram.com/microchipusa/"><i className="fab fa-instagram"></i></a>
              <a href="https://twitter.com/MicrochipUSA"><i className="fab fa-twitter"></i></a>
              <a href="https://www.linkedin.com/company/microchip-usa/"><i className="fab fa-linkedin"></i></a>
              <a href="https://www.youtube.com/@microchipusa"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>

        <div className={classes.bottomBar}>
          <p>© 2024 Microchip USA. All rights reserved.</p>
          <div className="linkContainer">
            <a href="https://microchipusa-vendorportal.azurewebsites.net/">Customer Portal</a>
            <a href="/privacy-policy">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>

    {/* <footer className={classes.footer}>
        <nav className={classes.nav} style={{marginTop:"-5%", marginLeft:"1%"}}>
          <ThemeSelector />
          {navItems.map(({ link }, i) => {
            return <CMSLink key={i} {...link} />
          })}
          <Link href="/admin">Admin</Link>
        </nav>
    </footer> */}
    </>
  )
}
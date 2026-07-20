import { useState } from 'react'
import logo from './assets/pujukan_logo.png'
import './App.css'

export default function App() {
  return(
      <div id="homepage"> 
        <div id="navbar">
          <a href="#"> <img id="logo" src={logo} alt="Logo" /> </a>
          <ul> 
            <li> <a href="#">PRODUCTS</a> </li>
            <li> <a href="#">RECIPES</a> </li>
            <li> <a href="#">ABOUT</a> </li>
            <li> <a href="#">CONTACT</a> </li>
          </ul>
        </div>

        <div id="intro">
          <div class="intro-text"> 
            <h1>A Cut Above</h1>
            <p>Premium local meats, expertly cut and thoughtfully selected for quality, flavor, and freshness. We take pride in offering quality products and dependable service for families and anyone who loves a great meal.</p>
            <a href="#" class="button">Browse now</a>
          </div>
        </div>

        <div class="gallery">
            <h1>OUR PRODUCTS</h1>
            <div class="image-gallery">
              <div class="gallery-box"></div>
              <div class="gallery-box"></div>
              <div class="gallery-box"></div>
            </div>
            <a href="#" class="button">View more</a>
        </div>

        <div class="gallery">
            <h1>RECIPES</h1>
            <div class="image-gallery">
              <div class="gallery-box"></div>
              <div class="gallery-box"></div>
              <div class="gallery-box"></div>
            </div>
            <a href="#" class="button">View more</a>
        </div>

        <div id="footer">
          <img id="logo" src={logo} alt="Logo" />
          <ul> 
            <li> <a href="#">PRODUCTS</a> </li>
            <li> <a href="#">RECIPES</a> </li>
            <li> <a href="#">ABOUT</a> </li>
            <li> <a href="#">CONTACT</a> </li>
          </ul>
        </div>
      </div>
  );
}

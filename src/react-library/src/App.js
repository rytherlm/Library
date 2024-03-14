import { Component } from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom"
import MainPage from "./MainPage";
import LoginPage from "./LoginPage";

export default class App extends Component{
  render(){
    return (
      <BrowserRouter>
        <Routes>
          <Route index element={<LoginPage/>}/>
          <Route path="*" element={<LoginPage/>}/>
          <Route path = "/login" element={<LoginPage/>}/>
          <Route path = "/main" element={<MainPage/>}/>
        </Routes>
      </BrowserRouter>
    )
  }
}
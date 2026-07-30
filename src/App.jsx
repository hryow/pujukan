import { Redirect, Route, Switch } from 'wouter'
import HomePage from './components/HomePage.jsx'
import AboutPage from './components/AboutPage.jsx'
import ContactPage from './components/ContactPage.jsx'
import ProductsPage from './components/ProductsPage.jsx'
import RecipesPage from './components/RecipesPage.jsx'
import './App.css'

export default function App() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/recipes" component={RecipesPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
  )
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Handwriting from './Handwriting'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Handwriting imageUrl="https://www.researchgate.net/profile/Karl-Heinz-Steinke/publication/224082148/figure/fig1/AS:393986553466881@1470945122518/Handwriting-from-IAM-database.png"/>
  </StrictMode>,
)

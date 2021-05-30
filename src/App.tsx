import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { CentralRift } from './Pages/CentralRift'
import { DepartureZone } from './Pages/DepartureZone'

import { FlexDiv } from './Common/helpfulComponents'


function App() {

  return (
    <FlexDiv>
        <Switch>
          <Route exact path='/'>
            <Redirect to='/CentralRift' />
          </Route>
          <Route exact path='/CentralRift'>
            <CentralRift />
          </Route>
          <Route path='/CentralRift/DepartureZone'>
            <DepartureZone />
          </Route>
        </Switch>
        
    </FlexDiv>
  );
}

export default App;

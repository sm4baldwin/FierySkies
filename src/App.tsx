import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { CentralRift } from './Pages/CentralRift'
import { DepartureZone } from './Pages/DepartureZone'
import { UserLogin } from './Pages/UserLogin'

import { FlexDiv } from './Common/helpfulComponents'
import { useAppSelector } from './Common/hooks'
import { selectLoginStatus } from './features/database/databaseSlice'


function App() {
  const loginStatus = useAppSelector(selectLoginStatus)

  return (
    <FlexDiv>
        <Switch>
          <Route exact path='/UserLogin'>
            <UserLogin />
          </Route>
          {loginStatus !== 'succeeded' && <Route path='/'>
            <Redirect to='/UserLogin' />
          </Route>}
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

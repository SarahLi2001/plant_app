// reducers are what stores the state of the application and update
// it whenever they receive an action
import { combineReducers } from 'redux'
import { user } from './user'
import { users } from './users'

const Reducers = combineReducers({
    userState: user,
    usersState: users
})

export default Reducers
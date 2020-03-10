import { all } from 'redux-saga/effects'

import auth from './auth.sagas.js'
import deposit from './deposit.sagas.js'
import loans from './loans.sagas.js'
import memberData from './memberData.sagas.js'
import savings from './savings.sagas.js'
import search from './search.sagas.js'

export default function* combineSaga(){
  yield all([
    auth(),
    deposit(),
    loans(),
    memberData(),
    savings(),
    search()
  ])
}
import { Platform } from 'react-native'
import uuid from 'react-native-uuid'
import branch from 'react-native-branch'
import _ from 'lodash'
import { NetworkInfo } from 'react-native-network-info'

import panelDefs from '../dictionaries/panels'
import { isAndroid } from '../utils'

import {
  ADD_DEVICE_URL,
  ASSIGN_IR_CODE,
  CREATE_BUTTON,
  UPDATE_BUTTON,
  CREATE_BUTTON_PANEL,
  DELETE_BUTTON_PANEL,
  CREATE_REMOTE,
  UPDATE_REMOTE,
  DELETE_REMOTE,
  DELETE_BUTTON,
  SET_DEVICE_URLS,
  SET_HEADER_MENU_VISIBLE,
  SET_EDIT_MODE,
  SET_CAPTURE_MODE,
  SET_CURRENT_REMOTE_ID,
  SET_RECORDING_BUTTON_ID,
  SET_DRAGGING,
  SET_MODAL_VISIBLE,
  SET_HEADER_MODAL,
  SET_SCANNING,
  SET_THEME,
  SET_TESTING,
} from '../constants/actions'

export function createRemote() {
  const remoteId = uuid.v1()
  return {
    type: CREATE_REMOTE,
    payload: {
      remoteId,
    }
  }
}

export function updateRemote(remoteId, updatedRemote) {
  return {
    type: UPDATE_REMOTE,
    payload: {
      updatedRemote,
      remoteId,
    }
  }
}

export function deleteRemote(remoteId) {
  return {
    type: DELETE_REMOTE,
    payload: {
      remoteId,
    }
  }
}

export function importRemote(nestedRemote) {
  return dispatch => {
    try {
      const remoteAction = dispatch(createRemote())
      const { remoteId } = remoteAction.payload
      dispatch(updateRemote(remoteId, {title: nestedRemote.title, icon: nestedRemote.icon }))

      nestedRemote.panels.forEach(panel => {
        const panelId = uuid.v1()
        dispatch(createButtonPanelAction(remoteId, panelId, panel.type))

        panel.buttons.forEach(button => {
          const buttonAction = dispatch(createButton(button.icon, panelId))
          const { buttonId } = buttonAction.payload
          dispatch(editButton(buttonId, { title: button.title, icon: button.icon }))
          if (button.type && button.value && button.length) {
            dispatch(assignIRCode(buttonId, {
              type: button.type,
              value: button.value,
              length: button.length,
            }))

          }
        })
      })

      return {
        type: 'xxx',
        payload: nestedRemote,
      }
    } catch (err) {
      console.log('## importRemote error,', err)
    }
  }
}

export function exportRemote(remoteId) {
  return (dispatch, getState) => {
    const { remotes, panels, buttons } = getState()
    if (!remotes[remoteId]) alert('No remote found with this id ', remoteId)
    let nestedRemote = {
      ...remotes[remoteId],
      panels: remotes[remoteId].panels.map(panelId => {
        return {
          ...panels[panelId],
          buttons: panels[panelId].buttons.map(buttonId => ({...buttons[buttonId]}))
        }
      })
    }
    return nestedRemote
  }
}

export function getShareRemoteUrl(nestedRemote) {
  return async () => {

    let branchUniversalObject = await branch.createBranchUniversalObject(
        'content/12345', // canonical identifier
        {
          contentDescription: 'New shared remote!',
          metadata: {
            remote: isAndroid ? JSON.stringify(nestedRemote) : nestedRemote,
          }
        }
      )

    let linkProperties = {
      channel: 'internal',
    }

    let controlParams = {
      '$desktop_url': 'http://www.danielmerrill.com',
      '$ios_url': 'irmobile://',
      '$android_url': 'irmobile://',
    }
    let { url } = await branchUniversalObject.generateShortUrl(linkProperties, controlParams)
    return url
  }
}


export function setCurrentRemoteId(remoteId) {
  return {
    type: SET_CURRENT_REMOTE_ID,
    payload: {
      remoteId,
    }
  }
}

export function setTheme(theme) {
  return {
    type: SET_THEME,
    payload: {
      theme,
    }
  }
}

export function setHeaderMenu(visible) {
  return {
    type: SET_HEADER_MENU_VISIBLE,
    payload: {
      visible
    }
  }
}

export function setModalVisible(visible) {
  return {
    type: SET_MODAL_VISIBLE,
    payload: {
      visible,
    }
  }
}

export function setHeaderModal(modal) {
  return {
    type: SET_HEADER_MODAL,
    payload: {
      modal,
    }
  }
}

export function setEditMode(editing) {
  return {
    type: SET_EDIT_MODE,
    payload: {
      editing,
    }
  }
}
export function setCaptureMode(capturing) {
  return {
    type: SET_CAPTURE_MODE,
    payload: {
      capturing,
    }
  }
}

export function setDragging(dragging) {
  return {
    type: SET_DRAGGING,
    payload: {
      dragging,
    }
  }
}

export function setScanning(scanning) {
  return {
    type: SET_SCANNING,
    payload: {
      scanning,
    }
  }
}

export function setcapturingButtonId(buttonId) {
  return {
    type: SET_RECORDING_BUTTON_ID,
    payload: {
      buttonId,
    }
  }
}

export function assignIRCode(buttonId, codeData) {
  console.log('ASSIGNING IR CODE TO BUTTON', buttonId, codeData)
  const { type, value, length } = codeData
  return {
    type: ASSIGN_IR_CODE,
    payload: {
      buttonId,
      type,
      value,
      length,
    },
  }
}

export function createButton(icon, panelId) {
  const buttonId = uuid.v1()
  return {
    type: CREATE_BUTTON,
    payload: {
       buttonId,
       icon,
       panelId,
      }
    }
}

export function deleteButton(buttonId) {
  return {
    type: DELETE_BUTTON,
    payload: {
      buttonId,
    }
  }
}

export function editButton(buttonId, { title, icon }) {
  return {
    type: UPDATE_BUTTON,
    payload: {
      buttonId,
      title,
      icon,
    }
  }
}

const createButtonPanelAction = (remoteId, panelId, type) => ({
    type: CREATE_BUTTON_PANEL,
    payload: {
      remoteId,
      panelId,
      type,
    }
  })

export function createButtonPanel(type, remoteId) {
  return async (dispatch) => {
    if (!panelDefs[type]) return

    const panelId = uuid.v1()
    dispatch(createButtonPanelAction(remoteId, panelId, type))
    const icons = _.flatten(panelDefs[type].icons)
    icons.forEach(iconName => {
      dispatch(createButton(iconName, panelId))
    })
  }

}

export function deleteButtonPanel(panelId, remoteId) {
  return {
    type: DELETE_BUTTON_PANEL,
    payload: {
      panelId,
      remoteId,
    }
  }
}

export function setDeviceUrls(urls) {
  return {
    type: SET_DEVICE_URLS,
    payload: {
      urls
    },
  }
}

export function addDeviceUrl(url) {
  return {
    type: ADD_DEVICE_URL,
    payload: {
      url,
    },
  }
}

export function findDevicesOnNetwork() {
  return async (dispatch, getState) => {
    const { baseUrls } = getState().network
    dispatch(setScanning(true))
    // ios doesn't have a getIPV4Address function, returns ipv4 by default
    const getIPAddress = Platform.OS === 'android' ? NetworkInfo.getIPV4Address : NetworkInfo.getIPAddress
    const ip = await new Promise(getIPAddress)
    console.log('My IP Address: ', ip)
    if (!ip || ip.length < 5) return
    const networkAddress = ip.substring(0, ip.lastIndexOf('.'))
    const arr = []
    // Loop through all 256 possible ip addresses looking for a lighthouse :)
    for (let i = 0; i < 255; i++) {
      arr[i] = new Promise(async (resolve) => {
        try {
           setTimeout(() => resolve('TOOK TOO LONG!'), 10000)
          let result = await fetch(`http://${networkAddress}.${i}/marco`)
          if (result.ok && result.status === 200) {
            result = await result.json()
            result.success = true
            result.ip = `http://${networkAddress}.${i}`
            console.log('adding ', result.ip)
            if (baseUrls.indexOf(result.ip) === -1) dispatch(addDeviceUrl(result.ip))
          }
          resolve(result)
        } catch (err) {
          resolve('ERROR!')
        }
      })
    }

    try {
      const responses = await Promise.all(arr)
      console.log('RESPONSES', responses)
      const deviceIPs = responses.filter(response => response.success).map(device => device.ip)
      console.log('Addresses:', deviceIPs)
      dispatch(setDeviceUrls(deviceIPs))
      dispatch(setScanning(false))


    } catch (err) {
      console.log('## findDevicesOnNetwork error:', err)
      dispatch(setScanning(false))
    }
  }
}

let pollInterval

export function captureIRCode(buttonId, onStatusChanged) {
  return async dispatch => {
    console.log('CAPTURING!!', buttonId)
    try {
      const response = await dispatch(startRecord(buttonId))
      if (response.ok) {
        dispatch(checkForCapturedCode(buttonId, onStatusChanged))
      }
    } catch (err) {
      console.log('## caputreIRCode err', err)
      if (pollInterval) clearInterval(pollInterval)
    }
  }
}

export function startRecord(buttonId) {
  return async (dispatch, getState) => {
    const { baseUrls } = getState().network
    console.log('START RECORD')
    dispatch(setcapturingButtonId(buttonId))
    try {
      const response = await Promise.race(baseUrls.map(url => fetch(url + '/rec')))
      console.log('START RECORD::response', response)
      return response
    } catch (err) {
      console.log('## startRecord error', err)
    }
  }
}

export function stopRecord() {
  return async (dispatch, getState) => {
    const { baseUrls } = getState().network
    try {
      dispatch(setcapturingButtonId(null))
      baseUrls.forEach(url => fetch(url + '/stop'))
      if (pollInterval) clearInterval(pollInterval)
    } catch (err) {
      console.log('## stopRecord err', err)
    }
  }
}

export function setTestingMode(isTesting) {
  return async (dispatch, getState) => {
    const { baseUrls } = getState().network
    try {
      const response = await Promise.race(baseUrls.map(url => fetch(url + `/${isTesting ? 'test' : 'testStop'}`)))
      if (response.ok) {
        const { testing } = await response.json()
        dispatch({
          type: SET_TESTING,
          payload: {
            testing
          }
        })
      }
    } catch (err) {
      console.log('## setTestingMode err', err)
    }
  }
}

export function clearRecordingState() {
  return async (dispatch, getState) => {
    const { baseUrls } = getState().network
    try {
      baseUrls.forEach(url => fetch(url + '/clear'))
    } catch (err) {
      console.log('## clearRecordingState err', err)
    }
  }
}

// Check for IR code every second
const POLL_INTERVAL = 1000
const MAX_TIMES_TO_CHECK_FOR_NEW_CODE = 10

export function checkForCapturedCode(buttonId, onStatusChanged = () => {}) {
  return async (dispatch, getState) => {
    const { baseUrls } = getState().network
    try {

      if (pollInterval) clearInterval(pollInterval)

      let pollCounter = 0
      pollInterval = setInterval(async () => {

        console.log('Checking...', pollCounter)

        const responses = await Promise.all(baseUrls.map(url => fetch(url + '/check')))
        const parsedResponses = await Promise.all(responses.map(response => response.json()))
        console.log('RESPONSES', parsedResponses)
        const codeData = parsedResponses.find(item => item.value)
        if (codeData && codeData.value) {
          console.log('GOT A CODE!', codeData)
          clearInterval(pollInterval)
          dispatch(assignIRCode(buttonId, codeData))
          onStatusChanged(true)
          dispatch(stopRecord())
        } else if (pollCounter > MAX_TIMES_TO_CHECK_FOR_NEW_CODE) {
          // Too much time has passed, give up
          clearInterval(pollInterval)
          onStatusChanged(false)
          dispatch(stopRecord())
          console.log('MAX REACTHED, GIVING UP')
        }
        pollCounter++
      }, POLL_INTERVAL)
    } catch (err) {
      pollInterval && clearInterval(pollInterval)
      console.log('ERR!!!')
      onStatusChanged(false)
      dispatch(stopRecord())
    }
  }
}

export function transmitIRCode(buttonId) {
  return async (dispatch, getState) => {
    const { baseUrls } = getState().network
    console.log(getState().buttons)
    const { type, value, length } = getState().buttons[buttonId]
    console.log('TRANSMITTING CODE', value)

    const responses = await Promise.all(baseUrls.map(url => fetch(`${url}/send?length=${length}&value=${value}&type=${type}`)))
    const text = await Promise.all(responses.map(response => response.text()))
    console.log(text)
  }
}

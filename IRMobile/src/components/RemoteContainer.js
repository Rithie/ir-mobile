import React, { Component, PropTypes } from 'react'
import {
  View,
  UIManager,
  LayoutAnimation,
} from 'react-native'

import { connect } from 'react-redux'
import Remote from './Remote'
import HeaderMenuButton from './menu/HeaderMenuButton'
import { createTabNavigator } from '../navigation'
import { createRemote } from '../actions'
import { isAndroid } from '../utils'

import {
  HEADER_TITLE_COLOR,
  HEADER_TITLE_EDITING_COLOR,
  HEADER_BACKGROUND_EDITING_COLOR,
  HEADER_BACKGROUND_COLOR,
} from '../constants/colors'

import { STATUS_BAR_HEIGHT } from '../constants/dimensions'

const CustomLayoutSpring = {
    duration: 400,
    create: {
      type: LayoutAnimation.Types.spring,
      property: LayoutAnimation.Properties.scaleXY,
      springDamping: 0.7,
    },
    update: {
      type: LayoutAnimation.Types.spring,
      springDamping: 0.7,
    },
    delete: {
      type: LayoutAnimation.Types.spring,
      property: LayoutAnimation.Properties.scaleXY,
      springDamping: 0.7,
    },
  }

class RemoteContainer extends Component {

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    const menuVisible = params && params.menuVisible
    const editing = params && params.editing
    const capturing = params && params.capturing
    const recording = params && params.recording
    const modalVisible = params && params.modalVisible
    const remoteTitle = params && params.title

    const title = capturing ? recording ? 'Listening...' : 'Ready to capture' : remoteTitle
    return {
        title,
        tabBarLabel: 'hi',
        headerStyle: {
          backgroundColor: editing ? HEADER_BACKGROUND_EDITING_COLOR : HEADER_BACKGROUND_COLOR,
          paddingTop: STATUS_BAR_HEIGHT,
          height: 75,
        },
        headerTitleStyle: {
          color: editing ? HEADER_TITLE_EDITING_COLOR : HEADER_TITLE_COLOR,
        },
        headerRight: !modalVisible && <HeaderMenuButton
          menuVisible={menuVisible}
          setParams={navigation.setParams}
        />,
      }
    }

  static propTypes = {
    remotes: PropTypes.object.isRequired,
    createRemote: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    // Only update the container when a remote has been added or deleted
    const shouldUpdate = nextProps.remotes.list.length !== this.props.remotes.list.length
    return shouldUpdate

  }

  componentWillMount() {
      if (this.props.remotes && !this.props.remotes.length) this.props.createRemote()
      if (isAndroid) UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  componentWillReceiveProps(nextProps) {
    const { setParams } = this.props.navigation

    const thisRemote = this.props.remotes[this.props.currentRemoteId]
    const nextRemote = nextProps.remotes[nextProps.currentRemoteId]

    if (nextProps.editing !== this.props.editing) {
      LayoutAnimation.configureNext(CustomLayoutSpring)
      setParams({ editing: nextProps.editing })
    }
    if (nextProps.capturing !== this.props.capturing) setParams({ capturing: nextProps.capturing })
    if (nextProps.capturingButtonId !== this.props.capturingButtonId) setParams({ recording: !!nextProps.capturingButtonId })
    if (thisRemote && nextRemote && nextRemote.panels.length !== thisRemote.panels.length) {
      // Button panel was added/deleted
      LayoutAnimation.configureNext(CustomLayoutSpring)
    }
  }

  render() {
    const { remotes } = this.props
    if (!remotes || !remotes.list || !remotes.list.length) return <View />

    return createTabNavigator(remotes.list, Remote)
  }
}

const mapStateToProps = state => ({
  remotes: state.remotes,
  editing: state.app.editing,
  capturing: state.app.capturing,
  capturingButtonId: state.app.capturingButtonId,
  currentRemoteId: state.app.currentRemoteId,
})

const mapDispatchToProps = dispatch => ({
  createRemote: () => dispatch(createRemote()),
})

export default connect(mapStateToProps, mapDispatchToProps)(RemoteContainer)

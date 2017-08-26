import React, { Component, PropTypes } from 'react'
import {
  Animated,
  PanResponder,
  FlatList,
  StyleSheet,
  View,
} from 'react-native'
import { connect } from 'react-redux'

import { setBaseUrl, stopRecord, createButtonPanel, setHeaderMenu } from '../actions'

import {
  REMOTE_BACKGROUND_COLOR,
} from '../constants/colors'

import ButtonPanel from './ButtonPanel'
import CirclePlusButton from './CirclePlusButton'
import AddPanelModal from './AddPanelModal'
import EditButtonModal from './EditButtonModal'

class Remote extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      tabBarLabel: 'TEST',
    }
  }

  static propTypes = {
    editing: PropTypes.bool.isRequired,
    setBaseUrl: PropTypes.func.isRequired,
    stopRecord: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    remote: PropTypes.object.isRequired,
  }

  state = {
    addPanelModalVisible: false,
    editButtonModalVisible: false,
  }

  backgroundAnim = new Animated.Value(0)

  componentWillMount() {
    this.props.setBaseUrl('http://192.168.86.99')
    this.props.navigation.setParams({ title: this.props.remote.title })
    this._panResponder = PanResponder.create({
     onStartShouldSetPanResponder: () => false,
     onStartShouldSetPanResponderCapture: () => false,
     onMoveShouldSetPanResponder: () => false ,
     onMoveShouldSetPanResponderCapture: () => {
       // @TODO: setting recording button id to null
       // here is messing up button logic b/c this onPress
       // is called before button onPress.

       // this.dismissRecording()
       if (this.props.headerMenuVisible) this.dismissMenu()
       return false
     }
   });
 }

 componentWillReceiveProps(nextProps) {
   console.log('REMOTE PROPS!!', nextProps)
 }

  dismissRecording = () => {
    const { navigation } = this.props
    const isRecording = navigation.state.params && navigation.state.params.recording
    if (isRecording) {
      this.props.stopRecord()
      navigation.setParams({ recording: null })
    }
  }

  dismissMenu = () => this.props.setHeaderMenu(false)

  showAddPanelModal = () => {
    this.setState({ addPanelModalVisible: true })
    this.props.navigation.setParams({ modalVisible: true })
  }

  submitAddPanelModal = type => {
    if (type) this.props.createButtonPanel(type)
    this.setState({ addPanelModalVisible: false })
    this.props.navigation.setParams({ modalVisible: false })
  }

  onEditPress = buttonId => {
    this.props.navigation.setParams({ modalVisible: true })
    this.setState({ editButtonModalVisible: true, editingButtonId: buttonId })
  }

  dismissEditButtonModal = () => {
    this.setState({ editButtonModalVisible: false })
    this.props.navigation.setParams({ modalVisible: false })
  }

  dismissAll = () => {
    this.dismissMenu()
    this.dismissRecording()
    this.dismissEditButtonModal()
    this.dismissAddPanelModal()
  }

  renderButtonPanel = ({ item }) => {
    const { navigation } = this.props
    console.log(item)
    return (
      <ButtonPanel
        id={item}
        remoteId={this.props.navigation.state.routeName}
        onEditPress={this.onEditPress}
        setParams={navigation.setParams}
      />
    )
  }

  render() {
    const { editing, remote } = this.props
    const { addPanelModalVisible, editButtonModalVisible, editingButtonId } = this.state

    return (
      <View style={{flex: 1}}>
        <View
          {...this._panResponder.panHandlers}
          style={[styles.container]}
        >
          <FlatList
            style={styles.buttonPanelList}
            data={remote.panels}
            renderItem={this.renderButtonPanel}
            keyExtractor={item => item}
          />
          { editing && <CirclePlusButton onPress={this.showAddPanelModal} />}

        </View>
        { addPanelModalVisible &&
          <AddPanelModal
            onSubmit={this.submitAddPanelModal}
          /> }

        { editButtonModalVisible &&
          <EditButtonModal
            buttonId={editingButtonId}
            onSubmit={this.dismissEditButtonModal}
          /> }
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  remote: state.remotes[ownProps.navigation.state.routeName],
  editing: state.app.editing,
  editingButtonId: state.app.editingButtonId,
  editButtonModalVisible: state.app.editButtonModalVisible,
  headerMenuVisible: state.app.headerMenuVisible,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    createButtonPanel: type => dispatch(createButtonPanel(type, ownProps.navigation.state.routeName)),
    setBaseUrl: url => dispatch(setBaseUrl(url)),
    stopRecord: () => dispatch(stopRecord()),
    setHeaderMenu: visible => dispatch(setHeaderMenu(visible)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Remote)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: REMOTE_BACKGROUND_COLOR,
  },
  buttonPanelList: {
    flex: 1,
    width: '100%',
  },
  menu: {
    padding: 10,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    right: 0,
    transform: [{ translateY: -20 }]
  }
})

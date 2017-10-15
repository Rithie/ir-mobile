import React, { Component, PropTypes } from 'react'
import {
  ActivityIndicator,
  BackHandler,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { connect } from 'react-redux'

import TextButton from '../TextButton'
import { findDevicesOnNetwork, updateRemote, setHeaderModal, setTheme, setTestingMode } from '../../actions'
import { isAndroid } from '../../utils'

import { BUTTON_RADIUS } from '../../constants/dimensions'
import themes, { list as themeList} from '../../constants/themes'

class SelectRemoteIconModal extends Component {

  static propTypes = {
    baseUrls: PropTypes.array.isRequired,
    findDevicesOnNetwork: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    scanning: PropTypes.bool.isRequired,
    setHeaderModal: PropTypes.func.isRequired,
    setTheme: PropTypes.func.isRequired,
    testing: PropTypes.bool.isRequired,
    setTestingMode: PropTypes.func.isRequired,
    theme: PropTypes.string.isRequired,
  }

  state = {
    selectedTheme: '',
    testingValue: this.props.testing,
  }

  componentWillMount() {
    if (isAndroid) BackHandler.addEventListener('hardwareBackPress', this.captureAndroidBackPress)
    this.setState({ selectedTheme: this.props.theme })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.testing !== this.props.testing) {
      this.setState({ testingValue: nextProps.testing })
    }
  }

  captureAndroidBackPress = () => {
    this.props.onSubmit()
    BackHandler.removeEventListener('hardwareBackPress', this.captureAndroidBackPress)
    return true
  }

  onDonePress = () => {

    this.props.setHeaderModal(null)
    this.props.onSubmit()
  }

  renderThemeDemoButton = (themeName, index) => (
    <View key={index} style={[styles.themeDemoButton, {backgroundColor: themes[themeName].BUTTON_BACKGROUND_COLOR}]}>
      <View style={[styles.themeDemoButtonInner, {backgroundColor: themes[themeName].BUTTON_ICON_COLOR}]} />
    </View>
  )

  renderThemeOption = themeName => {
    const { OPTION_SELECTED_BACKGROUND_COLOR } = themes[this.props.theme]
    return (
      <TouchableOpacity
        key={themeName}
        onPress={() => {
          this.setState({ selectedTheme: themeName })
          this.props.setTheme(themeName)
        }}
        style={[styles.option, { backgroundColor: this.state.selectedTheme === themeName ? OPTION_SELECTED_BACKGROUND_COLOR : 'transparent'}]}
      >
        <View style={[styles.themeDemoButtonRow,{backgroundColor: themes[themeName].REMOTE_BACKGROUND_COLOR}]}>
          {[0,0,0].map((item, i) => this.renderThemeDemoButton(themeName, i))}
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const { baseUrls, scanning, theme } = this.props
    const { MODAL_BACKGROUND_COLOR, BUTTON_EDIT_COLOR, TEXT_COLOR_LIGHT, TEXT_COLOR_DARK } = themes[theme]
    return (
      <View style={styles.wrapper}>
        <View style={[styles.container, { backgroundColor: MODAL_BACKGROUND_COLOR }]}>

          <ScrollView style={styles.scrollView}>

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{color: TEXT_COLOR_DARK, fontWeight: 'bold', fontSize: 15, }}>{`${baseUrls.length} lighthouse${baseUrls.length > 1 ? 's' : ''} connected:`}</Text>
              {baseUrls.map(url => <Text key={url}>{url}</Text>)}
            </View>


            <TouchableOpacity
              style={[styles.scanButton, { backgroundColor: BUTTON_EDIT_COLOR }]}
              onPress={this.props.findDevicesOnNetwork}
            >
              {scanning ?
                <ActivityIndicator small color={TEXT_COLOR_LIGHT} /> :
                <Text style={{color: TEXT_COLOR_LIGHT}}>Scan Network</Text>
              }
            </TouchableOpacity>
            <View style={{paddingVertical: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <View style={{flexDirection: 'column'}}>
                <Text style={{color: TEXT_COLOR_DARK, fontWeight: 'bold', fontSize: 14}}>Testing Mode</Text>
                <Text style={{color: TEXT_COLOR_DARK, fontSize: 12}}>Blink LED on transmit & discovery</Text>
              </View>
              <Switch
                onValueChange={() => {
                  this.setState({ testingValue: !this.props.testing })
                  this.props.setTestingMode(!this.props.testing)
                }}
                value={this.state.testingValue}
              />
            </View>
            <Text style={{color: TEXT_COLOR_DARK, fontWeight: 'bold', fontSize: 14}}>Theme</Text>
            {themeList.map(this.renderThemeOption)}

          </ScrollView>

          <View style={styles.confirmButtonContainer}>
            <TextButton
              text="Done"
              buttonStyle={styles.confirmButton}
              onPress={this.onDonePress}
            />
          </View>
        </View>
      </View>
    )
  }
}

SelectRemoteIconModal.defaultProps = {
  onSubmit: () => {},
}

const mapStateToProps = state => ({
  baseUrls: state.network.baseUrls,
  scanning: state.network.scanning,
  theme: state.settings.theme,
  currentRemoteId: state.app.currentRemoteId,
  remote: state.remotes[state.app.currentRemoteId],
  testing: state.network.testing,
})

const mapDispatchToProps = (dispatch) => ({
  findDevicesOnNetwork: () => dispatch(findDevicesOnNetwork()),
  updateRemote: (remoteId, updatedRemote) => dispatch(updateRemote(remoteId, updatedRemote)),
  setHeaderModal: modal => dispatch(setHeaderModal(modal)),
  setTheme: theme => dispatch(setTheme(theme)),
  setTestingMode: isTesting => dispatch(setTestingMode(isTesting)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectRemoteIconModal)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: BUTTON_RADIUS,
  },
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    padding: 10,
  },
  categoryTitle: {
    marginTop: 10,
    fontSize: 15,
    borderBottomWidth: 0.5,
  },
  confirmButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    height: 60,
  },
  confirmButton: {
    padding: 20,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  icon: {
    width: 40,
    height: 40,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    borderRadius: BUTTON_RADIUS,
  },
  scanButton: {
    height: 40,
    padding: 10,
    margin: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BUTTON_RADIUS,
  },
  scrollView: {
    flex: 6,
    padding: 10,
  },
  option: {
    padding: 10,
  },
  textInput: {
    flex: 1,
    height: 45,
    padding: 5,
    marginBottom: 13,
    borderRadius: BUTTON_RADIUS,
    backgroundColor: 'rgba(0, 0, 0, .1)',
  },
  themeDemoButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: BUTTON_RADIUS
  },
  themeDemoButton: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    flex: 1,
    margin: 10,
    borderRadius: BUTTON_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30
  },
  themeDemoButtonInner: {
    padding: 10,
    borderRadius: 30
  }
})

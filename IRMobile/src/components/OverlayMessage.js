import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { iPhoneXOffset } from '../utils'

import { LIGHT_ORANGE } from '../constants/colors'
import { GENERAL_SETTINGS } from '../constants/ui'
import { setHeaderModal } from '../actions'


class OverlayMessage extends Component {

  static propTypes = {
    modalVisible: PropTypes.string.isRequired,
    numLighthouses: PropTypes.number.isRequired,
  }

  render() {
    const { numLighthouses, modalVisible } = this.props
    if (numLighthouses > 0 || modalVisible) return null
    return (
      <View pointerEvents="box-none" style={{ ...StyleSheet.absoluteFillObject }}>
        <View pointerEvents="box-none" style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <View pointerEvents="none" />
          <TouchableOpacity onPress={() => this.props.setHeaderModal(GENERAL_SETTINGS)} style={styles.alertContainer}>
            <Icon name="alert-box" size={25} color="#fff" />
            <Text style={styles.title}>No lighthouse connected</Text>
            <Text style={styles.subTitle}>Re-scan in settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  modalVisible: state.app.modalVisible,
  numLighthouses: state.network.ipAddresses ? state.network.ipAddresses.length : 0
})

const mapDispatchToProps = {
  setHeaderModal
}
export default connect(mapStateToProps, mapDispatchToProps)(OverlayMessage)

const styles = StyleSheet.create({
  alertContainer: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginLeft: 10,
    marginBottom: 60 + (iPhoneXOffset * 1.5),
    borderRadius: 3,
    backgroundColor: LIGHT_ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '200'
  },
  subTitle: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '200',
    padding: 3,
  }
})

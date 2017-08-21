import React, { Component } from 'react'
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  Text,
}  from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { LIGHT_GREY, PRIMARY_LIGHT, RECORDING_IN_PROGRESS_COLOR, STATUS_GOOD_COLOR, STATUS_BAD_COLOR } from '../constants/colors'
import { BUTTON_RADIUS } from '../constants/style'

const PULSE_RATE = 750

class RemoteButton extends Component {

  pulseAnim = new Animated.Value(0)
  statusAnim = new Animated.Value(0)

  state = {
    irCaptureStatus: null,
  }

  componentDidUpdate(prevProps) {
    const isRecording = this.props.recording === this.props.id
    const hasNewStatus = (this.props.status !== null) && (prevProps.status !== this.props.status)
    if ((prevProps.recording !== this.props.id) && isRecording) this.pulseBackground()
    if (isRecording && hasNewStatus) this.onStatusChanged()
  }

  pulseBackground = () => {
    if (this.props.recording !== this.props.id) return

    Animated.timing(this.pulseAnim, {
      toValue: 1,
      duration: PULSE_RATE,
    }).start(() => {
      Animated.timing(this.pulseAnim, {
        toValue: 0,
        duration: PULSE_RATE,
      }).start(() => this.pulseBackground())
    })
  }

  onStatusChanged = () => {
    Animated.timing(this.statusAnim, {
      toValue: 1,
      duration: 250,
    }).start(() => {
      Animated.timing(this.statusAnim, {
        toValue: 0,
        duration: 250,
      }).start(() => {
        this.props.onStatusChangeEnd()
      })
    })
  }



  render() {
    const { id, style, text, iconName, onPress = () => {}, recording, status, color } = this.props
    const isRecording = recording === id
    const hasStatus = status !== null
    const flashColor = status ? STATUS_GOOD_COLOR : STATUS_BAD_COLOR

    const pulseStyle = {
        backgroundColor: this.pulseAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [PRIMARY_LIGHT, RECORDING_IN_PROGRESS_COLOR]
        })
      }

    const statusStyle = {
      backgroundColor: this.statusAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [PRIMARY_LIGHT, PRIMARY_LIGHT, flashColor]
      })
    }

    return (
      <Animated.View
        style={[styles.animatedContainer, isRecording && pulseStyle, hasStatus && statusStyle, style]}
      >
        <TouchableOpacity
          onPress={() => onPress(id)}
          style={styles.touchable}
        >
          <Icon name={iconName} size={30} color={color || LIGHT_GREY} />
          { text &&
            <Text style={styles.text}>
              {text}
            </Text>
          }
        </TouchableOpacity>
      </Animated.View>
      )
    }
}


export default RemoteButton

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,

  },
  text: {
    color: '#ddd',
    fontWeight: 'bold',
    fontSize: 20,
  },
  animatedContainer: {
    flex: 1,

    margin: 15,
    height: 75,
    width: 120,
    borderRadius: BUTTON_RADIUS,
    backgroundColor: PRIMARY_LIGHT,
  }
})

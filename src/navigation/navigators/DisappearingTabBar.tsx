import React, { PureComponent } from "react";
import { EmitterSubscription, Keyboard, Platform } from "react-native";
import { BottomTabBarProps, BottomTabBar } from "react-navigation";

interface State {
  readonly visible: boolean;
}

export default class DisappearingTabBar extends PureComponent<BottomTabBarProps, State> {
  readonly state = { visible: true };

  keyboardDidShowListener: EmitterSubscription | null = null;
  keyboardDidHideListener: EmitterSubscription | null = null;

  componentDidMount = () => {
    if (Platform.OS === "android") {
      this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", this.visible(false));
      this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", this.visible(true));
    }
  };

  visible = (visible: boolean) => () => this.setState({ visible });

  componentWillUnmount = () => {
    this.keyboardDidShowListener!.remove();
    this.keyboardDidHideListener!.remove();
  };

  render() {
    if (!this.state.visible) {
      return null;
    } else {
      return <BottomTabBar {...this.props} />;
    }
  }
}
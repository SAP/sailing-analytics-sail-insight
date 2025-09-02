import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {connect} from 'react-redux';
import {
  startPollingLeaderboard,
  stopPollingLeaderboard,
} from 'actions/leaderboards';

type OwnProps = { rankOnly: boolean };
type InjectedProps = {
  startPollingLeaderboard: typeof startPollingLeaderboard;
  stopPollingLeaderboard: typeof stopPollingLeaderboard;
};
type NavProp = ReturnType<typeof useNavigation>;
type Props = OwnProps & InjectedProps & { navigation: NavProp };

class LeaderboardFetcherInner extends React.PureComponent<Props> {
  private removeFocusListener?: () => void;
  private removeBlurListener?: () => void;

  componentDidMount() {
    const {navigation} = this.props;
    this.removeFocusListener = navigation.addListener('focus', this.onFocus);
    this.removeBlurListener  = navigation.addListener('blur',  this.onBlur);

    // If we're already focused when mounted, run once
    if (navigation.isFocused?.()) {
      this.onFocus();
    }
  }

  componentWillUnmount() {
    this.removeFocusListener?.();
    this.removeBlurListener?.();
    this.onBlur(); // mirror cleanup
  }

  private onFocus = () => {
    setTimeout(
        () => this.props.startPollingLeaderboard({rankOnly: this.props.rankOnly}),
        1000
    );
  };

  private onBlur = () => {
    this.props.stopPollingLeaderboard();
  };

  render() {
    return null;
  }
}

const ConnectedInner = connect<null, InjectedProps, OwnProps>(
    null,
    { startPollingLeaderboard, stopPollingLeaderboard }
)(LeaderboardFetcherInner);

// Wrapper that is the ONLY place a hook is used
export default function LeaderboardFetcher(props: OwnProps) {
  const navigation = useNavigation();
  return <ConnectedInner {...props} navigation={navigation} />;
}

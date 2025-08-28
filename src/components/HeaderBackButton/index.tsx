import React from 'react';
import { HeaderBackButton as RNHeaderBackButton } from '@react-navigation/elements';

// Re-export a simple component so you can use it in JSX.
type Props = React.ComponentProps<typeof RNHeaderBackButton>;

const HeaderBackButton: React.FC<Props> = (props) => (
    <RNHeaderBackButton tintColor="white" labelVisible={false} {...props} />
);

export default HeaderBackButton;

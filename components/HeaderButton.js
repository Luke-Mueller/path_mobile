import React from 'react';
import { HeaderButton } from 'react-navigation-header-buttons';
import { Feather } from '@expo/vector-icons';

import Color from '../constants/color';

const HeaderBtn = props => {
  return (
    <HeaderButton
      {...props}
      iconSize={23}
      color={Color.black}
    />
  );
};

export default HeaderBtn;

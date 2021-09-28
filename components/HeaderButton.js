import React from 'react';
import { HeaderButton } from 'react-navigation-header-buttons';

const HeaderBtn = props => {
  return (
    <HeaderButton
      {...props}
      iconSize={23}
    />
  );
};

export default HeaderBtn;

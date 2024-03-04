import React from 'react';
import PropTypes from 'prop-types';
import defaultImg from 'assets/images/profile/profile-picture-6.jpg';
import { uiStyles } from './Users.styles';
import { titles } from './Users.texts';
import { genConst } from 'store/constant';

const UsersNetworkChild = ({ avatar, name, lastName, email, state }) => {
  return (
    <center>
      <img style={uiStyles.imagePic} src={avatar || defaultImg} alt={titles.altImage} />
      <p style={uiStyles.name}>{name + ' ' + lastName}</p>
      <p style={uiStyles.email}>{email}</p>
      {state == genConst.CONST_STATE_IN ? (
        <p style={uiStyles.stateNoActive}>{titles.noActive}</p>
      ) : (
        <p style={uiStyles.stateActive}>{titles.active}</p>
      )}
    </center>
  );
};

UsersNetworkChild.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string,
  state: PropTypes.number
};

export default UsersNetworkChild;

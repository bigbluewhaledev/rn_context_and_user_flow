import React from 'react';
import {View} from 'react-native';

import Svg, {Path} from 'react-native-svg';

export default class LockPadIcon extends React.Component {
  render() {
    return (
      <Svg
        height={this.props.size}
        width={this.props.size * 0.6196943972835314091680814941}
        viewBox="0 0 365 589">
        <Path
          d="M0.15 233.481V406.37c0 100.393 81.677 182.07 182.07 182.07 100.393 0 182.071 -81.678 182.071 -182.07V233.482c0 -5.071 -4.111 -9.18 -9.182 -9.18H9.33a9.18 9.18 0 0 0 -9.18 9.179zm199.36 202.165v57.17c0 9.557 -7.732 17.289 -17.29 17.289 -9.557 0 -17.289 -7.732 -17.289 -17.289v-57.17c-10.132 -6.01 -17.289 -16.613 -17.289 -29.275 0 -19.112 15.465 -34.578 34.578 -34.578 19.112 0 34.579 15.466 34.579 34.578 0 12.662 -7.158 23.266 -17.289 29.275z"
          fill="#11342F"
          fillRule="nonzero"
        />
        <Path
          d="M303.225 201.119l34.578 0.131h0.018a4.592 4.592 0 0 0 4.592 -4.59v-36.469C342.413 71.861 270.551 0 182.22 0 93.89 0 22.029 71.864 22.029 160.191v36.469a4.596 4.596 0 0 0 4.59 4.59h0.019l34.578 -0.131a4.59 4.59 0 0 0 4.572 -4.59v-36.337c0 -64.202 52.231 -116.433 116.433 -116.433S298.653 95.99 298.653 160.192v36.337a4.59 4.59 0 0 0 4.572 4.59z"
          fill="#11342F"
          fillRule="nonzero"
        />
      </Svg>
    );
  }
}

'use strict';

import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import React from 'react';
import cloneReferencedElement from 'react-clone-referenced-element';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import ScrollableMixin from 'react-native-scrollable-mixin';

type DefaultProps = {
  renderScrollComponent: (props: Object) => ReactElement;
};

let InvertibleScrollView = createReactClass({
  mixins: [ScrollableMixin],

  propTypes: {
    ...ScrollView.propTypes,
    inverted: PropTypes.bool,
    renderScrollComponent: PropTypes.func.isRequired,
  },

  getDefaultProps(): DefaultProps {
    return {
      renderScrollComponent: props => <ScrollView {...props} />,
    };
  },

  getScrollResponder(): ReactComponent {
    return this._scrollComponent.getScrollResponder();
  },

  setNativeProps(props: Object) {
    this._scrollComponent.setNativeProps(props);
  },

  render() {
    var {
      inverted,
      renderScrollComponent,
      ...props,
    } = this.props;

    if (inverted) {
      if (this.props.horizontal) {
        props.style = [styles.horizontallyInverted, props.style];
        props.children = this._renderInvertedChildren(props.children, styles.horizontallyInverted);
      } else {
        props.style = [styles.verticallyInverted, props.style];
        props.children = this._renderInvertedChildren(props.children, styles.verticallyInverted);
      }
    }

    return cloneReferencedElement(renderScrollComponent(props), {
      ref: component => { this._scrollComponent = component; },
    });
  },

  _renderInvertedChildren(children, inversionStyle) {
    return React.Children.map(children, child => {
      return child ? <View style={inversionStyle}>{child}</View> : child;
    });
  },
});

// Added fix to Android 7.0.0 (mostly Huawei phones)
// https://github.com/expo/react-native-invertible-scroll-view/pull/46
// This should be fixed in RN 0.48 and thus this fork should no longer be used.

let styles = StyleSheet.create({
    verticallyInverted: Platform.select({
        ios: {
            flex: 1,
            transform: [
                { scaleY: -1 },
            ],
        },
        android: {
            flex: 1,
            scaleY: -1,
        },
    }),
    horizontallyInverted: Platform.select({
        ios: {
            flex: 1,
            transform: [
                { scaleX: -1 },
            ],
        },
        android: {
            flex: 1,
            scaleX: -1,
        },
    }),
});

module.exports = InvertibleScrollView;

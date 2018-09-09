import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const notFoundInReduxMessage = field =>
  console.error(
    "withRedux Error: No Reducer found for",
    `${field}.`,
    "You may need to add the following to redux/reducers/index.js ~",
    `import ${field}, * as ${field}Actions from './${field}';`
  );

const withRedux = (reducers, actionsBank, WrappedComponent, withState = true, withActions = true) => {
  const HOC = class HOC extends PureComponent {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  const mapState = state => {
    const stateObj = {};

    reducers.forEach(reducer => {
      if (actionsBank[reducer]) {
        Object.assign(stateObj, { [reducer]: state[reducer] });
      } else {
        notFoundInReduxMessage(reducer);
      }
    });

    return stateObj;
  };

  const mapDispatch = dispatch => {
    const Actions = {};

    reducers.forEach(reducer => {
      if (actionsBank[reducer]) {
        const actionName = `${[reducer]}Actions`;
        Object.assign(Actions, {
          [actionName]: bindActionCreators(actionsBank[reducer], dispatch)
        });
      } else {
        notFoundInReduxMessage(reducer);
      }
    });

    return Actions;
  };

  return connect(
    withState ? mapState : null,
    withActions ? mapDispatch : {}
  )(HOC);
};

export default withRedux;

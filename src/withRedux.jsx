import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const notFoundInReduxMessage = field => {
  throw new Error(
    `withRedux: No Reducer found for ${field}. You may need to add the following to redux/reducers/index.js ~ import ${field}, * as ${field}Actions from './${field}';`
  );
};

const stateNotFound = (stateName, reducer, component) => {
  throw new Error(`withRedux State Error: No Key of "${stateName}" found in ${reducer}. Check the specific state requested of withRedux in ${component}`);
};

const actionNotFound = (actionName, reducer, component) => {
  throw new Error(`withRedux Action Error: No Action called "${actionName}" found in ${reducer}. Check the specific actions requested of withRedux in ${component}`);
};

const withRedux = (reducers, actionsBank, WrappedComponent, specificState = true, specificActions = true) => {
  const HOC = class HOC extends PureComponent {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  const mapState = state => {
    const stateObj = {};

    reducers.forEach(reducer => {
      if (actionsBank[reducer]) {
        if (typeof specificState === "object" && specificState[reducer]) {
          const currentWanted = specificState[reducer];

          currentWanted.forEach(key => {
            const { [key]: val } = state[reducer];
            const wantedState = { [key]: val };

            if (!{}.hasOwnProperty.call(state[reducer], key)) {
              stateNotFound(key, reducer, `${WrappedComponent.name}`);
            }

            Object.assign(stateObj, { [reducer]: { ...stateObj[reducer], ...wantedState } });
          });
        } else {
          Object.assign(stateObj, { [reducer]: state[reducer] });
        }
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
        if (typeof specificActions === "object" && specificActions[reducer]) {
          const currentWanted = specificActions[reducer];

          currentWanted.forEach(key => {
            const { [key]: val } = actionsBank[reducer];
            const wantedAction = { [key]: val };

            if (typeof wantedAction[key] !== "function") actionNotFound(key, actionName, `${WrappedComponent.name}`);

            Object.assign(Actions, { [actionName]: { ...Actions[reducer], ...wantedAction } });
          });
        } else {
          Object.assign(Actions, {
            [actionName]: bindActionCreators(actionsBank[reducer], dispatch)
          });
        }
      } else {
        notFoundInReduxMessage(reducer);
      }
    });

    return Actions;
  };

  return connect(
    specificState ? mapState : null,
    specificActions ? mapDispatch : {}
  )(HOC);
};

export default withRedux;

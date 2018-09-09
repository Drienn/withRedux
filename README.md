# with-redux-hoc

An HOC to simplify hooking redux up with your React Components.

## Getting Started

`npm install with-redux-hoc`

### Prerequisites

In order to use this HOC, you'll need to add an exported object from your reducer/index.js called *actionsBank* which will contain key value pairs that will look like this: 

`[reducer]: [reducer]Actions`

Depending on your style of doing redux, use the applicable examples below:

* for the style of having just one reducer file that holds both actions and reducers, do something like this:
```
import posts, * as postsActions from './posts'; //Or whatever paths
import authors, * as authorsActions from './authors';
import comments, * as commentsActions from './comments';
```

* for the style of having actions and reducers in their own seperate folders, do something like this:
```
import posts from "./posts"; //Or whatever paths
import authors from "./authors";
import comments from "./comments";
import * as postsActions from "../actions/posts";
import * as authorsActions from "../actions/authors";
import * as commentsActions from "../actions/comments";
```

*  Then create and export the _actionsBank_ object which in this example, would look like this: 
```
export const actionsBank = {
  posts: postsActions,
  authors: authorsActions,
  comments: commentsActions
};
```

### Use

Import with-redux-hoc (and the cool thing is you won't need to import anything from redux at all! withRedux will take care of it all :-D )

`import withRedux from 'with-redux-hoc';`

The withRedux params look like this:

`withRedux(reducers, actionsBank, WrappedComponent, withState = true, withActions = true)`

*   about withState and withActions

> withState and withActions are optional, if you don't pass them in, you'll just get all the state and all the actions that you ask for. 

> Sometimes it's only necessary to have the redux state or the redux actions and not both. These options just give a little more flexibility to your component.

The real "magic" is in the first argument, reducers. reducers will be an array of strings that will match the keys you have set in your redux store.

### Example

_reducer/index.js_
```
import { combineReducers } from "redux";
import posts from "./posts";
import authors from "./authors";
import comments from "./comments";
import * as postActions from "../actions/posts";
import * as authorsActions from "../actions/authors";
import * as commentsActions from "../actions/comments";

export const actionsBank = {
  posts: postActions,
  authors: authorsActions,
  comments: commentsActions
};

const rootReducer = combineReducers({
  posts,
  authors,
  comments
});
export default rootReducer;
```

_Example.js_

```
import React, { Component } from "react";
import withRedux from "with-redux-hoc";
import { actionsBank } from '../../reducers'; //or wherever

class Example extends Component {
  render() {
    return <div>I'm an Example of withRedux!</div>;
  }
}

export default withRedux(['authors'], actionsBank, Example);
```

And that's it! Example is totally hooked up to your redux, ready for use. You get props that look like this:

`Example Component's Props: {authors: Array(10), authorsActions: {…}}`

Also to clairify, You can pull in as many keys as you need.

_just changing the last line of Example.js_

```
export default withRedux(['authors', 'posts'], actionsBank, Example);
```

props will be: 

`Example Component's Props: {authors: Array(10), posts: Array(100), authorsActions: {…}, postsActions: {…}}`

and so on...
```
export default withRedux(['authors', 'posts', 'comments'], actionsBank, Example);
```

props will be: 

`Example Component's Props: {authors: Array(10), posts: Array(100), comments: Array(500), authorsActions: {…}, postsActions: {…}, …}`

### Why Use?

I got tired of writing all of those imports and making those `mapStateToProps` and `mapDispatchToProps` functions in every component I needed to hook up to redux. This HOC component cuts down on a lot of boiler plate when connecting components to redux :-).


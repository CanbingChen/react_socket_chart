import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// import { RouteTransition } from 'react-router-transition';

import asyncComponent from 'UTILS/asyncComponent';
// bind redux store through react-redux
// import { Provider } from 'react-redux';
// import store from 'REDUX/store';

const Query = asyncComponent(() =>
  import(/* webpackChunkName = "HomePage" */ 'CONTAINER/Query').then(
    module => module.default
  )
);
const Detail = asyncComponent(() =>
  import(/* webpackChunkName = "HomePage" */ 'CONTAINER/Detail').then(
    module => module.default
  )
);
const Parts = asyncComponent(() =>
  import(/* webpackChunkName = "HomePage" */ 'CONTAINER/Parts').then(
    module => module.default
  )
);
const Chart = asyncComponent(() =>
    import(/* webpackChunkName = "HomePage" */ 'CONTAINER/Chart').then(
        module => module.default
    )
)

export default () => (
  <BrowserRouter>
    <div>
        <Route
          exact
          path="/"
          render={props => <Chart {...props} name="Chart" />}
        />
      <Route
        exact
        path="/query"
        render={props => <Query {...props} name="query" />}
      />
      <Route
        exact
        path="/detail"
        render={props => <Detail {...props} name="detail" />}
      />
      <Route
        exact
        path="/parts"
        render={props => <Parts {...props} name="parts" />}
      />
    </div>
  </BrowserRouter>
);

import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from 'antd';
import registerServiceWorker from './registerServiceWorker';
import { HashRouter, Route, Switch} from 'react-router-dom'
import MyHeader from './components/Header';
import GlobalFooter from 'ant-design-pro/lib/GlobalFooter';

import Introduction from './pages/Introduction';
import Dataset from  './pages/Dataset';
import SignedGraph from  './pages/SignedGraph';
import Instructions from './pages/Instructions';

import 'ant-design-pro/dist/ant-design-pro.css';
import './index.css';

const copyright = <div>Created by Huangjunjie Powered by Ant Design <Icon type="copyright" /> 2018</div>;

const PrimaryLayout = () => (
  <div className="primary-layout">
    <MyHeader />
    <main>
      <Switch>
        <Route path="/" exact component={Introduction} />
        <Route path="/introduction" component={Introduction} />
        <Route path="/dataset" component={Dataset} />
        <Route path="/instructions" component={Instructions} />
        <Route path="/signed-graph" component={SignedGraph} />
      </Switch>
    </main>
    <div style={{ background: '#f5f5f5', overflow: 'hidden' }}>
            <GlobalFooter copyright={copyright} />
    </div>
  </div>
)
const App = () => (
    <HashRouter>
      <PrimaryLayout />
    </HashRouter>
)

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

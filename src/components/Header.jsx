import React from 'react';
import { Layout, Menu, Row, Col, Icon, Popover, Input, Badge, Button } from 'antd';
import { Link } from 'react-router-dom';
import { enquireScreen } from 'enquire-js';

import './header.css';

const { Header, Content, Footer } = Layout;

let isMobile = false;
enquireScreen((b) => {
  isMobile = b;
});

export default class MyHeader extends React.Component {

    state = {
        menuVisible: false,
        isMobile: isMobile
    }

    handleShowMenu = () => {
        this.setState({
          menuVisible: true,
        });
    }

    handleHideMenu = () => {
        this.setState({
          menuVisible: false,
        });
    }

    onMenuVisibleChange = (visible) => {
        this.setState({
          menuVisible: visible,
        });
    }

    component

    componentDidMount(){
      enquireScreen((b) => {
        this.setState({
          isMobile: !!b,
        });
      });
    }


    render(){
        let defaultKey = window.location.pathname;
        defaultKey = defaultKey.length > 1 ? defaultKey : '/introduction';
        const menuMode = this.state.isMobile ? 'inline' : 'horizontal';
        const menu = [
          <div className="logo"/>
          ,<Menu
            theme="dark"
            id="nav"
            key="nav"
            mode={menuMode}
            defaultSelectedKeys={defaultKey}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="/introduction">
              <Link to="/introduction">Introduction</Link>
              </Menu.Item>
            <Menu.Item key="/dataset">
              <Link to="/dataset">Data Description</Link>
            </Menu.Item>
            <Menu.Item key="/instructions">
              <Link to="instructions">Instructions</Link>
            </Menu.Item>
            <Menu.Item key="/signed-graph">
              <Link to="signed-graph">Signed Graph Analysis</Link>
            </Menu.Item>
          </Menu>]

        return <header id="header">
          {this.state.isMobile && (<Popover
              overlayClassName="popover-menu"
              placement="bottomRight"
              content={menu}
              trigger="click"
              visible={this.state.menuVisible}
              arrowPointAtCenter
              onVisibleChange={this.onMenuVisibleChange}
            >
              <Icon
                className="nav-phone-icon"
                type="bars"
                style={{backrgoundColor: '#fff', fontSize: 30}}
                onClick={this.handleShowMenu}
              />
          </Popover>)
          }
            <Row>
              {!this.state.isMobile && menu}
            </Row> 
          
        </header>
    }


}
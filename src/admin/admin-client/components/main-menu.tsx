import * as React from 'react';
import { connect } from 'react-redux';
import MainMenuItem from './main-menu-item';

export default class MainMenu extends React.Component {
  constructor(props) {
    super(props);
  }
  createMenu() {
    let menuList = [
      {label: "포크봇 비밀번호", className: "team-settings"},
      {label: "보이스 초기화", className: "similar-words-reset"},
      {label: "리모콘 초기화", className: "speeds-reset"},
      {label: "옵션설정", className: "options"},
      {label: "관리자 비밀번호", className: "admin-passwords"},
      {label: "초기화", className: "reset"},
    ];
    var tagList: JSX.Element[] = [];
    menuList.forEach((menuItem) => {
      tagList.push(
        <MainMenuItem className={menuItem.className} label={menuItem.label} key={menuItem.className}></MainMenuItem>
      );
    });
    return tagList;
  }
  render() {
    return (
      <ul className="main-menu list-unstyled">
        {this.createMenu()}
      </ul>
    );
  }
}
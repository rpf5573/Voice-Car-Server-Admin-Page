import * as React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Row, Col, Form } from 'reactstrap';
import axios from 'axios';
import {AxiosRequestConfig} from 'axios';

// css
import 'bootstrap/dist/css/bootstrap.css';
import '../scss/style.scss';

type Props = {}
type States = {}
class LoginPage extends React.Component<Props, States> {
  private inputRef = React.createRef<HTMLInputElement>();
  constructor(props: Props) {
    super(props);
  }
  onSubmitForm = () => {
    const value: string = this.inputRef.current.value;
    if ( ! value ) {
      alert("비밀번호를 입력해주세요");
      return;
    }
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: '/admin/login',
      data: {
        password: value
      }
    };
    axios(config)
      .then((res) => {
        if ( res.data.error ) { alert(res.data.error); return true; }
        window.location.href = '/admin';
      })
      .catch((err) => {
        console.log(err);
        alert("알수없는 에러가 발생했습니다");
      });
  }
  render() {
    return (
      <div className="login-page">
        <div className="wrapper">
          <input type="text" name="password" className="form-control" placeholder="관리자 비밀번호를 입력해주세요" ref={this.inputRef} />
          <Button color="primary" onClick={this.onSubmitForm}>로그인</Button>
        </div>
      </div>
    );
  }
}

export default LoginPage;
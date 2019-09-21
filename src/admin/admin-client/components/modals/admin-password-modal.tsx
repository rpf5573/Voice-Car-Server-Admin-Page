import * as React from 'react';
import { connect } from 'react-redux';
import utils from '../../../../utils/client';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Row, Col, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { closeModal, updateAdminPasswords } from '../../actions';
import axios from 'axios';
import {AxiosResponse} from 'axios';
import '../../../../types';

type Props = {
  closeModal: () => void,
  activeModalClassName: string,
  className: string,
  admin: string,
  updateAdminPasswords: (passwords: Admin.AdminPassword) => void
}
type States = {
  backdrop: boolean,
}
class AdminPasswordModal extends React.Component<Props, States> {
  constructor(props) {
    super(props);
    this.state = {
      backdrop: true,
    };
    this.close = this.close.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }
  passwordInputFields = [];
  adminInput = React.createRef<HTMLInputElement>();

  close() {
    this.props.closeModal();
  }
  
  async handleFormSubmit(e) {
    e.preventDefault();

    if ( !this.adminInput!.current!.value ) {
      alert("ERROR : 비밀번호를 입력해 주시기 바랍니다");
      return;
    }
    const config = {
      method: 'POST',
      url: '/admin/admin-passwords/passwords',
      data: {
        adminPasswords: {
          admin: (this.adminInput!.current!.value ? this.adminInput!.current!.value : this.props.admin)
        }
      }
    };
    utils.simpleAxios(axios, config).then(() => {
      this.props.updateAdminPasswords(config.data.adminPasswords);
      alert( '성공' );
      if ( this.adminInput.current.value ) {
        this.adminInput.current.placeholder = this.adminInput.current.value;
        this.adminInput.current.value = '';
      }
    });
  }

  render() {
    return (
      <Modal isOpen={ (this.props.activeModalClassName == this.props.className) ? true : false } toggle={this.close} className={this.props.className} size="sm">
        <form id="form-admin-passwords" onSubmit={this.handleFormSubmit}>
          <ModalHeader toggle={this.close}>
            <span>관리자 비밀번호 설정</span>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col xs="12">
                <Label>관리자</Label>
                <input className="form-control" placeholder={this.props.admin} ref={this.adminInput}></input>
              </Col>
              <div className="divider--uncolor"></div>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">적용</Button>
            <Button color="secondary" onClick={this.close}>취소</Button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    activeModalClassName : state.modalControl.activeModalClassName,
    admin: state.adminPasswords.admin,
  };
}

export default connect(mapStateToProps, { closeModal, updateAdminPasswords })(AdminPasswordModal);
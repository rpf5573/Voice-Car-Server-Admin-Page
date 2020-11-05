import * as React from 'react';
import { connect } from 'react-redux';
import utils from '../../../../utils/client';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Row, Col, InputGroup, InputGroupAddon } from 'reactstrap';
import { closeModal } from '../../actions';
import axios from 'axios';

type Props = {
  closeModal: () => void,
  activeModalClassName: string,
  className: string,
  admin: string,
}
type States = {
  backdrop: boolean,
  isResetReady: boolean
}
class ResetModal extends React.Component<Props, States> {
  constructor(props) {
    super(props);
    this.state = {
      backdrop: true,
      isResetReady: false
    };
    this.close = this.close.bind(this);
    this.handleResetInput = this.handleResetInput.bind(this);
    this.handleResetBtn = this.handleResetBtn.bind(this);
  }
  pointInputFields = [];

  close() {
    this.props.closeModal();
  }

  handleResetInput(e) {
    let val = e.currentTarget.value;
    if ( val == 'reset' ) {
      this.setState({
        isResetReady: true
      });
    } else {
      this.setState({
        isResetReady: false
      });
    }
  }

  async handleResetBtn(e) {
    if ( this.state.isResetReady ) {
      const config = {
        method: 'POST',
        url: '/admin/reset',
        data: {
          resetPassword: 'discovery_reset'
        }
      };
      utils.simpleAxios(axios, config).then(() => {
        alert( "성공 !" );
        window.location.reload(); // refresh
      });
    } else {
      alert( "ERROR : 다시 확인해 주세요" );
    }
  }

  render() {
    return (
      <Modal isOpen={ (this.props.activeModalClassName == this.props.className) ? true : false } toggle={this.close} className={this.props.className} size="sm">
        <ModalHeader toggle={this.close}>
          <span>초기화</span>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col className="notice-before-reset">
              주의 : 보이스/리모콘은 관리자 기본값으로 설정되고 포크봇 비밀번호는 모두 0으로 초기화됩니다. 또한, 사용자는 속도값과 음성단어를 직접 입력하지 못하게 됩니다. 
              <p>즉, 초기화를 하면 교육생들은 관리자가
              미리 세팅해놓은 속도값과 단어만을 사용하게 됩니다.</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <Label>
                아래에 reset을 입력하세요
              </Label>
              <Input placeholder="reset" onChange={this.handleResetInput}></Input>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.handleResetBtn}>확인</Button> 
          <Button color="secondary" onClick={this.close}>취소</Button>  
        </ModalFooter>
      </Modal>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    activeModalClassName : state.modalControl.activeModalClassName,
  };
}

export default connect(mapStateToProps, { closeModal })(ResetModal);
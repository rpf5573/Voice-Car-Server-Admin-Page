import * as React from 'react';
import { connect } from 'react-redux';
import utils from '../../../../utils/client';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Row, Col } from 'reactstrap';
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
class SpeedsResetModal extends React.Component<Props, States> {
  constructor(props) {
    super(props);
    this.state = {
      backdrop: true,
      isResetReady: false
    };
  }
  pointInputFields = [];

  close = () => {
    this.props.closeModal();
  }
  handleResetToDefault = async (e) => {
    const config = {
      method: 'POST',
      url: '/admin/speeds-reset/default',
      data: {}
    };
    utils.simpleAxios(axios, config).then(() => {
      alert( "성공 !" );
    });
  }
  handleResetToZero = async (e) => {
    const config = {
      method: 'POST',
      url: '/admin/speeds-reset/zero',
      data: {}
    };
    utils.simpleAxios(axios, config).then(() => {
      alert( "성공 !" );
    });
  }

  render() {
    return (
      <Modal isOpen={ (this.props.activeModalClassName == this.props.className) ? true : false } toggle={this.close} className={this.props.className} size="sm">
        <ModalHeader toggle={this.close}>
          <span>초기화</span>
        </ModalHeader>
        <ModalBody>
          <Row className="mb-10">
            <Col>
              <Button color="success" onClick={this.handleResetToDefault}>관리자 기본값 초기화</Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button color="danger" onClick={this.handleResetToZero}>교육생 초기화</Button>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.close}>닫기</Button>
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

export default connect(mapStateToProps, { closeModal })(SpeedsResetModal);
import * as React from 'react';
import { connect } from 'react-redux';
import utils from '../../../../utils/client';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Row, Col } from 'reactstrap';
import { closeModal, updateRCUsageState } from '../../actions';
import axios from 'axios';
import 'awesome-bootstrap-checkbox';
import constants from '../../../../utils/constants';

type Props = {
  closeModal: () => void,
  updateRCUsageState: (onoff: number) => void,
  activeModalClassName: string,
  className: string,
  rcUsageState: number
}
type States = {
  backdrop: boolean,
}
class SimilarWordsResetModal extends React.Component<Props, States> {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      backdrop: true,
    };
    this.close = this.close.bind(this);
    this.updateRCUsageState = this.updateRCUsageState.bind(this);
  }

  close() {
    this.props.closeModal();
  }

  updateRCUsageState(e: React.ChangeEvent<HTMLInputElement>) {
    let val = parseInt(e.currentTarget.value);
    const config = {
      method: 'POST',
      url: '/admin/option-settings/rcUsageState',
      data: {
        rcUsageState: val
      }
    };
    utils.simpleAxios(axios, config).then(response => {
      this.props.updateRCUsageState(val);
      alert("성공");
    });
  }

  render() {
    return (
      <Modal isOpen={ (this.props.activeModalClassName == this.props.className) ? true : false } toggle={this.close} className={this.props.className} size="sm">
        <ModalHeader toggle={this.close}>
          <span>옵션 설정</span>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <div className="radio abc-radio abc-radio-primary">
                <input type="radio" id="rcUsageStateRadioInput01" onChange={this.updateRCUsageState} checked={ this.props.rcUsageState ? true : false } value={constants.ON}/>
                <label htmlFor="rcUsageStateRadioInput01">리모콘 사용하기</label>
              </div>
              <div className="radio abc-radio abc-radio-danger">
                <input type="radio" id="rcUsageStateRadioInput02" onChange={this.updateRCUsageState} checked={ this.props.rcUsageState ? false : true } value={constants.OFF}/>
                <label htmlFor="rcUsageStateRadioInput02">음성인식 사용하기</label>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    );
  }
}

function mapStateToProps(state: Admin.InitialState, ownProps) {
  console.log(state);
  return {
    activeModalClassName : state.modalControl.activeModalClassName,
    rcUsageState: state.optionSettings.rcUsageState
  };
}

export default connect(mapStateToProps, { closeModal, updateRCUsageState })(SimilarWordsResetModal);
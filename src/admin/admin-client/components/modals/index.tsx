import React, { Component } from 'react';
import TeamSettingModal from './team-setting-modal';
import UploadModal from './upload-modal';
import AdminPasswordModal from './admin-password-modal';
import ResetModal from './reset-modal';

class Modals extends Component {
  state = {  }
  render() { 
    return (
      <div className="modals">
        <TeamSettingModal className="modal--team-settings"></TeamSettingModal>
        <UploadModal className="modal--uploads"></UploadModal>
        <AdminPasswordModal className="modal--admin-passwords"></AdminPasswordModal>
        <ResetModal className="modal--reset"></ResetModal>
      </div>
    );
  }
}
 
export default Modals
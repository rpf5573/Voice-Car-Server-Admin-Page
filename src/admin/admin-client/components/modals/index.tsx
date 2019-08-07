import * as React from 'react';
import TeamSettingModal from './team-setting-modal';
import UploadModal from './upload-modal';
import OptionModal from './option-modal';
import AdminPasswordModal from './admin-password-modal';
import ResetModal from './reset-modal';

class Modals extends React.Component {
  state = {  }
  render() { 
    return (
      <div className="modals">
        <TeamSettingModal className="modal--team-settings"></TeamSettingModal>
        <UploadModal className="modal--uploads"></UploadModal>
        <OptionModal className="modal--options"></OptionModal>
        <AdminPasswordModal className="modal--admin-passwords"></AdminPasswordModal>
        <ResetModal className="modal--reset"></ResetModal>
      </div>
    );
  }
}
 
export default Modals
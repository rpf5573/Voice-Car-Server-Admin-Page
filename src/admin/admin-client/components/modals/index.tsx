import * as React from 'react';
import TeamSettingModal from './team-setting-modal';
import UploadModal from './upload-modal';
import OptionModal from './option-modal';
import AdminPasswordModal from './admin-password-modal';
import ResetModal from './reset-modal';
import SimilarWordsResetModal from './similar-words-reset-modal';
import SpeedsResetModal from './speeds-reset-modal';

class Modals extends React.Component {
  state = {  }
  render() { 
    return (
      <div className="modals">
        <TeamSettingModal className="modal--team-settings"></TeamSettingModal>
        <UploadModal className="modal--uploads"></UploadModal>
        <OptionModal className="modal--options"></OptionModal>
        <SimilarWordsResetModal className="modal--similar-words-reset"></SimilarWordsResetModal>
        <AdminPasswordModal className="modal--admin-passwords"></AdminPasswordModal>
        <ResetModal className="modal--reset"></ResetModal>
        <SpeedsResetModal className="modal--speeds-reset"></SpeedsResetModal>
      </div>
    );
  }
}
 
export default Modals
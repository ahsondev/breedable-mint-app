import Modal from 'react-modal'
import { SocialIcon } from 'react-social-icons'
import ReactTooltip from "react-tooltip"
import './AuthSelectorModal.scss'

interface PropsType {
  isOpen: boolean
  onRequestClose?(): void
  onTwitter?(): void
  onDiscord?(): void
}

const AuthSelectorModal = (props: PropsType) => {
  const { isOpen, onRequestClose, onTwitter, onDiscord } = props

  const handleClose = () => (onRequestClose && onRequestClose())

  const handleClickTwitter = () => (onTwitter && onTwitter())

  const handleClickDiscord = () => (onDiscord && onDiscord())

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      closeTimeoutMS={300}
      style={{
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#0009',
        },
        content: {
          position: 'absolute',
          top: '41px',
          left: '0',
          right: '0',
          bottom: '41px',
          border: 'none',
          background: 'var(--background-color)',
          overflow: 'hidden',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '12px',
          outline: 'none',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        },
      }}
      contentLabel='Example Modal'
    >
      <div className='auth-modal'>
        <h2>Authenticate</h2>
        <div className='button-box'>
          <button
            type='button'
            onClick={handleClickTwitter}
            data-for="main"
            data-tip="Authenticate with Twitter"
            data-iscapture="true"
          >
            <SocialIcon network="twitter" />
          </button>
          <button
            type='button'
            onClick={handleClickDiscord}
            className='btn-discord'
            data-for="main"
            data-tip="Authenticate with Discord"
            data-iscapture="true"
          >
            <SocialIcon network="discord" bgColor="#ff5a01" />
          </button>
          <ReactTooltip
            id="main"
            place="bottom"
            effect="solid"
            multiline={true}
            offset={{top: -10}}
          />
        </div>
      </div>
    </Modal>
  )
}

export default AuthSelectorModal

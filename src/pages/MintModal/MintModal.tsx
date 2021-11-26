import Modal from 'react-modal'
import './MintModal.scss'

interface PropsType {
  isOpen: boolean
  onRequestClose?(): void
  onMint?(): void
}

const MintModal = (props: PropsType) => {
  const { isOpen, onRequestClose, onMint } = props

  const handleClose = () => (onRequestClose && onRequestClose())

  const handleMint = () => (onMint && onMint())

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      closeTimeoutMS={300}
      shouldCloseOnOverlayClick={true}
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
          top: 'calc(50% - 100px)',
          left: 'calc(50% - 150px)',
          width: '300px',
          height: '200px',
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
      <div className='mint-modal'>
        <div className='comment'>
          It's time BrainDancer.<br/>
          Jack into the metaverse<br/>
          to mint your character.<br/>
        </div>
        <button type='button' className='btn-mint' onClick={handleMint}>Mint</button>
      </div>
    </Modal>
  )
}

export default MintModal

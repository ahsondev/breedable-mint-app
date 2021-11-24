import React from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import './MintButton.scoped.scss'

interface PropsType {
  disabled?: boolean
  presaleMode?: boolean
  authenticated?: boolean
  onMint?(): void
}

const MintButton = (props: PropsType) => {
  const { onMint } = props
  const { executeRecaptcha } = useGoogleReCaptcha()

  const verifyRecaptcha = async () => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available')
      return null
    }

    try {
      const newToken = await executeRecaptcha('MS_Pyme_DatosEmpresa')
      return newToken
    } catch (err) {
      return null
    }
  }

  const handleMint = async () => {
    const recaptchaStatus = await verifyRecaptcha()
    if (!recaptchaStatus) {
      console.log('Recaptcha Error')
      return
    }
    onMint && onMint()
  }

  return (
    <button onClick={handleMint} type='button' className='mint'>
      Jack In
    </button>
  )
}

export default MintButton

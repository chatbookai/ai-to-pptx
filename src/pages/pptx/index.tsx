import AiPPTX from 'src/views/AiPPTX/AiPPTX'

import { ReactNode } from 'react'

import BlankLayout from 'src/@core/layouts/BlankLayout'

const AiPPTXModel = () => {

  return (
    <AiPPTX />
  )
}

AiPPTXModel.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

AiPPTXModel.guestGuard = true

export default AiPPTXModel

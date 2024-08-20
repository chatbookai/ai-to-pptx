// ** React Imports
import { RefObject, useCallback, useRef } from 'react'

// ** Third Party Imports
import copy from 'clipboard-copy'

interface UseClipboardOptions {
  copiedTimeout?: number
  onSuccess?: () => void
  onError?: () => void
  selectOnCopy?: boolean
  selectOnError?: boolean
}

interface ClipboardAPI {
  readonly copy: (text?: string | any) => void
  readonly target: RefObject<any>
}

const isInputLike = (node: any): node is HTMLInputElement | HTMLTextAreaElement => {
  return node && (node.nodeName === 'TEXTAREA' || node.nodeName === 'INPUT')
}

const useClipboard = (options: UseClipboardOptions = {}): ClipboardAPI => {
  const targetRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null)

  const handleSuccess = () => {
    if (options.onSuccess) {
      options.onSuccess()
    }
    if (options.selectOnCopy && isInputLike(targetRef.current)) {
      targetRef.current.select()
    }
  }

  const handleError = () => {
    if (options.onError) {
      options.onError()
    }
    const selectOnError = options.selectOnError !== false
    if (selectOnError && isInputLike(targetRef.current)) {
      targetRef.current.select()
    }
  }

  const clipboardCopy = (text: string) => {
    copy(text).then(handleSuccess).catch(handleError)
  }

  const copyHandler = useCallback((text?: string | HTMLElement) => {
    if (typeof text === 'string') {
      clipboardCopy(text)
    } else if (targetRef.current) {
      clipboardCopy(targetRef.current.value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    copy: copyHandler,
    target: targetRef
  }
}

export default useClipboard

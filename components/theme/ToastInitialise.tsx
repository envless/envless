import { useActor, useMachine, normalizeProps } from '@zag-js/react'
import * as toast from '@zag-js/toast'
import { createContext, useContext } from 'react'
import { Portal } from '@zag-js/react'

interface PropTypes{
    state: State, send: Send, normalize: NormalizeProps<PropTypes>
}

// 1. Create the single toast
function Toast(props) {
    console.log(props);
    const [state, send] = useActor(props.actor)
    const api = toast.connect<PropTypes>(state, send, normalizeProps)
    // console.log(api)
    // debugger
    const jsx = api.render()
    // console.log(jsx);


    if (jsx) {
        return <div {...api.rootProps}>{jsx}</div>
    }

    return (
        <div {...api.rootProps}>
            <h3 {...api.titleProps}>{api.title}</h3>
            <p {...api.descriptionProps}>{api.description}</p>
            <button onClick={api.dismiss}>Close</button>
        </div>
    )
}

const ToastContext = createContext<null>(null)
export const useToast = () => useContext(ToastContext)

// 3. Create the toast group provider
export function ToastProvider({ children }) {
    const [state, send] = useMachine(toast.group.machine({ id: '1' }))

    const api = toast.group.connect(state, send, normalizeProps)

    return (
        <ToastContext.Provider value={api}>
            <Portal>
                {Object.entries(api.toastsByPlacement).map(([placement, toasts]) => (
                    <div key={placement} {...api.getGroupProps({ placement })}>
                        {toasts.map((toast) => (
                            <Toast key={toast.id} actor={toast} />
                        ))}
                    </div>
                ))}
            </Portal>

            {children}
        </ToastContext.Provider>
    )
}
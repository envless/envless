import React from 'react'
import { showToast } from './showToast'
import { useToast } from './ToastInitialise'
function ExampleComponent() {
    const toast = useToast()

    return (
        <div>
            <button
                onClick={() => {
                    // toast.create({ title: 'Hello', placement: 'top-right' })
                    showToast({
                        title: 'Hello', placement: 'top-right', type: "success",
                        toast: toast, description: "Nothing", duration: 40000
                    })
                }}
            >
                Add top-right toast
            </button>
        </div>
    )
}
export default ExampleComponent
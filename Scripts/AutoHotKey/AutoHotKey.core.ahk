; ====================
; Quick text navigation
; ====================

; --------------------
; [Ctrl + Alt + arrow keys] send 4 [arrow keys]
; --------------------

^!Right:: {
    Loop 4 {
        Send '{Right}'
    }
}

^!Left:: {
    Loop 4 {
        Send '{Left}'
    }
}

^!Up:: {
    Loop 4 {
        Send '{Up}'
    }
}

^!Down:: {
    Loop 4 {
        Send '{Down}'
    }
}

; --------------------
; [Ctrl + Shift + Alt + arrow keys] send 4 [Shift + arrow keys]
; --------------------

^!+Right:: {
    Loop 4 {
        Send '+{Right}'
    }
}

^!+Left:: {
    Loop 4 {
        Send '+{Left}'
    }
}

^!+Up:: {
    Loop 4 {
        Send '+{Up}'
    }
}

^!+Down:: {
    Loop 4 {
        Send '+{Down}'
    }
}

; --------------------
; [Ctrl + Win + z] lower mouse DPI while holding
; --------------------

SetMouseSpeed(speed) {
    DllCall("SystemParametersInfo", "UInt", 0x71, "UInt", 0, "UInt", speed, "UInt", 0x01)
}

^#z:: {
    SetMouseSpeed(1)  ; Slow
}

^#z up:: {
    SetMouseSpeed(10) ; Restore
}

; --------------------
; [Ctrl + Win + arrow keys] send 4 [Ctrl + arrow keys]
; --------------------

^#Right:: {
    Loop 4 {
        Send '^{Right}'
    }
}

^#Left:: {
    Loop 4 {
        Send '^{Left}'
    }
}

; --------------------
; [Ctrl + Shift + Win + arrow keys] send 4 [Ctrl + Shift + arrow keys]
; --------------------

^#+Right:: {
    Loop 4 {
        Send '^+{Right}'
    }
}

^#+Left:: {
    Loop 4 {
        Send '^+{Left}'
    }
}

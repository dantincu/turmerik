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
; [Ctrl + Win + Alt + arrow keys] send 16 [arrow keys]
; --------------------

^#!Right:: {
    Loop 16 {
        Send '{Right}'
    }
}

#^!Left:: {
    Loop 16 {
        Send '{Left}'
    }
}

^#!Up:: {
    Loop 16 {
        Send '{Up}'
    }
}

^#!Down:: {
    Loop 16 {
        Send '{Down}'
    }
}

; --------------------
; [Ctrl + Shift + Win + Alt + arrow keys] send 16 [Shift + arrow keys]
; --------------------

^#!+Right:: {
    Loop 16 {
        Send '+{Right}'
    }
}

^#!+Left:: {
    Loop 16 {
        Send '+{Left}'
    }
}

^#!+Up:: {
    Loop 16 {
        Send '+{Up}'
    }
}

^#!+Down:: {
    Loop 16 {
        Send '+{Down}'
    }
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

#define INITGUID
#include <windows.h>
#include <shobjidl.h>
#include <propvarutil.h>
#include <propsys.h>
#include <shlguid.h>
#include <iostream>

// Paste this block right here:
const PROPERTYKEY PKEY_AppUserModel_ID = {
    {0x9F4C2855, 0x9F79, 0x4B39, {0xA8, 0xD0, 0xE1, 0xD4, 0x2D, 0xE1, 0xD5, 0xF3}},
    5
};

int wmain(int argc, wchar_t* argv[])
{
    if (argc != 3)
    {
        std::wcout << L"Usage: SetAppUserModelID.exe <shortcutPath> <AppUserModelID>" << std::endl;
        return 1;
    }

    // const wchar_t* shortcutPath = argv[1];
    wchar_t expandedPath[MAX_PATH];
    ExpandEnvironmentStringsW(argv[1], expandedPath, MAX_PATH);

    const wchar_t* appId = argv[2];

    CoInitialize(nullptr);

    IShellLink* pShellLink = nullptr;
    HRESULT hr = CoCreateInstance(CLSID_ShellLink, nullptr, CLSCTX_INPROC_SERVER, IID_IShellLink, (void**)&pShellLink);

    if (SUCCEEDED(hr))
    {
        IPersistFile* pPersistFile = nullptr;
        hr = pShellLink->QueryInterface(IID_IPersistFile, (void**)&pPersistFile);

        if (SUCCEEDED(hr))
        {
            hr = pPersistFile->Load(expandedPath, STGM_READWRITE);
            if (SUCCEEDED(hr))
            {
                IPropertyStore* pPropStore = nullptr;
                hr = pShellLink->QueryInterface(IID_IPropertyStore, (void**)&pPropStore);

                if (SUCCEEDED(hr))
                {
                    PROPVARIANT pv;
                    InitPropVariantFromString(appId, &pv);

                    PROPERTYKEY key = PKEY_AppUserModel_ID;
                    hr = pPropStore->SetValue(key, pv);
                    if (SUCCEEDED(hr))
                    {
                        hr = pPropStore->Commit();
                        if (SUCCEEDED(hr))
                        {
                            hr = pPersistFile->Save(expandedPath, TRUE);
                            if (SUCCEEDED(hr))
                            {
                                std::wcout << L"AppUserModelID set successfully." << std::endl;
                            }
                        }
                    }

                    PropVariantClear(&pv);
                    pPropStore->Release();
                }
            }
            pPersistFile->Release();
        }
        pShellLink->Release();
    }

    CoUninitialize();
    return 0;
}

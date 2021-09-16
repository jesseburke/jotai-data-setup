import React, { useState, useRef, useEffect, useCallback } from 'react';
import { atom, useAtom } from 'jotai';

import queryString from 'query-string-esm';

export default function NumberData(initVal = 0) {
    const at = atom(initVal);

    const readWriteAtom = atom(null, (get, set, action) => {
        switch (action.type) {
            case 'reset':
                set(at, initVal);
                break;

            case 'readToAddressBar':
                if (get(at) === initVal) return;

                action.callback({ val: get(at) });

                break;

            case 'writeFromAddressBar':
                const objStr = action.value;

                if (!objStr || !objStr.length || objStr.length === 0) {
                    set(at, initVal);
                    return;
                }

                const rawObj = queryString.parse(objStr);

                const newKeys = Object.keys(rawObj);

                const nro = {};

                if (!newKeys.includes('val')) {
                    set(at, initVal);
                    break;
                }

                set(at, Number(rawObj.val));
                break;
        }
    });

    return { atom: at, readWriteAtom };
}
